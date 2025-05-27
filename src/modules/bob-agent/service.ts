import { AskarModule } from '@credo-ts/askar';
import {
  Agent,
  ConnectionsModule,
  ConsoleLogger,
  CredentialsModule,
  DidsModule,
  HttpOutboundTransport,
  InitConfig,
  LogLevel,
  OutOfBandModule,
  V2CredentialProtocol,
  WsOutboundTransport,
} from '@credo-ts/core';
import { agentDependencies, HttpInboundTransport } from '@credo-ts/node';
import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ariesAskar } from '@hyperledger/aries-askar-nodejs';
import { anoncreds } from '@hyperledger/anoncreds-nodejs';
import {
  AnonCredsCredentialFormatService,
  AnonCredsModule,
  LegacyIndyCredentialFormatService,
} from '@credo-ts/anoncreds';
import {
  IndyVdrAnonCredsRegistry,
  IndyVdrIndyDidRegistrar,
  IndyVdrIndyDidResolver,
  IndyVdrModule,
} from '@credo-ts/indy-vdr';
import { indyVdr } from '@hyperledger/indy-vdr-nodejs';
import { genesisTransaction } from 'src/utils/genesis_transaction';

@Injectable()
export class BobService {
  private agent: Agent | null = null;

  async initializeBobAgent() {
    try {
      if (this.agent && this.agent.isInitialized) {
        throw new ConflictException('Bob agent already initialised');
      }

      const config: InitConfig = {
        label: 'docs-agent-Bob',
        walletConfig: {
          id: 'mainBob',
          key: 'demoagentbob00000000000000000000',
        },
        logger: new ConsoleLogger(LogLevel.debug),
        endpoints: ['http://localhost:3003'],
      };

      const agent = new Agent({
        config,
        modules: {
          indyVdr: new IndyVdrModule({
            indyVdr,
            networks: [
              {
                isProduction: false,
                indyNamespace: 'bcovrin:testnet',
                genesisTransactions: genesisTransaction,
                connectOnStartup: true,
              },
            ],
          }),
          dids: new DidsModule({
            registrars: [new IndyVdrIndyDidRegistrar()],
            resolvers: [new IndyVdrIndyDidResolver()],
          }),
          anoncreds: new AnonCredsModule({
            registries: [new IndyVdrAnonCredsRegistry()],
            anoncreds,
          }),
          askar: new AskarModule({ ariesAskar }),
          connections: new ConnectionsModule({ autoAcceptConnections: true }),
          oob: new OutOfBandModule(),
          credentials: new CredentialsModule({
            credentialProtocols: [
              new V2CredentialProtocol({
                credentialFormats: [
                  new LegacyIndyCredentialFormatService(),
                  new AnonCredsCredentialFormatService(),
                ],
              }),
            ],
          }),
        },
        dependencies: agentDependencies,
      });

      agent.registerOutboundTransport(new WsOutboundTransport());
      agent.registerOutboundTransport(new HttpOutboundTransport());
      agent.registerInboundTransport(new HttpInboundTransport({ port: 3003 }));
      await agent.initialize();

      this.setAgent(agent);
      return {
        statusCode: HttpStatus.OK,
        message: 'Bob agent initialized successfully',
        data: agent,
      };
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
      throw new NotFoundException(
        'Bob agent not initialized. Initialize it first',
      );
    }
    return this.agent;
  }
}
