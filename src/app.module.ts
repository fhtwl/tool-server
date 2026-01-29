import {
  Dependencies,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
// import { CatsController } from './modules/cats/cats.controller';
import { AppService } from './app.service';
import { AutoRegisterModule } from './utils/auto-register.util';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/any-exception.filter';
import { RequestValidationPipe } from './common/pipes/validation.pipe';
import { RolesGuard } from './common/guard/roles.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UnderlineStyleNamingStrategy } from './common/strategy/underline-style-naming.strategy';
import configuration from './config/configuration';
import {
  // CacheInterceptor,
  CacheModule,
} from '@nestjs/cache-manager';
// import { redisStore } from 'cache-manager-redis-yet';
// import { RedisClientOptions } from 'redis';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { BullConfigServcice } from './bull/bull-config.service';
// import { MulterModule } from '@nestjs/platform-express';
// import multer from 'multer';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

import { SessionGuard } from './common/guard/session.guard';
import { JwtAuthGuard } from './common/guard/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { TimestampInterceptor } from './common/interceptors/timestamp.interceptor';
import { MulterModule } from '@nestjs/platform-express';
// import { redisStore } from 'cache-manager-redis-yet';

@Dependencies(DataSource)
@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.development.env'],
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres' ,// 'mysql',// 'postgres',
      host: configuration().database.host,
      port: configuration().database.port,
      username: configuration().database.username,
      password: configuration().database.password,
      database: configuration().database.name,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      retryAttempts: 10, // 重试连接数据库的次数
      retryDelay: 30000, // 两次重试连接的间隔
      autoLoadEntities: true, // 自动加载实体
      namingStrategy: new UnderlineStyleNamingStrategy(),
      // ssl: {
      //   rejectUnauthorized: true,
      // },
      ssl:false,
      synchronize: true, // 如果为true，将在应用启动时自动创建数据库表
      logging: true, // 启用日志记录，查看生成的 SQL 查询
    }),
    // CacheModule.registerAsync<RedisClientOptions>({
    //   isGlobal: true,
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => {
    //     const redisConfig = await configService.get('redis');
    //     console.log('redisConfig', redisConfig, process.env.NODE_ENV);
    //     return {
    //       store: await redisStore({
    //         socket: {
    //           host: redisConfig.host,
    //           port: redisConfig.port,
    //         },
    //         password: redisConfig.password,
    //         database: redisConfig.db,
    //         ttl: redisConfig.ttl,
    //       }),
    //       // host: redisConfig.host,
    //       // port: redisConfig.port,
    //       // password: redisConfig.password,
    //       // database: redisConfig.db,
    //       ttl: 5,
    //     };
    //   },
    // }),
    CacheModule.register({
      ttl: 60000, // 缓存时间 ms
      max: 10, // 缓存最大存储数量
      isGlobal: true, // 是否全局使用
    }),
    AutoRegisterModule.registerModules({
      path: '../modules',
    }),
    // AutoRegisterModule.registerControllers({
    //   path: '../modules',
    // }),
    ScheduleModule.forRoot(),
    BullModule.registerQueueAsync({
      name: 'audio', // 队列名称
      imports: [ConfigModule],
      useClass: BullConfigServcice,
    }),
    EventEmitterModule.forRoot(),
    // MulterModule.register({
    //   dest: '/uploads',
    // }),
    // MulterModule.register({
    //   storage: multer.diskStorage({
    //     destination: '/uploads', // 上传文件目录
    //     filename: (req, file, cb) => {
    //       // 生成文件名
    //       const filename = `${Date.now()}-${Math.round(
    //         Math.random() * 1e9,
    //       )}.${file.originalname.split('.').pop()}`;

    //       cb(null, filename);
    //     },
    //   }),
    // }),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   // 自动生成schema.graphql文件
    //   autoSchemaFile: 'schema.graph',
    //   // driver: ApolloDriver,
    //   // // playground: false,
    //   // typePaths: ['**/*.graphql'],
    // }),
    // GraphQLModule.forRootAsync<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   useFactory: () => ({
    //     autoSchemaFile: true,
    //   }),
    // }),
  ],
  controllers: [AppController], // , CatsController
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter, // 对所有的error进行处理
    },

    {
      provide: APP_PIPE,
      useClass: RequestValidationPipe, // 对所有的http请求校验进行处理
    },

    {
      provide: APP_GUARD,
      useClass: RolesGuard, // 全局守卫
    },
    {
      provide: APP_GUARD,
      useClass: SessionGuard, // 对所有的http请求校验进行处理
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // 全局身份验证
    },

    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor, // get请求缓存
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimestampInterceptor, // http请求返回值拦截处理
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor, // http请求返回值拦截处理
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
