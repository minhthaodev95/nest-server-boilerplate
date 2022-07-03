import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from 'lodash';
import path from 'path';
import type { Dialect } from 'sequelize/types';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get awsS3Config() {
    return {
      bucketRegion: this.getString('AWS_S3_BUCKET_REGION'),
      bucketApiVersion: this.getString('AWS_S3_API_VERSION'),
      bucketName: this.getString('AWS_S3_BUCKET_NAME'),
    };
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get fallbackLanguage(): string {
    return this.getString('FALLBACK_LANGUAGE').toLowerCase();
  }

  // get cacheModuleConfig() {
  //   return {
  //     host: this.getString('REDIS_HOST'),
  //     port: this.getNumber('REDIS_PORT'),
  //     pass: this.getNumber('REDIS_PASSS'),
  //     ttlOtp: this.getNumber('TTL_OTP'),
  //   };
  // }

  // get mailConfig() {
  //   return {
  //     host: this.getString('MAIL_HOST'),
  //     user: this.getString('MAIL_USER'),
  //     pass: this.getString('MAIL_PASS'),
  //     from: this.getString('MAIL_FROM'),
  //   };
  // }

  private getDialect(key: string): Dialect {
    const value = this.get(key).replace(/\\n/g, '\n');
    return (value as Dialect) || 'mysql';
  }

  get databaseConfig(): Sequelize {
    const sequelize = new Sequelize({
      username: this.getString('DATABASE_USER'),
      password: this.getString('DATABASE_PASSWORD'),
      database: this.getString('DATABASE_NAME'),
      host: this.getString('DATABASE_HOST'),
      port: this.getNumber('DATABASE_PORT'),
      dialect: this.getDialect('DATABASE_DIALECT'),
      logging: false,
      modelPaths: [path.join(__dirname + '../../../entities')],
      pool: {
        max: 10,
        min: 0,
        idle: 1000,
      },
    });
    return sequelize;
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }

  // get natsEnabled(): boolean {
  //   return this.getBoolean('NATS_ENABLED');
  // }

  // get natsConfig() {
  //   return {
  //     host: this.getString('NATS_HOST'),
  //     port: this.getNumber('NATS_PORT'),
  //   };
  // }

  get authConfig() {
    return {
      jwtSecret: this.getString('JWT_SECRET_KEY'),
      jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
      jwtRefreshSecret: this.getString('JWT_REFRESH_TOKEN_SECRET'),
      jwtRefreshExpirationTime: this.getNumber(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      ),
      jwtVerifyOtpExpirationTime: this.getNumber('JWT_OTP_EXPIRATION_TIME'),
      jwtVerifyOtpSecret: this.getString('JWT_OTP_SECRET'),
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    };
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }
}
