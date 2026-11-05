import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

// Satu akun pilot yang di-hardcode, sesuai brief.
const PILOT_USERNAME = 'johndoe';
const PILOT_PASSWORD = 'susiairtest';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(dto: LoginDto) {
    if (dto.username !== PILOT_USERNAME || dto.password !== PILOT_PASSWORD) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const accessToken = await this.jwtService.signAsync({
      sub: PILOT_USERNAME,
    });
    return { accessToken };
  }
}