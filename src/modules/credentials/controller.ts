import { Body, Controller, Post } from '@nestjs/common';
import { CredentialsService } from './service';
import { credDto, offerCredDto } from './dto/credential.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialService: CredentialsService) {}

  @Post('register-schema')
  @ApiOperation({ summary: 'Registering schema by Acme agent as issuer.' })
  @ApiResponse({ status: 201, description: 'Schema registered successfully.' })
  @ApiResponse({
    status: 404,
    description: 'Acme agent is not initialized.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal serve error while initializing.',
  })
  async registerSchema() {
    const result = await this.credentialService.registerSchema();
    return result;
  }

  @Post('cred-def')
  @ApiOperation({
    summary: 'Registering credential definition by Acme agent as issuer.',
  })
  @ApiResponse({
    status: 201,
    description: 'Credential definition created successfully.',
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
  async registerCredDef(@Body() data: credDto) {
    const result =
      await this.credentialService.registerCredentialDefinition(data);
    return result;
  }

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
}
