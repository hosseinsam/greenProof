import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RequestWithUser } from './types/request-with-user';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user or company account' })
  @ApiBody({ type: RegisterDto })
  @Post('register')
  async register(@Body() body: RegisterDto) {
    if (body.role !== Role.USER && body.role !== Role.COMPANY) {
      return { status: 'error', message: 'Public registration supports USER or COMPANY roles only' };
    }
    const user = await this.authService.register({
      email: body.email,
      password: body.password,
      name: body.name,
      role: body.role,
      companyName: body.companyName
    });
    return { status: 'success', data: { user } };
  }

  @ApiOperation({ summary: 'Login and receive a bearer token' })
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Body() body: LoginDto) {
    const result = await this.authService.validateUser(body.email, body.password);
    if (!result) {
      return { status: 'error', message: 'Invalid email or password' };
    }
    return { status: 'success', data: await this.authService.login(result) };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() request: RequestWithUser) {
    return { status: 'success', data: { user: request.user } };
  }
}
