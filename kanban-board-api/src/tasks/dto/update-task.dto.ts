import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class UpdateTaskDto {
  @IsOptional() // Le titre est facultatif lors de la mise à jour
  @IsString()
  title?: string;

  @IsOptional() // Le contenu est facultatif lors de la mise à jour
  @IsString()
  content?: string;

  @IsOptional() // Le statut est facultatif lors de la mise à jour
  @IsEnum(TaskStatus, { message: 'Le statut doit être une valeur valide.' })
  status?: TaskStatus;
}
