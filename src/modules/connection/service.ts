/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { OutOfBandInvitation } from '@credo-ts/core';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BobService } from '../bob-agent/service';
import { AcmeService } from '../acme-agent/service';

@Injectable()
export class ConnectionService {
  constructor(
    private readonly acmeService: AcmeService,
    private readonly bobService: BobService,
  ) {}

  async createInvitation() {
    try {
      const agent = this.acmeService.getAgent();
      const outOfBandRecord = await agent.oob.createInvitation();
      const oobId = outOfBandRecord.id;
      const invitationUrl = outOfBandRecord.outOfBandInvitation.toUrl({
        domain: 'http://localhost:3002',
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Invitation created successfully.',
        invitaionURL: invitationUrl,
        oobId,
        // eslint-disable-next-line prettier/prettier
         }
    } catch (error) {
      console.error('Error creating invitation:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create invitation');
    }
  }

  async receiveInvitation(invitationUrl: string) {
    try {
      const agent = this.bobService.getAgent();
      let invitation: any;
      try {
        invitation = OutOfBandInvitation.fromUrl(invitationUrl);
      } catch (e) {
        throw new BadRequestException('Invalid invitation URL');
      }
      const { outOfBandRecord } = await agent.oob.receiveInvitation(invitation);
      const oobId = outOfBandRecord.id;
      const connections = await agent.connections.getAll();
      connections.forEach((conn) => {
        console.log({
          id: conn.id,
          state: conn.state,
          theirLabel: conn.theirLabel,
          theidDid: conn.theirDid,
        });
      });

      return {
        statusCode: HttpStatus.ACCEPTED,
        message: 'Invitation accepted succcessfully',
        data: outOfBandRecord,
        oobid: oobId,
      };
    } catch (error) {
      console.error('Error receiving invitation:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to receive invitation');
    }
  }

  async getConnectionIdofAcme(oobId: string) {
    try {
      const agent = this.acmeService.getAgent();

      const connections = await agent.connections.findAllByOutOfBandId(oobId);
      if (!connections.length) {
        throw new BadRequestException(
          `No connection found for out-of-band ID: ${oobId}`,
        );
      }
      const connectedConnection = await agent.connections.returnWhenIsConnected(
        connections[0].id,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Connection ID for acme agent return sucessfully',
        connectionId: connectedConnection.id,
      };
    } catch (error) {
      console.error('Erro in returning the ID.', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to return the Connection ID',
      );
    }
  }

  async getConnectionIdofBob(oobId: string) {
    try {
      const agent = this.bobService.getAgent();

      const connections = await agent.connections.findAllByOutOfBandId(oobId);
      if (!connections.length) {
        throw new BadRequestException(
          `No connection found for out-of-band ID: ${oobId}`,
        );
      }
      const connectedConnection = await agent.connections.returnWhenIsConnected(
        connections[0].id,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Connection ID for bob agent return sucessfully',
        connectionId: connectedConnection.id,
      };
    } catch (error) {
      console.error('Erro in returning the ID.', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to return the Connection ID',
      );
    }
  }
}
