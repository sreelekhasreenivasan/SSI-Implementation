import { Module } from '@nestjs/common';
import { CredentialsService } from './service';
import { CredentialsController } from './controller';
import { AcmeModule } from '../acme-agent/module';

@Module({
  imports: [AcmeModule],
  providers: [CredentialsService],
  controllers: [CredentialsController],
})
export class CredentialsModule {}
