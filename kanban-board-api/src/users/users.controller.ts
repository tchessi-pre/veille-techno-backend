// src/users/users.controller.ts

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto'; 
import { UsersService } from './users.service';
import { User } from '@prisma/client';
@Controller('/')
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register') //indique que c'est un endpoint POST  /register. pour la creation d'un utilisateur
  @HttpCode(HttpStatus.CREATED) // définit le code de statut HTTP de la réponse en cas de succès
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.usersService.validateUser(
      loginUserDto.username,
      loginUserDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Ici, vous pouvez générer et renvoyer un JWT ou une autre forme d'authentification
    // Pour l'exemple, je renvoie simplement les informations de l'utilisateur (sans mot de passe)
    return user;
  }
}
