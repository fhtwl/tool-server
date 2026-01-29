import { InjectRepository } from '@nestjs/typeorm';
import { SystemUser } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { SystemUserListDto } from './dto/list.dto';
import { PagingResponse } from 'src/constants/common.constants';
import { EditInfoDto } from './dto/edit-info.dto';
import { EditSystemUserDto } from './dto/edit.dto';
import { AddSystemUserDto } from './dto/add.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(SystemUser)
    private readonly userRepository: Repository<SystemUser>,
    private dataSource: DataSource,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async findAll(
    params: SystemUserListDto,
  ): Promise<PagingResponse<SystemUser>> {
    // this.cacheManager.set('key', 1);
    // console.log(
    //   this.configService.get('DATABASE_HOST'),
    //   this.configService.get('database.host'),
    //   await this.cacheManager.get('key'),
    //   await this.userRepository.findAndCount({
    //     where: {
    //       ...params.params,
    //     },
    //   }),
    // );
    const [items, total] = await this.userRepository.findAndCount({
      where: {
        // ...params.params,
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
    // return await this.userRepository
    //   // .createQueryBuilder()
    //   // .where({ deleted: 0 })
    //   // .select(['user_name', 'email'])
    //   // .getMany();
    //   .find();
  }
  getUserDetail(id: number): Promise<SystemUser> {
    return this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.user_name',
        'user.email',
        'user.info infoStr',
        'user.deleted',
        'role.name roleName',
        'role.id roleId',
        'role.menu_ids',
        'role.parent_id roleParentId',
        'menu.name menuName',
        'menu.id menuId',
        'menu.type menuType',
        'menu.show',
        'menu.serial_num',
        'menu.parent_id menuParentId',
        'menu.permission menuPermission',
      ])
      .innerJoin('system_role', 'role', 'FIND_IN_SET(role.id, user.role_ids)')
      .innerJoin('system_menu', 'menu', 'FIND_IN_SET(menu.id, role.menu_ids)')
      .where('user.id = :id', { id })
      .getRawOne();
    // return this.userRepository.findOne({
    //   where: { id },
    // });
  }

  async updateInfo(id: number, info: EditInfoDto) {
    return this.userRepository
      .createQueryBuilder()
      .update('user')
      .set({
        info: JSON.stringify(info),
      })
      .where('id = :id', { id })
      .execute();
  }

  async update(user: EditSystemUserDto): Promise<SystemUser> {
    return this.userRepository.save({
      ...user,
    });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async createMany(users: SystemUser[]) {
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

  async createUser(user: AddSystemUserDto) {
    return this.userRepository.create({
      ...user,
    });
  }
}
