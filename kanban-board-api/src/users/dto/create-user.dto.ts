// Le DTO (Data Transfer Object) est utilisé pour définir la structure des données pour les requêtes

import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty() // Assurez que le champ username n'est pas vide
  @IsString() // Assurez que le champ username est une chaîne de caractères
  username: string;

  @IsEmail() // Assurez que le champ email est un email valide
  @IsOptional() // Assurez que le champ email est optionnel
  email?: string;

  @IsNotEmpty()
  @MinLength(10) // Assurez-vous que le mot de passe a une longueur minimale pour des raisons de sécurité
  password: string;

  @IsOptional() // Assurez que le champ role est optionnel
  @IsString() // Assurez que le champ role est une chaîne de caractères
  role?: string;
}
