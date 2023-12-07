import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateTaskListDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @IsNotEmpty()
  boardId: number;
}
