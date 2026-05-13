import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@Controller()
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @ApiOperation({ summary: 'List public projects' })
  @Get('projects')
  async list() {
    return { status: 'success', data: { projects: await this.projectsService.findMany() } };
  }

  @ApiOperation({ summary: 'Get a project by id' })
  @Get('projects/:id')
  async detail(@Param('id') id: string) {
    return { status: 'success', data: { project: await this.projectsService.findOne(id) } };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a project' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post('admin/projects')
  async create(@Body() body: CreateProjectDto) {
    return { status: 'success', data: { project: await this.projectsService.create(body) } };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a project' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Patch('admin/projects/:id')
  async update(@Param('id') id: string, @Body() body: UpdateProjectDto) {
    return { status: 'success', data: { project: await this.projectsService.update(id, body) } };
  }
}
