import { HttpModule } from '@nestjs/axios';
import { CacheModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ApiConfigService } from './services/api-config.service';
// import { AwsS3Service } from './services/aws-s3.service';
import { GeneratorService } from './services/generator.service';
import { TranslationService } from './services/translation.service';
import { ValidatorService } from './services/validator.service';
import * as redisStore from 'cache-manager-redis-store';
// import { AwsS3Service } from './services/aws-s3.service';

const providers = [
  ApiConfigService,
  ValidatorService,
  // AwsS3Service,
  GeneratorService,
  TranslationService,
  CacheModule,
  // {
  //   provide: 'NATS_SERVICE',
  //   useFactory: (configService: ApiConfigService) => {
  //     const natsConfig = configService.natsConfig;
  //     return ClientProxyFactory.create({
  //       transport: Transport.NATS,
  //       options: {
  //         name: 'NATS_SERVICE',
  //         url: `nats://${natsConfig.host}:${natsConfig.port}`,
  //       },
  //     });
  //   },
  //   inject: [ApiConfigService],
  // },
];

@Global()
@Module({
  providers,
  imports: [
    HttpModule,
    ConfigModule,
    // CacheModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ApiConfigService) => ({
    //     store: redisStore,
    //     host: configService.cacheModuleConfig.host,
    //     port: configService.cacheModuleConfig.port,
    //     pass: configService.cacheModuleConfig.pass,
    //   }),
    //   inject: [ApiConfigService],
    // }),
  ],
  exports: [...providers, HttpModule],
})
export class SharedModule {}
