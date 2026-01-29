// import { Expose } from 'class-transformer';
// import { TimestampTransformer } from 'src/common/transformer/timestamp.transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RedemptionCodeStatus } from './interfaces/redemption-code.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

@Entity()
export class RedemptionCode {
  @ApiProperty()
  @IsInt()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({
    description: '兑换码',
  })
  code: string;

  @ApiProperty({
    description: '是否已兑换，0未，1已',
  })
  @Column()
  status: RedemptionCodeStatus;

  @ApiProperty({
    description: '批次名称',
  })
  @IsString()
  @Column()
  batchName: string;

  @ApiProperty({
    description: '单价',
  })
  @ApiProperty()
  @Column()
  price: number;

  @ApiProperty({
    description: '批次id',
  })
  @ApiProperty()
  @Column()
  batchId: number;

  @ApiProperty({
    description: '批次id',
  })
  @ApiProperty()
  @Column()
  activityId: number;

  @ApiProperty({
    description: '所属代理商',
  })
  @ApiProperty()
  @IsInt()
  @Column()
  userId: number;

  @ApiProperty({
    description: '所属学生',
  })
  // @IsInt()
  @Column({ nullable: true })
  studentId?: number;

  @ApiProperty()
  @Column({
    type: 'timestamp',
    default: () => `CURRENT_TIMESTAMP + INTERVAL 1 YEAR`,
  })
  expiredAt: string;

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
