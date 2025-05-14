import { Controller, Get } from '@nestjs/common';
import { Agent2Service } from './agent2.service';

@Controller('agent2')
export class Agent2Controller {
  constructor(private readonly agent2Service: Agent2Service) {}

  @Get('acme')
  async initializeAcmeAgent() {
    const agent = await this.agent2Service.initializeAcmeAgent();
    return {
      message: 'Acme agent initialized',
      agent: {
        label: agent.config.label,
        walletId: agent.config?.walletConfig?.id,
        endpoints: agent.config.endpoints,
      },
    };
  }
}
