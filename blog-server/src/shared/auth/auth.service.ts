import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, from, of } from 'rxjs';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJWT(user): Observable<string> {
    return from(this.jwtService.signAsync({ user }));
  }

  hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password, 12));
  }

  comparePasswords(
    newPassword: string,
    passwortHash: string,
  ): Observable<any | boolean> {
    return from<any | boolean>(bcrypt.compare(newPassword, passwortHash));
  }
}
