import { Controller, Get, Post, Query } from '@nestjs/common';
import { ConnectionService } from './service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('connection')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Post('create-invitation')
  @ApiOperation({ summary: 'Create a connection invitation by Acme agent.' })
  @ApiResponse({ status: 201, description: 'Invitation created successfully.' })
  @ApiResponse({
    status: 404,
    description: 'Acme agent is not initialized.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal serve error while initializing.',
  })
  async createInvitation() {
    const result = await this.connectionService.createInvitation();
    return result;
  }

  @Get('receive-invitation')
  @ApiOperation({ summary: 'Accept a connection invitation by Bob agent.' })
  @ApiResponse({
    status: 201,
    description: 'Invitation accepted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Bob agent is not initialized.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal serve error while initializing.',
  })
  async receiveInvitation(@Query('invitationUrl') data: string) {
    const result = await this.connectionService.receiveInvitation(data);
    return result;
  }

  @Get('acme-connectionId')
  @ApiOperation({ summary: 'Get connection details by ID.' })
  @ApiResponse({
    status: 200,
    description: 'Connection ID for Acme agent returned.',
  })
  @ApiResponse({
    status: 404,
    description: 'Acme agent is not initialized.',
  })
  @ApiResponse({
    status: 400,
    description: 'No connection found for the given out-of-band ID.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal serve error while initializing.',
  })
  async getAcmeConnectionId(@Query('id') id: string) {
    const result = await this.connectionService.getConnectionId(id);
    return result;
  }
}
