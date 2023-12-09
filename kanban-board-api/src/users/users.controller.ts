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
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto'; 
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt'; 
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminRoleGuard } from '../guards/admin-role.guard';

@Controller('/')
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Inscription
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
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
  @UseGuards(AuthGuard('jwt'), AdminRoleGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID.');
    }

    if (updateUserDto.hasOwnProperty('password')) {
      throw new ConflictException(
        'Admins are not allowed to change user passwords.',
      );
    }

    try {
      const updatedUser = await this.usersService.updateUser(
        userId,
        updateUserDto,
      );
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }
      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        // L'utilisateur n'a pas été trouvé
        throw error;
      } else if (error instanceof ConflictException) {
        // Conflit (par exemple, violation de contrainte unique)
        throw error;
      } else {
        // Autres erreurs inattendues
        throw new InternalServerErrorException('Failed to update user');
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
