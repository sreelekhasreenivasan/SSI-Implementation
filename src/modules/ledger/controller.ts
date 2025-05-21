import { Body, Controller, Post } from '@nestjs/common';
import { LedgerService } from './service';
import { credDto } from './dto/ledger.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('Ledger')
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

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
    const result = await this.ledgerService.registerSchema();
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
    const result = await this.ledgerService.registerCredentialDefinition(data);
    return result;
  }
}
