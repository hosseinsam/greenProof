import { Body, Controller, Get, Param, Post, Req, Res, UseGuards, UploadedFile, UseInterceptors, BadRequestException, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SubmissionType } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ApproveSubmissionDto, RejectSubmissionDto } from './dto/review-submission.dto';
import { SubmissionsService } from './submissions.service';
import { RequestWithUser } from '../auth/types/request-with-user';
import { SimpleRateLimitGuard } from '../common/guards/simple-rate-limit.guard';

@ApiTags('Submissions')
@Controller()
export class SubmissionsController {
  constructor(private submissionsService: SubmissionsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new evidence submission with an image attachment' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['projectId', 'speciesId', 'type', 'title', 'description', 'file'],
      properties: {
        projectId: { type: 'string' },
        speciesId: { type: 'string' },
        type: { type: 'string', enum: Object.values(SubmissionType) },
        title: { type: 'string' },
        description: { type: 'string' },
        latitude: { type: 'number' },
        longitude: { type: 'number' },
        locationPrecision: { type: 'string' },
        file: { type: 'string', format: 'binary' }
      }
    }
  })
  @UseGuards(AuthGuard('jwt'), SimpleRateLimitGuard)
  @Post('submissions')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_request, file, callback) => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
        callback(new BadRequestException('Evidence file must be a jpg, png, or webp image'), false);
        return;
      }
      callback(null, true);
    }
  }))
  async create(
    @Req() request: RequestWithUser,
    @Body() body: CreateSubmissionDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Evidence image is required');
    }
    const submission = await this.submissionsService.create(request.user.sub, body, file);
    return { status: 'success', data: { submission } };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'List submissions created by the authenticated user' })
  @UseGuards(AuthGuard('jwt'))
  @Get('submissions/my')
  async my(@Req() request: RequestWithUser) {
    return { status: 'success', data: { submissions: await this.submissionsService.findMySubmissions(request.user.sub) } };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Preview evidence for the owner or an admin reviewer' })
  @UseGuards(AuthGuard('jwt'))
  @Get('submissions/:id/evidence')
  async evidence(@Param('id') id: string, @Req() request: RequestWithUser, @Res() res: Response) {
    const result = await this.submissionsService.getEvidence(id, request.user);
    res.type(result.mimeType).sendFile(result.absolutePath);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'List pending submissions for admin review' })
  @ApiQuery({ name: 'status', required: false, example: 'PENDING' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('admin/submissions')
  async pending(@Query('status') _status?: string) {
    const submissions = await this.submissionsService.findPending();
    return { status: 'success', data: { submissions } };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve a submission and mint its reward' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post('admin/submissions/:id/approve')
  async approve(@Param('id') id: string, @Req() request: RequestWithUser, @Body() body: ApproveSubmissionDto) {
    const submission = await this.submissionsService.approve(id, request.user.sub, body);
    return { status: 'success', data: { submission } };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a submission with a reason' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post('admin/submissions/:id/reject')
  async reject(@Param('id') id: string, @Req() request: RequestWithUser, @Body() body: RejectSubmissionDto) {
    const submission = await this.submissionsService.reject(id, request.user.sub, body);
    return { status: 'success', data: { submission } };
  }
}
