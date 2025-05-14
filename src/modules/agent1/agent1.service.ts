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
import { Injectable } from '@nestjs/common';
import { ariesAskar } from '@hyperledger/aries-askar-nodejs';

@Injectable()
export class Agent1Service {
  bobAgent: Agent;

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
      this.bobAgent = agent;
      console.log(`${config.label} is initialized`);
      return agent;
    } catch (error) {
      console.error('Error initializing Bob agent:', error);
      throw error;
    }
  }
  getAgent(): Agent {
    if (!this.bobAgent) {
      throw new Error('Bob agent is not initialized');
    }
    return this.bobAgent;
  }
}
