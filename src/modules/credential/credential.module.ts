import { Module } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CredentialController } from './credential.controller';
import { AcmeModule } from '../acme-agent/module';
import { BobModule } from '../bob-agent/module';

@Module({
  imports: [AcmeModule, BobModule],
  providers: [CredentialService],
  controllers: [CredentialController],
})
export class CredentialModule {}
