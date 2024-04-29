import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CodefModule } from './codef/codef.module';
import { ConfigModule } from '@nestjs/config';
import { RequestModule } from './request/request.module';

@Module({
  imports: [
    CodefModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
