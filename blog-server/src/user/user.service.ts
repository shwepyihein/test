import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from './model/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../shared/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { Repository, Like } from 'typeorm';
import { map, switchMap, flatMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { CreateUserDto, LoginUserDto } from './model/user.dto';


@Injectable()
export class UserService {
 constructor( @InjectRepository(UserEntity)
  private readonly userRepo: Repository<UserEntity>,
  private readonly authService: AuthService,
   private readonly configService: ConfigService,
 ) { }
  
  
   createUser(data: CreateUserDto) {
    let { password, username, email } = data;
    return this.authService.hashPassword(password).pipe(
      switchMap((passwordHash: string) => {
        let newUser = {
          password: passwordHash,
          username: username.toLowerCase(),
          email: email.toLowerCase(),
        };

        return from(
          this.userRepo.save(newUser).catch(err => {
            switch (err.name) {
              case 'QueryFailedError':
                throw new BadRequestException(err.detail);
              default:
                throw new InternalServerErrorException(err);
            }
          }),
        ).pipe(
          flatMap(user => {
            return this.authService
              .generateJWT({ id: user.id, role: user.role })
              .pipe(
                map((jwt: string) => {
                  return { token: jwt, id: user.id };
                }),
              );
          }),
        );
      }),
    );
  }
    loginUser(data: LoginUserDto) {
    return from(
      this.userRepo.findOne({
        where: { email: data.email },
      }),
    ).pipe(
      switchMap(user => {
        if (user) {
          return this.authService
            .comparePasswords(data.password, user.password)
            .pipe(
              flatMap((match: boolean) => {
                if (match) {
                  return this.authService
                    .generateJWT({ id: user.id, role: user.role })
                    .pipe(
                      map((jwt: string) => {
                        return { token: jwt, id: user.id };
                      }),
                    );
                } else {
                  throw new BadRequestException('Password incorrect!');
                }
              }),
            );
        } else {
          throw new NotFoundException('User is not found!');
        }
      }),
    );
  }
}
