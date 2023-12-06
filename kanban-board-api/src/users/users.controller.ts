import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto'; 
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt'; 

@Controller('/')
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

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
}
