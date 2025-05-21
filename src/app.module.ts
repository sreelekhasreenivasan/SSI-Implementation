import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectionModule } from './modules/connection/module';
import { CredentialsModule } from './modules/credentials/module';
import { AcmeModule } from './modules/acme-agent/module';
import { BobModule } from './modules/bob-agent/module';

@Module({
  imports: [AcmeModule, BobModule, ConnectionModule, CredentialsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
