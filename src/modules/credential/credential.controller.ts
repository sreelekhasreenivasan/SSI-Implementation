import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CredentialService } from './credential.service';
import { offerCredDto } from '../ledger/dto/ledger.dto';

@Controller('credential')
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  @Post('issue-cred')
  @ApiOperation({ summary: 'Issueing the credential by Acme agent as issuer.' })
  @ApiResponse({
    status: 201,
    description: 'Credential issued successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Acme agent is not initialized.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid inputs.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal serve error while initializing.',
  })
  async issueCredential(@Body() data: offerCredDto) {
    const result = await this.credentialService.OfferCredential(data);
    return result;
  }

  @Get('Accept_the_credential')
  @ApiOperation({ summary: 'Accepting the offer by Bob agent as holder.' })
  @ApiResponse({
    status: 200,
    description: 'Accepted the offer successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Bob agent is not initialized.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal serve error while initializing.',
  })
  async getCredential(@Query('ConnectionId') connectionId: string) {
    const result = await this.credentialService.acceptCredential(connectionId);
    return result;
  }

  @Get('Offer_records_of_acme')
  @ApiOperation({ summary: 'Getting the offer records of acme.' })
  @ApiResponse({
    status: 200,
    description: 'Returned the offer records successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Acme agent is not initialized.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal serve error while initializing.',
  })
  async getOfferRecordofAcme(@Query('recordId') recordId: string) {
    const result = await this.credentialService.getRecordofAcme(recordId);
    return result;
  }

  @Get('Offer_records_of_bob')
  @ApiOperation({ summary: 'Getting the offer records of bob.' })
  @ApiResponse({
    status: 200,
    description: 'Returned the offer records successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Bob agent is not initialized.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal serve error while initializing.',
  })
  async getOfferRecordofBob(@Query('recordId') recordId: string) {
    const result = await this.credentialService.getRecordofBob(recordId);
    return result;
  }

  @Get('Verify the credential')
  @ApiOperation({ summary: 'Verify the credential by Acme agent as verifier.' })
  @ApiResponse({
    status: 200,
    description: 'Verified the credential successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Acme agent is not initialized.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal serve error while initializing.',
  })
  async verifyCredential() {
    const result = await this.credentialService.verifingCredential();
    return result;
  }

  @Get('acme')
  async getOffers() {
    return await this.credentialService.getCredentialOffers();
  }

  @Get('bob')
  async getOffer() {
    return await this.credentialService.getCredentialOffer();
  }
}
