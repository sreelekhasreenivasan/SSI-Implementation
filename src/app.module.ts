import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Agent1Module } from './modules/agent1/agent1.module';
import { Agent2Module } from './modules/agent2/agent2.module';
import { ConnectionModule } from './modules/connection/connection.module';

@Module({
  imports: [Agent1Module, Agent2Module, ConnectionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
