import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { ConnectionController } from './connection.controller';
import { Agent2Module } from '../agent2/agent2.module';
import { Agent1Module } from '../agent1/agent1.module';

@Module({
  imports: [Agent2Module, Agent1Module],
  providers: [ConnectionService],
  controllers: [ConnectionController],
})
export class ConnectionModule {}
