import { Type } from 'class-transformer';
import { IsNumber, IsOptional, ValidateIf } from 'class-validator';

export class BaseCreateDto {
  //@ValidateIf((dto) => typeof dto.professionalId === 'undefined')
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  patientId?: number;

  @ValidateIf((dto) => typeof dto.patientId === 'undefined')
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  professionalId?: number;
}
