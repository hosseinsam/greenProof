import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RequestWithUser } from './types/request-with-user';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const user = await this.authService.register(body);
    return { status: 'success', data: { user } };
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const result = await this.authService.validateUser(body.email, body.password);
    if (!result) {
      return { status: 'error', message: 'Invalid email or password' };
    }
    return { status: 'success', data: await this.authService.login(result) };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() request: RequestWithUser) {
    return { status: 'success', data: { user: request.user } };
  }
}
