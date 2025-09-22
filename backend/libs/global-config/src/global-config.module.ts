import { Module } from '@nestjs/common';
import { GlobalConfigService } from './services';
import { GlobalConfigEntity } from '@app/db/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalConfigController } from './controllers';
import { RedisModule } from '@app/redis';
import { ConfigModule } from '@app/config';
import { ConfigService } from '@nestjs/config';
import { AuditInterceptor } from './audit';
import { APP_INTERCEPTOR } from '@nestjs/core';
@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      injects: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('redis'),
    }),
    TypeOrmModule.forFeature([GlobalConfigEntity]),
  ],
  controllers: [GlobalConfigController],
  providers: [
    GlobalConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
  exports: [GlobalConfigService],
})
export class GlobalConfigModule {}
