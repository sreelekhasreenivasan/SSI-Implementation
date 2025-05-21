import { Module } from '@nestjs/common';
import { BobService } from './service';
import { BobController } from './controller';

@Module({
  providers: [BobService],
  controllers: [BobController],
  exports: [BobService],
})
export class BobModule {}
