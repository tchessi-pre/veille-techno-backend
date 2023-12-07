import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  ownerId: number; // L'ID de l'utilisateur propriétaire du tableau
}
