/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AcmeService } from '../acme-agent/service';
import { Agent, KeyType, TypedArrayEncoder } from '@credo-ts/core';
import axios from 'axios';
import { credDto, offerCredDto } from './dto/credential.dto';

@Injectable()
export class CredentialsService {
  constructor(private readonly acmeService: AcmeService) {}

  async registerSchema(): Promise<unknown> {
    try {
      const agent = this.acmeService.getAgent();
      await this.didRegisteration(
        agent,
        'indy',
        'bcovrin:testnet',
        'T6qC1KBFsJyE6ZhHjLaNqN',
        '3e7a4c8b1234e6d781c9a34b7f5e2c0h',
      );
      const schemaResult = await agent.modules.anoncreds.registerSchema({
        schema: {
          attrNames: ['Name', 'Age', 'City', 'Blood Group'],
          issuerId: 'did:indy:bcovrin:testnet:T6qC1KBFsJyE6ZhHjLaNqN',
          name: 'Student ID Card V1',
          version: '1.0.0',
        },
        options: {},
      });
      console.log(JSON.stringify(schemaResult, null, 2));

      if (schemaResult.schemaState.state === 'failed') {
        throw new InternalServerErrorException(
          `Error creating schema: ${schemaResult.schemaState.reason}`,
        );
      }
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Schema registered successfully',
        data: schemaResult,
      };
    } catch (error) {
      console.error('Error creating invitation:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create invitation');
    }
  }
  private async didRegisteration(
    agent: Agent,
    method: string,
    namespace: string,
    did: string,
    seed: string,
  ): Promise<unknown> {
    const response = await axios.post(`http://test.bcovrin.vonx.io/register`, {
      role: 'ENDORSER',
      alias: 'Alias',
      seed: seed,
    });

    if (response.data && response.data.did) {
      console.log('DID registered');
    }
    return await agent.dids.import({
      did: `did:${method}:${namespace}:${did}`,
      overwrite: true,
      privateKeys: [
        {
          keyType: KeyType.Ed25519,
          privateKey: TypedArrayEncoder.fromString(seed),
        },
      ],
    });
  }

  async registerCredentialDefinition(data: credDto): Promise<unknown> {
    try {
      const agent = this.acmeService.getAgent();
      const credentialDefinitionResult =
        await agent.modules.anoncreds.registerCredentialDefinition({
          credentialDefinition: {
            tag: 'default',
            issuerId: data.issuerId,
            schemaId: data.schemaId,
          },
          options: {
            supportRevocation: false,
          },
        });
      if (
        credentialDefinitionResult.credentialDefinitionState.state === 'failed'
      ) {
        throw new BadRequestException(
          `Error creating credential definition: ${credentialDefinitionResult.credentialDefinitionState.reason}`,
        );
      }
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Credential Definition created successfully',
        data: credentialDefinitionResult,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error in registering credential definition',
      );
    }
  }
  async issuingCredential(data: offerCredDto): Promise<unknown> {
    try {
      const agent = this.acmeService.getAgent();

      const indyCredentialExchangeRecord =
        await agent.credentials.offerCredential({
          protocolVersion: 'v2' as never,
          connectionId: data.connectionId,
          credentialFormats: {
            indy: {
              credentialDefinitionId: data.credentialDefinitionId,
              attributes: data.attributes,
            },
          },
        });
      if (!indyCredentialExchangeRecord) {
        throw new BadRequestException('Error in issuing credential');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Credential issued successfully',
        data: indyCredentialExchangeRecord,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error in issuing the credential');
    }
  }
  // async verifingCredential(){
  //   try {
  //     const agent = this.acmeService.getAgent();

  //     const openId4VcVerifier =
  //       await agent.modules.openId4VcVerifier.createVerifier({});
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
