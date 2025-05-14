import { Controller, Get, Post, Query } from '@nestjs/common';
import { ConnectionService } from './connection.service';

@Controller('connection')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Post('create-invitation')
  async createInvitation() {
    const result = await this.connectionService.createInvitation();
    return result;
  }

  @Get('receive-invitation')
  async receiveInvitation(@Query('invitationUrl') invitationUrl: string) {
    const result =
      await this.connectionService.receiveInvitation(invitationUrl);
    return result;
  }
}
