import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto'; 
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt'; 
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('/')
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }
  

  // Inscription
  @Post('register') //indique que c'est un endpoint POST  /register. pour la creation d'un utilisateur
  @HttpCode(HttpStatus.CREATED) // définit le code de statut HTTP de la réponse en cas de succès
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  // Connexion
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.usersService.validateUser(
      loginUserDto.username,
      loginUserDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Générez un token JWT
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    // Retournez le token JWT dans la réponse
    return { user, accessToken };
  }

  // Récupérer tous les utilisateurs
  @Get('users')
  async findAllUsers(): Promise<User[]> {
    return this.usersService.findAllUsers();
  }

  // Récupérer un utilisateur par son ID
  @Get('users/:id')
  async findUserById(@Param('id') id: string): Promise<User> {
    const userId = parseInt(id); // Convertir l'ID en nombre (int)
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found'); // Gérer le cas où l'utilisateur n'est pas trouvé
    }
    return user;
  }

  // Modifier un utilisateur par son ID
  @Put('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    // Convertir l'ID en nombre
    const userId = parseInt(id, 10);

    try {
      // Mettre à jour l'utilisateur en utilisant updateUserDto
      const updatedUser = await this.usersService.updateUser(
        userId,
        updateUserDto,
      );
      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      } else if (error instanceof ConflictException) {
        throw new ConflictException(error.message); // Réutilisez le message d'erreur de l'exception Conflict
      } else {
        throw new Error('Failed to update user');
      }
    }
  }
}
