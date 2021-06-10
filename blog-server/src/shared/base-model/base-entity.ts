
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Generated,
} from 'typeorm';

@Entity()
export abstract class BaseEntity{
  @PrimaryGeneratedColumn()
  @Generated('increment')
  id: number;

  @CreateDateColumn()
  created_at?: Date;
  
  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at?:Date;
}