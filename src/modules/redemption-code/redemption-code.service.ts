import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedemptionCodeListDto } from './dto/list.dto';
import { PagingResponse } from 'src/constants/common.constants';
import {
  EditRedemptionCodeDto,
  ExChangeRedemptionCodeDto,
} from './dto/edit.dto';
// import { SystemRole } from '../role/role.entity';
import { getTreeByList } from 'src/utils/tree.util';
// import { SystemMenu } from '../menu/menu.entity';
// import { sort } from 'src/utils/common.util';
import { AddRedemptionCodeDto, BatchAddRedemptionCodeDto } from './dto/add.dto';
import { RedemptionCode } from './redemption-code.entity';

@Injectable()
export class RedemptionCodeService {
  constructor(
    @InjectRepository(RedemptionCode)
    private readonly redemptionCodeRepository: Repository<RedemptionCode>,
    private dataSource: DataSource,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async findAll(
    params: RedemptionCodeListDto,
  ): Promise<PagingResponse<RedemptionCode>> {
    const [items, total] = await this.redemptionCodeRepository.findAndCount({
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
  }

  async getAgentUserTree() {
    const [items] = await this.redemptionCodeRepository.find();
    const tree = getTreeByList(
      items as unknown as Common.List,
      0,
    ) as unknown as System.Role[];
    return tree;
  }
  getUserDetail(id: number): Promise<RedemptionCode> {
    return this.redemptionCodeRepository.findOne({
      where: { id },
    });
  }

  async exChange(data: ExChangeRedemptionCodeDto) {
    return this.redemptionCodeRepository
      .createQueryBuilder()
      .update('redemption_code')
      .set({
        status: 1,
      })
      .where('code = :code', { code: data.code })
      .execute();
  }

  async update(user: EditRedemptionCodeDto): Promise<RedemptionCode> {
    return this.redemptionCodeRepository.save({
      ...user,
    });
  }

  async remove(ids: number | number[]): Promise<void> {
    await this.redemptionCodeRepository.delete(ids);
  }

  async createMany(users: RedemptionCode[]) {
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

  async add(user: AddRedemptionCodeDto) {
    const data = this.redemptionCodeRepository.create({
      ...user,
    });
    return this.redemptionCodeRepository.save(data);
  }

  async batchAdd(users: BatchAddRedemptionCodeDto) {
    return this.redemptionCodeRepository.save(users);
  }

  async batchEdit(users: BatchAddRedemptionCodeDto) {
    return this.redemptionCodeRepository.save(users);
  }
}
