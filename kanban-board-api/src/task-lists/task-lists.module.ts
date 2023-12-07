import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { TaskListsController } from './task-lists.controller';
import { TaskListsService } from './task-lists.service';

@Module({
  controllers: [TaskListsController],
  providers: [PrismaService, TaskListsService],
})
export class TaskListsModule {}
