import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @IsNotEmpty()
  ownerId: number; // Ajoutez ownerId pour spécifier l'utilisateur propriétaire du tableau
}
