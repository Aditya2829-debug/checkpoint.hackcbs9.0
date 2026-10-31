import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI')?.trim();
        if (!uri) {
          throw new Error('Missing required environment variable: MONGODB_URI');
        }

        const collectionName = configService
          .get<string>('MONGODB_COLLECTION')
          ?.trim();
        if (!collectionName) {
          throw new Error(
            'Missing required environment variable: MONGODB_COLLECTION',
          );
        }

        return {
          uri,
          autoIndex: false,
          autoCreate: false,
          bufferCommands: false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
