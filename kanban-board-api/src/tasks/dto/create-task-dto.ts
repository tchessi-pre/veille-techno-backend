import { TaskStatus } from '@prisma/client';
import { IsString, IsOptional, IsInt, IsEnum } from 'class-validator';


export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsInt()
  taskListId: number;

  @IsEnum(TaskStatus) // Validez que la valeur de la propriété status est l'une des valeurs de l'énumération TaskStatus
  status: TaskStatus;
}
