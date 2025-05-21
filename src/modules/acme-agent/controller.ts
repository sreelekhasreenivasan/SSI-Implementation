import { Controller, Get } from '@nestjs/common';
import { AcmeService } from './service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('Acme_Agent')
export class AcmeController {
  constructor(private readonly acmeService: AcmeService) {}

  @Get('initialize-acme')
  @ApiOperation({ summary: 'Initialize the Acme agent.' })
  @ApiResponse({
    status: 200,
    description: 'Acme agent initialized successfully.',
  })
  @ApiResponse({
    status: 409,
    description: 'Acme agent already initialized.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal serve error while initializing.',
  })
  async initializeAcmeAgent() {
    const result = await this.acmeService.initializeAcmeAgent();
    return {
      message: 'Acme agent initialized successfully',
      statusCode: result.statusCode,
      agentData: {
        label: result.data.config.label,
        walletId: result.data.config?.walletConfig?.id,
        endpoints: result.data.config.endpoints,
      },
    };
  }
}
