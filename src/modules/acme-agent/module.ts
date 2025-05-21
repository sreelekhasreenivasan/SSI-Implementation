import { Module } from '@nestjs/common';
import { AcmeController } from './controller';
import { AcmeService } from './service';

@Module({
  controllers: [AcmeController],
  providers: [AcmeService],
  exports: [AcmeService],
})
export class AcmeModule {}
