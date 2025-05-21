import { Controller, Get } from '@nestjs/common';
import { BobService } from './service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('Bob_Agent')
export class BobController {
  constructor(private readonly bobService: BobService) {}

  @Get('initialize-bob')
  @ApiOperation({ summary: 'Initialize the Bob agent.' })
  @ApiResponse({
    status: 200,
    description: 'Bob agent initialized successfully.',
  })
  @ApiResponse({
    status: 409,
    description: 'Bob agent already initialized.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal serve error while initializing.',
  })
  async initializeBobAgent() {
    const result = await this.bobService.initializeBobAgent();
    return {
      message: 'Bob agent initialized successfully',
      statusCode: result.statusCode,
      agentData: {
        label: result.data.config.label,
        walletId: result.data.config?.walletConfig?.id,
        endpoints: result.data.config.endpoints,
      },
    };
  }
}
