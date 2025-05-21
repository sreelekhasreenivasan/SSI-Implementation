import { IsNotEmpty, IsString } from 'class-validator';

export class credDto {
  @IsString()
  @IsNotEmpty()
  issuerId: string;

  @IsString()
  @IsNotEmpty()
  schemaId: string;
}

export class offerCredDto {
  @IsNotEmpty()
  @IsString()
  connectionId: string;

  @IsNotEmpty()
  @IsString()
  credentialDefinitionId: string;

  attributes: attributesDto[];
}

export class attributesDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  value: string;
}
