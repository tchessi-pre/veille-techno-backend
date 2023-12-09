import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TaskList } from '@prisma/client'; 
import { TaskListsService } from './task-lists.service'; 
import { CreateTaskListDto } from './dto/create-task-list.dto';
import { UpdateTaskListDto } from './dto/update-task-list.dto';
import { AdminRoleGuard } from '../guards/admin-role.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Controller('task-lists')
export class TaskListsController {
  constructor(private readonly taskListsService: TaskListsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async createTaskList(@Body() createTaskListDto: CreateTaskListDto) {
    return this.taskListsService.createTaskList(createTaskListDto);
  }

  @Get()
  async findAllTaskLists(): Promise<TaskList[]> {
    return this.taskListsService.findAllTaskLists();
  }

  @Get(':id')
  async findTaskListById(
    @Param('id') id: string,
  ): Promise<{ message: string; taskList: TaskList }> {
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      throw new BadRequestException('ID doit être un nombre entier valide.');
    }

    const taskList = await this.taskListsService.findTaskListById(parsedId);

    if (!taskList) {
      throw new NotFoundException(
        `Liste de tâches avec l'ID ${parsedId} non trouvée.`,
      );
    }

    return {
      message: `Liste de tâches avec l'ID ${parsedId} récupérée avec succès.`,
      taskList,
    };
  }

  @Put(':id')
  async updateTaskList(
    @Param('id') id: number,
    @Body() updateTaskListDto: UpdateTaskListDto,
  ): Promise<TaskList> {
    return this.taskListsService.updateTaskList(id, updateTaskListDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async deleteTaskList(@Param('id') id: string): Promise<{ message: string }> {
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      throw new BadRequestException('ID doit être un nombre entier valide.');
    }

    try {
      await this.taskListsService.deleteTaskList(parsedId);
      return {
        message: `Liste de tâches avec l'ID ${parsedId} supprimée avec succès.`,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Liste de tâches avec l'ID ${parsedId} non trouvée.`,
        );
      } else {
        throw error;
      }
    }
  }
}
