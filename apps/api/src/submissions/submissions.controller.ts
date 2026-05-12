import { Body, Controller, Get, Param, Post, Req, UseGuards, UploadedFile, UseInterceptors, BadRequestException, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SubmissionsService } from './submissions.service';
import { RequestWithUser } from '../auth/types/request-with-user';

@Controller()
export class SubmissionsController {
  constructor(private submissionsService: SubmissionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('submissions')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Req() request: RequestWithUser,
    @Body() body: CreateSubmissionDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Evidence image is required');
    }
    const submission = await this.submissionsService.create(request.user.sub, body, file.buffer, file.originalname);
    return { status: 'success', data: { submission } };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('submissions/my')
  async my(@Req() request: RequestWithUser) {
    return { status: 'success', data: { submissions: await this.submissionsService.findMySubmissions(request.user.sub) } };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('admin/submissions')
  async pending(@Query('status') status?: string) {
    const submissions = await this.submissionsService.findPending();
    return { status: 'success', data: { submissions } };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post('admin/submissions/:id/approve')
  async approve(@Param('id') id: string, @Req() request: RequestWithUser) {
    const submission = await this.submissionsService.approve(id, request.user.sub);
    return { status: 'success', data: { submission } };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post('admin/submissions/:id/reject')
  async reject(@Param('id') id: string, @Req() request: RequestWithUser, @Body('rejectionReason') rejectionReason: string) {
    const submission = await this.submissionsService.reject(id, request.user.sub, rejectionReason);
    return { status: 'success', data: { submission } };
  }
}
