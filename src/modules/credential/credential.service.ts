/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  OpenId4VcVerificationSessionState,
  OpenId4VcVerificationSessionStateChangedEvent,
  OpenId4VcVerifierEvents,
} from '@credo-ts/openid4vc';
// import {
//   CredentialEventTypes,
//   CredentialStateChangedEvent,
//   CredentialState,
// } from '@credo-ts/core';
import { AutoAcceptCredential } from '@credo-ts/core';
import { AcmeService } from '../acme-agent/service';
import { BobService } from '../bob-agent/service';
import { offerCredDto } from '../ledger/dto/ledger.dto';

@Injectable()
export class CredentialService {
  constructor(
    private readonly acmeService: AcmeService,
    private readonly bobService: BobService,
  ) {}

  //offer credential
  async OfferCredential(data: offerCredDto): Promise<unknown> {
    try {
      const agent = this.acmeService.getAgent();

      const indyCredentialExchangeRecord =
        await agent.credentials.offerCredential({
          protocolVersion: 'v2' as unknown as never,
          connectionId: data.connectionId,
          credentialFormats: {
            indy: {
              credentialDefinitionId: data.credentialDefinitionId,
              attributes: data.attributes,
            },
          },
        });
      if (!indyCredentialExchangeRecord) {
        throw new BadRequestException('Error in offering credential');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Credential offered successfully',
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

  async acceptCredential(credentialRecordId: string): Promise<unknown> {
    try {
      const agent = this.bobService.getAgent();

      // if (!connectionId) {
      //   throw new NotFoundException('connectionId is required');
      // }

      // const credentials = await agent.credentials.findAllByQuery({
      //   connectionId,
      // });

      // const offerCredential = credentials.find(
      //   (cred) => cred.state === CredentialState.OfferReceived,
      // );

      // if (!offerCredential) {
      //   throw new NotFoundException(
      //     `No credential offer found for connectionId: ${connectionId}`,
      //   );
      // }

      const accepted = await agent.credentials.acceptOffer({
        credentialRecordId: credentialRecordId,
        autoAcceptCredential: AutoAcceptCredential.Always,
      });

      return {
        message: 'Credential offer accepted successfully',
        credentialId: accepted.id,
      };
    } catch (error) {
      console.error('Error accepting credential:', error);
      throw new InternalServerErrorException(
        `Failed to accept credential: ${error.message}`,
      );
    }
  }

  async getCredentialOffers() {
    const agent = this.acmeService.getAgent();
    const offers = await agent.credentials.getAll();
    return offers;
  }

  async getCredentialOffer() {
    const agent = this.bobService.getAgent();
    const offers = await agent.credentials.getAll();
    console.log(
      offers.map((c) => ({
        id: c.id,
        state: c.state,
        connectionId: c.connectionId,
      })),
    );
    return offers;
  }

  async getRecordofAcme(recordId: string): Promise<unknown> {
    try {
      const agent = this.acmeService.getAgent();
      const offerRecord = await agent.credentials.getById(recordId);
      return offerRecord;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error in getting the record');
    }
  }

  async getRecordofBob(recordId: string): Promise<unknown> {
    try {
      const agent = this.bobService.getAgent();
      const offerRecord = await agent.credentials.getById(recordId);
      return offerRecord;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error in getting the record');
    }
  }

  //verifing credential
  async verifingCredential(): Promise<unknown> {
    try {
      const verifier = this.acmeService.getAgent();

      const openId4VcVerifier =
        await verifier.modules.openId4VcVerifier.createVerifier({});
      const { authprizationRequest, verificationSession } =
        await verifier.modules.openId4VcVerifier.createAuthorizationRequest({
          verifierId: openId4VcVerifier.verifierId,
          requestSgner: {
            didUrl: 'did:indy:bcovrin:testnet:T6qC1KBFsJyE6ZhHjLaNqN',
            method: 'did',
          },
          presentationExchange: {
            definition: {
              id: '9ed05140-b33b-445e-a0f0-9a23aa501868',
              name: 'Student Verification',
              purpose:
                'We need to verify your Student ID card for scholarship ',
              input_descriptors: [
                {
                  id: '9c98fb43-6fd5-49b1-8dcc-69bd2a378f23',
                  constraints: {
                    limit_disclosure: 'required',
                    fields: [
                      {
                        filter: {
                          type: 'string',
                          const: 'Acme_Verifier',
                        },
                        path: ['$.vct'],
                      },
                    ],
                  },
                },
              ],
            },
          },
        });
      verifier.events.on<OpenId4VcVerificationSessionStateChangedEvent>(
        OpenId4VcVerifierEvents.VerificationSessionStateChanged,
        async (event) => {
          if (
            event.payload.verificationSession.id === verificationSession.id &&
            event.payload.verificationSession.state ===
              OpenId4VcVerificationSessionState.ResponseVerified
          ) {
            const verifiedAuthorizationResponse =
              await verifier.modules.openId4VcVerifier.getVerifiedAuthorizationResponse(
                verificationSession.id,
              );

            console.log(
              'Successfully verified presentation:',
              JSON.stringify(verifiedAuthorizationResponse, null, 2),
            );
          }
        },
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Verification request created',
        data: authprizationRequest,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error in accepting the offer');
    }
  }
}
