
import { AuthModule } from '@app/auth';
import { AuthenticationGuard } from '@app/auth/guards';
import { ConfigModule } from '@app/config';
import { GlobalConfigModule } from '@app/global-config';
import { LoggerModule } from '@app/logger';
import { NotificationModule } from '@app/notification';
import { TypeOrmModule } from '@app/typeorm';
import { UserModule } from '@app/user';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ENTITIES } from '@app/db';
import { JsonBodyMiddleware } from '@app/shared/middleware/json-body.middleware';


@Module({
  imports: [
        GlobalConfigModule,
    ConfigModule.forRoot({ expandVariables: true }),
    LoggerModule.forRoot(),
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature(ENTITIES),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          // below a user can make 10 requests within 60 seconds (60000 msec)
          name: 'default',
          // ttl: the time to live
          ttl: config.get('THROTTLE_TTL') || 60000,
          // limit:  the maximum number of requests within the ttl
          limit: config.get('THROTTLE_LIMIT') || 10,
          // storage: new ThrottlerStorageRedisService(config.get('redis')),
        },
      ],
    }),
        EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),
        NotificationModule,
    AuthModule,
    NotificationModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
        AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(JsonBodyMiddleware).forRoutes('*');

    // initialize firebase for push notifications

  }
}
