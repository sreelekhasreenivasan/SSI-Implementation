import { OutOfBandInvitation } from '@credo-ts/core';
import { Injectable } from '@nestjs/common';
import { Agent2Service } from '../agent2/agent2.service';
import { Agent1Service } from '../agent1/agent1.service';

@Injectable()
export class ConnectionService {
  constructor(
    private readonly acmeService: Agent2Service,
    private readonly bobService: Agent1Service,
  ) {}

  async createInvitation() {
    try {
      const agent = this.acmeService.getAgent();
      console.log(agent);
      const outOfBandRecord = await agent.oob.createInvitation();
      return {
        invitationUrl: outOfBandRecord.outOfBandInvitation.toUrl({
          domain: 'https://example.org',
        }),
        outOfBandRecord,
        // eslint-disable-next-line prettier/prettier
         }
    } catch (error) {
      console.error('Error creating invitation:', error);
      throw new Error('Failed to create invitation');
    }
  }
  async receiveInvitation(invitationUrl: string) {
    try {
      const agent = this.bobService.getAgent();
      const invitation = OutOfBandInvitation.fromUrl(invitationUrl);
      const { outOfBandRecord } = await agent.oob.receiveInvitation(invitation);
      return outOfBandRecord;
    } catch (error) {
      console.error('Error receiving invitation:', error);
      throw new Error('Failed to receive invitation');
    }
  }
}
