import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsString()
  @Column()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(1, 255)
  @Column()
  name: string;

  @ApiProperty()
  @IsString()
  @Column()
  password: string;

  @ApiProperty()
  @IsString()
  @Column()
  notes: string;

  @ApiProperty()
  @IsInt()
  @Column()
  parentId: number;

  @ApiProperty()
  @IsInt()
  @Column()
  level: number;

  @ApiProperty()
  @IsString()
  @Column()
  initial: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: string;
}
