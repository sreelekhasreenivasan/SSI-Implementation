import { Module } from '@nestjs/common';
import { LedgerService } from './service';
import { LedgerController } from './controller';
import { AcmeModule } from '../acme-agent/module';

@Module({
  imports: [AcmeModule],
  providers: [LedgerService],
  controllers: [LedgerController],
})
export class LedgerModule {}
