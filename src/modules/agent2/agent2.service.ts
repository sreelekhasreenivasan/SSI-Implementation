import { AskarModule } from '@credo-ts/askar';
import {
  Agent,
  ConnectionsModule,
  HttpOutboundTransport,
  InitConfig,
  OutOfBandModule,
  WsOutboundTransport,
} from '@credo-ts/core';
import { agentDependencies, HttpInboundTransport } from '@credo-ts/node';
import { Injectable } from '@nestjs/common';
import { ariesAskar } from '@hyperledger/aries-askar-nodejs';

@Injectable()
export class Agent2Service {
  public acmeAgent: Agent;
  async initializeAcmeAgent() {
    try {
      const config: InitConfig = {
        label: 'demo-agent-acme',
        walletConfig: {
          id: 'mainAcme',
          key: 'demoagentacme0000000000000000000',
        },
        endpoints: ['http://localhost:3001'],
      };

      const agent = new Agent({
        config,
        dependencies: agentDependencies,
        modules: {
          askar: new AskarModule({ ariesAskar }),
          connections: new ConnectionsModule({ autoAcceptConnections: true }),
          oob: new OutOfBandModule(),
        },
      });

      agent.registerOutboundTransport(new WsOutboundTransport());
      agent.registerOutboundTransport(new HttpOutboundTransport());
      agent.registerInboundTransport(new HttpInboundTransport({ port: 3001 }));

      await agent.initialize();
      console.log(`${config.label} is initialized`);
      this.acmeAgent = agent;
      console.log(await this.acmeAgent.oob.createInvitation())
    } catch (error) {
      console.error('Error initializing Acme agent:', error);
      throw error;
    }
  }

  public async getAgent(): Promise<Agent> {
    return await this.acmeAgent;
  }
}
