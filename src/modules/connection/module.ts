import { Module } from '@nestjs/common';
import { ConnectionService } from './service';
import { ConnectionController } from './controller';
import { BobModule } from '../bob-agent/module';
import { AcmeModule } from '../acme-agent/module';

@Module({
  imports: [BobModule, AcmeModule],
  providers: [ConnectionService],
  controllers: [ConnectionController],
})
export class ConnectionModule {}
