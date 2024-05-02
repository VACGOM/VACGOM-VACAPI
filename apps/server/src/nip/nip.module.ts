import { Module } from '@nestjs/common';
import { NipService } from './nip.service';

@Module({
  imports: [],
  controllers: [],
  providers: [NipService],
})
export class NipModule {}
