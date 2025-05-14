import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { ConnectionController } from './connection.controller';
import { Agent1Service } from '../agent1/agent1.service';
import { Agent2Service } from '../agent2/agent2.service';

@Module({
  providers: [ConnectionService, Agent1Service, Agent2Service],
  controllers: [ConnectionController],
})
export class ConnectionModule {}
