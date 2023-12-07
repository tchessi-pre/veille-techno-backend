// dto/update-task-list.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class UpdateTaskListDto {
  @IsString()
  @IsOptional()
  title?: string;
}
