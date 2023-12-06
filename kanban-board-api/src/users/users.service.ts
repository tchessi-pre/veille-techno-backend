import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

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

  // Mettre à jour un utilisateur
  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    // Vérifier si l'utilisateur existe
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Vérifier si le champ 'email' existe dans updateUserDto et s'il est différent de l'ancien email
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      // Vérifier si l'email existe déjà dans la base de données
      const emailExists = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (emailExists) {
        throw new ConflictException('Email already exists');
      }
    }

    // Vérifier si le champ 'username' existe dans updateUserDto et s'il est différent de l'ancien username
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      // Vérifier si le username existe déjà dans la base de données
      const usernameExists = await this.prisma.user.findUnique({
        where: { username: updateUserDto.username },
      });
      if (usernameExists) {
        throw new ConflictException('Username already exists');
      }
    }

    // Vérifier si le champ 'password' existe dans updateUserDto
    if (updateUserDto.password) {
      // Hacher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      try {
        // Mettre à jour l'utilisateur avec le nouveau mot de passe haché
        const updatedUser = await this.prisma.user.update({
          where: { id: userId },
          data: {
            ...updateUserDto,
            password: hashedPassword, // Mettre à jour le mot de passe haché
          },
        });
        return updatedUser;
      } catch (error) {
        throw new InternalServerErrorException('Failed to update user');
      }
    } else {
      // Si le champ 'password' n'existe pas, mettre à jour l'utilisateur sans modifier le mot de passe
      try {
        const updatedUser = await this.prisma.user.update({
          where: { id: userId },
          data: updateUserDto,
        });
        return updatedUser;
      } catch (error) {
        throw new InternalServerErrorException('Failed to update user');
      }
    }
  }

  // Supprimer un utilisateur
  async deleteUser(userId: number, requestingUserId: number): Promise<void> {
    // Vérifiez si l'utilisateur existe
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Vérifiez que l'utilisateur connecté est le propriétaire du compte
    if (requestingUserId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this user',
      );
    }

    try {
      // Supprimez l'utilisateur de la base de données en utilisant Prisma
      await this.prisma.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      // Gérez les erreurs possibles lors de la suppression de l'utilisateur
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
