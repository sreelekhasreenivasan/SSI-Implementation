import { Controller, Get } from '@nestjs/common';
import { Agent1Service } from './agent1.service';

@Controller('agent1')
export class Agent1Controller {
  constructor(private readonly agent1Service: Agent1Service) {}

  @Get('bob')
  async initializeBobAgent() {
    const agent = await this.agent1Service.initializeBobAgent();
    return { message: 'Bob agent initialized', agentLabel: agent.config.label };
  }
}
