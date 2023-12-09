import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Request,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto'; 
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt'; 
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('/')
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Inscription
  @Post('register') 
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
    const userId = parseInt(id); 
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found'); 
    }
    return user;
  }

  // Modifier un utilisateur par son ID
  @Put('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const userId = parseInt(id, 10);
    try {
      const updatedUser = await this.usersService.updateUser(
        userId,
        updateUserDto,
      );
      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      } else if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new Error('Failed to update user');
      }
    }
  }

  // Supprimer un utilisateur par son ID
  @Delete('users/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteUser(@Param('id') id: string, @Request() req) {
    const userId = parseInt(id, 10);
    const requestingUserId = req.user.userId; // ID de l'utilisateur connecté
    // Appeler la méthode deleteUser du service avec les deux IDs
    await this.usersService.deleteUser(userId, requestingUserId);
    return { message: 'User deleted successfully' };
  }
}
