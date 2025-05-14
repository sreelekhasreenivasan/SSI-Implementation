import { Module } from '@nestjs/common';
import { Agent1Service } from './agent1.service';
import { Agent1Controller } from './agent1.controller';

@Module({
  providers: [Agent1Service],
  controllers: [Agent1Controller],
  exports: [Agent1Service],
})
export class Agent1Module {}
