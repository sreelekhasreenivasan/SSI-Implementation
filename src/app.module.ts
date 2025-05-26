import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectionModule } from './modules/connection/module';
import { AcmeModule } from './modules/acme-agent/module';
import { BobModule } from './modules/bob-agent/module';
import { CredentialModule } from './modules/credential/credential.module';
import { LedgerModule } from './modules/ledger/module';

@Module({
  imports: [
    AcmeModule,
    BobModule,
    ConnectionModule,
    LedgerModule,
    CredentialModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
