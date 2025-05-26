import {
  AnonCredsCredentialFormatService,
  AnonCredsModule,
  LegacyIndyCredentialFormatService,
} from '@credo-ts/anoncreds';
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
import {
  IndyVdrAnonCredsRegistry,
  IndyVdrIndyDidRegistrar,
  IndyVdrIndyDidResolver,
  IndyVdrModule,
} from '@credo-ts/indy-vdr';
import { agentDependencies, HttpInboundTransport } from '@credo-ts/node';
import { anoncreds } from '@hyperledger/anoncreds-nodejs';
import { ariesAskar } from '@hyperledger/aries-askar-nodejs';
import { indyVdr } from '@hyperledger/indy-vdr-nodejs';
import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { genesisTransaction } from 'src/utils/genesis_transaction';

@Injectable()
export class AcmeService {
  public agent: Agent<any> | null = null;

  async initializeAcmeAgent() {
    try {
      if (this.agent && this.agent.isInitialized) {
        throw new ConflictException('Acme agent already initialized');
      }

      const config: InitConfig = {
        label: 'demo-agent-acme',
        walletConfig: {
          id: 'mainAcme',
          key: 'demoagentacme0000000000000000000',
        },
        logger: new ConsoleLogger(LogLevel.debug),
        endpoints: ['http://localhost:3002'],
      };

      const agent = new Agent({
        config,
        dependencies: agentDependencies,
        modules: {
          askar: new AskarModule({ ariesAskar }),
          connections: new ConnectionsModule({ autoAcceptConnections: true }),
          oob: new OutOfBandModule(),

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
          anoncreds: new AnonCredsModule({
            registries: [new IndyVdrAnonCredsRegistry()],
            anoncreds,
          }),
          dids: new DidsModule({
            registrars: [new IndyVdrIndyDidRegistrar()],
            resolvers: [new IndyVdrIndyDidResolver()],
          }),
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
      });

      agent.registerOutboundTransport(new WsOutboundTransport());
      agent.registerOutboundTransport(new HttpOutboundTransport());
      agent.registerInboundTransport(new HttpInboundTransport({ port: 3002 }));

      await agent.initialize();
      console.log('Acme agent initialized');
      this.setAgent(agent);
      return {
        statusCode: HttpStatus.OK,
        message: 'Acme agent initialized successfully',
        data: agent,
      };
    } catch (error) {
      console.error('Error initializing Acme agent:', error);
      throw error;
    }
  }

  private setAgent(agent: Agent) {
    this.agent = agent;
  }

  public getAgent() {
    if (!this.agent) {
      throw new NotFoundException(
        'Acme agent not initialized. Please initialize first.',
      );
    }
    return this.agent;
  }
}
