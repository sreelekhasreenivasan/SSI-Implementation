import { AskarModule } from '@credo-ts/askar';
import {
  Agent,
  ConnectionsModule,
  HttpOutboundTransport,
  InitConfig,
  OutOfBandModule,
  WsOutboundTransport,
} from '@credo-ts/core';
import { agentDependencies } from '@credo-ts/node';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ariesAskar } from '@hyperledger/aries-askar-nodejs';

@Injectable()
export class Agent1Service {
  public agent: Agent<any> | null = null;

  async initializeBobAgent() {
    try {
      const config: InitConfig = {
        label: 'docs-agent-Bob',
        walletConfig: {
          id: 'mainBob',
          key: 'demoagentbob00000000000000000000',
        },
      };

      const agent = new Agent({
        config,
        modules: {
          askar: new AskarModule({ ariesAskar }),
          connections: new ConnectionsModule({ autoAcceptConnections: true }),
          oob: new OutOfBandModule(),
        },
        dependencies: agentDependencies,
      });

      agent.registerOutboundTransport(new WsOutboundTransport());
      agent.registerOutboundTransport(new HttpOutboundTransport());

      await agent.initialize();
      console.log(`${config.label} is initialized`);
      this.setAgent(agent);
      return agent;
    } catch (error) {
      console.error('Error initializing Bob agent:', error);
      throw error;
    }
  }
  private setAgent(agent: Agent) {
    this.agent = agent;
  }
  public getAgent(): Agent {
    if (!this.agent) {
      throw new BadRequestException('Bob agent not initialized.');
    }
    return this.agent;
  }
}
