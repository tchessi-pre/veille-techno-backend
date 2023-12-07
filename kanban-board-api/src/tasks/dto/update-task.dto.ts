// update-task.dto.ts

import { IsString, IsOptional } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional() // Le titre est facultatif lors de la mise à jour
  @IsString()
  title?: string;

  @IsOptional() // Le contenu est facultatif lors de la mise à jour
  @IsString()
  content?: string;
}
