import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class getUrlDto {
  @ApiProperty({
    example: 'bob-agent',
    description: 'Name of the agent accepting the invitation',
  })
  @IsUrl()
  @IsNotEmpty()
  invitationUrl: string;
}

export class oobIdDto {
  @IsString()
  @IsNotEmpty()
  oobId: string;
}
