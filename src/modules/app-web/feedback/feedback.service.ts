import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from './feedback.entity';
import { DataSource, Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { FeedbackListDto } from './dto/list.dto';
import { PagingResponse } from 'src/constants/common.constants';
import { EditFeedbackDto } from './dto/edit.dto';
import { AddFeedbackDto } from './dto/add.dto';

@Injectable()
export class AppFeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly repository: Repository<Feedback>,
    private dataSource: DataSource,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async findAll(params: FeedbackListDto): Promise<PagingResponse<Feedback>> {
    // this.cacheManager.set('key', 1);
    // console.log(
    //   this.configService.get('DATABASE_HOST'),
    //   this.configService.get('database.host'),
    //   await this.cacheManager.get('key'),
    //   await this.repository.findAndCount({
    //     where: {
    //       ...params.params,
    //     },
    //   }),
    // );
    const [items, total] = await this.repository.findAndCount({
      where: {
        ...params.params,
      },
    });
    const { pageSize, pageNum } = params;
    return {
      records: items,
      total,
      pageSize,
      current: pageNum,
      pages: Math.ceil(total / pageSize),
    };
    // return await this.repository
    //   // .createQueryBuilder()
    //   // .where({ deleted: 0 })
    //   // .select(['user_name', 'email'])
    //   // .getMany();
    //   .find();
  }
  getDetail(id: number): Promise<Feedback> {
    return this.repository.findOne({
      where: { id },
    });
  }
  async update(user: EditFeedbackDto): Promise<Feedback> {
    return this.repository.save({
      ...user,
    });
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async createMany(users: Feedback[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(users[0]);
      await queryRunner.manager.save(users[1]);
      await queryRunner.commitTransaction();
    } catch (error) {
      // 如果遇到错误可以回滚事务
      await queryRunner.rollbackTransaction();
    } finally {
      //  手动实例化并部署一个queryRunner
      await queryRunner.release();
    }
  }

  async create(user: AddFeedbackDto) {
    return this.repository.create({
      ...user,
    });
  }
}
