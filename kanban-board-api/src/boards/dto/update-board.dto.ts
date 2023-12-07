import { IsString, IsOptional } from 'class-validator';

export class UpdateBoardDto {
  @IsString()
  @IsOptional()
  title?: string; // Le titre du tableau (optionnel)
}
