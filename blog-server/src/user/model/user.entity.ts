import { Entity, Column, BeforeInsert, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/base-model/base-entity';
import { UserStatus, UserRole } from './user.enum';


@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ default: false })
  renting: boolean; 

  @Column({ default: UserRole.USER })
  role: UserRole;

  // @OneToMany(
  //   type => rentalHistoryEntity,
  //   rentalHistoryEntity => rentalHistoryEntity.user_id,
  //   { cascade: true },
  // )
  // rental_histories!: rentalHistoryEntity[];

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
    this.username = this.username.toLowerCase();
  }
}
