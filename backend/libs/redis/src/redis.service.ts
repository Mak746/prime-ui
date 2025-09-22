import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parse, stringify } from 'flatted';
import Redis, { RedisOptions } from 'ioredis';
import JSONCache from './json-lib/jsonCache';
import { REDIS_MODULE_OPTIONS } from './redis.constants';
import { RedisModuleOptions } from './redis.module';

@Injectable()
export class RedisService {
  private readonly connection: Redis;

  constructor(
    @Inject(REDIS_MODULE_OPTIONS)
    private readonly redisModuleOptions: RedisModuleOptions,
    private readonly configService: ConfigService,
  ) {
    this.connection = this.createConnection();
  }

  async getToken(key: string): Promise<string> {
    const value = await this.connection.get(key);
    return value ? (parse(value) as string) : null;
  }
  async getValue<T>(key: string): Promise<T> {
    const jsonCache = new JSONCache<T>(this.connection, {});
    return await jsonCache.get(key);
  }

  async saveToken(
    key: string,
    value: string,
    expireMs?: number,
  ): Promise<boolean> {
    const jsonValue = stringify(value);
    const result = expireMs
      ? await this.connection.set(key, jsonValue, 'PX', expireMs)
      : await this.connection.set(key, jsonValue);
    return result === 'OK';
  }
  async putValue<T>(
    key: string,
    value: any,
    expireMs?: number,
  ): Promise<boolean> {
    const jsonCache = new JSONCache<T>(this.connection, {});
    const r = expireMs
      ? await jsonCache.set(key, value as T, { expire: expireMs })
      : await jsonCache.set(key, value as T);
    return r === 'OK';
  }

  async deleteEntry(key: string): Promise<boolean> {
    const result = await this.connection.del(key);
    return result > 0;
  }

  async keys(pattern = '*'): Promise<Set<string>> {
    return new Promise((resolve) => {
      const stream = this.connection.scanStream({
        match: pattern,
        count: 1000,
      });

      const keysSet = new Set<string>();

      stream.on('data', (keys) => {
        stream.pause();
        keys.forEach((key) => keysSet.add(key));
        stream.resume();
      });

      stream.on('end', () => {
        resolve(keysSet);
      });
    });
  }

  getConnection(): Redis {
    return this.connection;
  }

  async checkConnection(): Promise<{ status: boolean; message?: string }> {
    return new Promise((resolve) => {
      const testConn = this.createConnection({
        enableReadyCheck: true,
        connectTimeout: 3000,
        retryStrategy() {
          return null;
        },
      });

      testConn.once('ready', () => {
        resolve({ status: true });
        testConn.disconnect();
      });

      testConn.once('error', (e) => {
        resolve({ status: false, message: e.message });
      });
    });
  }

  private createConnection(extraOptions: RedisOptions = {}): Redis {
    const host =
      this.redisModuleOptions?.host ?? this.configService.get('redis.host');
    const port =
      this.redisModuleOptions?.port ?? this.configService.get('redis.port');
    const username =
      this.redisModuleOptions?.username ?? this.configService.get('redis.user');
    const password =
      this.redisModuleOptions?.password ??
      this.configService.get('redis.password');
    const db =
      this.redisModuleOptions?.db ?? this.configService.get('redis.db');
    const keyPrefix =
      this.redisModuleOptions?.keyPrefix ??
      this.configService.get('redis.keyPrefix');
    return new Redis({
      port,
      host,
      username,
      password,
      db,
      keyPrefix,
      ...extraOptions,
    });
  }
}
