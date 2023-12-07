import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TasksModule } from './tasks/tasks.module';
import { TaskListsModule } from './task-lists/task-lists.module';
import { BoardsModule } from './boards/boards.module';

@Module({
  imports: [
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Remplacez par votre clé secrète
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
    TasksModule,
    TaskListsModule,
    BoardsModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService, UsersService, PrismaService],
})
export class AppModule {}
