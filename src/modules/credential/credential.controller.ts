import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { offerCredDto } from '../ledger/dto/ledger.dto';
import { CredentialService } from './credential.service';

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
    const result = await this.credentialService.issuingCredential(data);
    return result;
  }

  @Get('Accept the credential')
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
  async getCredential() {
    const result = await this.credentialService.acceptCredential();
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
}
