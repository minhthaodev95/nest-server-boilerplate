import { Sequelize } from 'sequelize-typescript';

import { ApiConfigService } from '../shared/services/api-config.service';

export const databaseProviders = [
  {
    provide: Sequelize.name,
    useFactory: (configService: ApiConfigService): Sequelize => configService.databaseConfig,
    inject: [ApiConfigService],
  },
];
