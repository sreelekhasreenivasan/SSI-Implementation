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
import { offerCredDto } from '../ledger/dto/ledger.dto';
import { AcmeService } from '../acme-agent/service';
import {
  OpenId4VcVerificationSessionState,
  OpenId4VcVerificationSessionStateChangedEvent,
  OpenId4VcVerifierEvents,
} from '@credo-ts/openid4vc';
import {
  CredentialEventTypes,
  CredentialStateChangedEvent,
  CredentialState,
} from '@credo-ts/core';
import { BobService } from '../bob-agent/service';

@Injectable()
export class CredentialService {
  constructor(
    private readonly acmeService: AcmeService,
    private readonly bobService: BobService,
  ) {}

  //Issuing credential
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

  //holder accept the credential
  async acceptCredential() {
    try {
      const agent = this.bobService.getAgent();
      agent.events.on<CredentialStateChangedEvent>(
        CredentialEventTypes.CredentialStateChanged,
        async ({ payload }) => {
          switch (payload.credentialRecord.state) {
            case CredentialState.OfferReceived:
              console.log('received a credential');
              await agent.credentials.acceptOffer({
                credentialRecordId: payload.credentialRecord.id,
              });
              break;
            case CredentialState.Done:
              console.log(
                `Credential for credential id ${payload.credentialRecord.id} is accepted`,
              );
          }
        },
      );
      const credentials = await agent.credentials.getAll();
      console.log(credentials);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error in accepting the offer');
    }
  }

  //verifing credential
  async verifingCredential() {
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
              namg: 'Student Verification',
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
