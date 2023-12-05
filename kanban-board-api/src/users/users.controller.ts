// src/users/users.controller.ts

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('')
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register') //indique que c'est un endpoint POST pour /users/register.
  @HttpCode(HttpStatus.CREATED) // définit le code de statut HTTP de la réponse en cas de succès
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }
}
