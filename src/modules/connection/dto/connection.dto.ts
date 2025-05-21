import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class getUrlDto {
  @ApiProperty({
    example: 'bob-agent',
    description: 'Name of the agent accepting the invitation',
  })
  @IsUrl()
  @IsNotEmpty()
  invitationUrl: string;
}
