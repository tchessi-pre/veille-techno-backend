import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
 
  constructor(private prisma: PrismaService) {}

  // Inscription
  async createUser(userData: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    try {
      return await this.prisma.user.create({
        data: {
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Username or email already exists');
      } else {
        throw new InternalServerErrorException('Failed to create user');
      }
    }
  }

  // Connexion
  async validateUser(username: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const { password: hashedPassword, ...result } = user;
      const passwordValid = await bcrypt.compare(password, hashedPassword);

      if (!passwordValid) {
        throw new Error('Invalid password');
      }

      return result;
    } catch (error) {
      // On envoye un message d'erreur plus générique en production pour des raisons de sécurité
      throw new InternalServerErrorException('Failed to validate user');
    }
  }

  // Récupérer tous les utilisateurs
  async findAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany(); // On utilise la méthode findMany pour récupérer tous les utilisateurs
  }

  // Récupérer un utilisateur par son ID
  async findUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }
}
