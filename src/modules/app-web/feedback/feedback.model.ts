import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class FeedbackModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '标题' })
  @Column()
  title: string;

  @ApiProperty({ description: '内容' })
  @Column()
  content: string;

  @ApiProperty({ description: '图片列表' })
  @Column()
  imgs: string;

  @ApiProperty({ description: '反馈人' })
  @Column()
  userId: number;

  @ApiProperty({ description: '反馈人名称' })
  @Column()
  user: string;

  @ApiProperty({ description: '反馈人手机号' })
  @Column()
  userPhone: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: string;
}
