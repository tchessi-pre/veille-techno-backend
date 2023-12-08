import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Body,
  Param,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AdminRoleGuard } from '../guards/admin-role.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
export class TasksController {
  prisma: any;
  constructor(private readonly tasksService: TasksService) {}

  @Post(':taskListId')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async createTask(
    @Param('taskListId') taskListId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    const parsedTaskListId = parseInt(taskListId, 10); // Convertir la chaîne en nombre entier

    if (isNaN(parsedTaskListId)) {
      // Gérer l'erreur ici si taskListId n'est pas un nombre valide
      throw new BadRequestException(
        'taskListId doit être un nombre entier valide.',
      );
    }

    return this.tasksService.createTask(parsedTaskListId, createTaskDto);
  }

  @Get()
  async findAllTasks(): Promise<Task[]> {
    return this.tasksService.findAllTasks();
  }

  @Get(':id')
  async findTaskById(
    @Param('id') id: string, // Changez le type de id en string
  ): Promise<{ message: string; task: Task }> {
    const parsedId = parseInt(id, 10); // Convertir la chaîne en nombre entier

    if (isNaN(parsedId)) {
      // Gérer l'erreur ici si l'ID n'est pas un nombre valide
      throw new BadRequestException('ID doit être un nombre entier valide.');
    }

    // Utilisez le service pour obtenir une tâche par son ID
    const task = await this.tasksService.findTaskById(parsedId);

    if (!task) {
      throw new NotFoundException(`Tâche avec l'ID ${parsedId} non trouvée.`);
    }

    // Retournez un message de succès avec la tâche et l'ID
    return {
      message: `Tâche avec l'ID ${parsedId} récupérée avec succès.`,
      task,
    };
  }

  // Modifier une tâche par rapport a son Id
  @Put(':taskId')
  async updateTask(
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const parsedTaskId = parseInt(taskId, 10);
    if (isNaN(parsedTaskId)) {
      throw new BadRequestException(
        'taskId doit être un nombre entier valide.',
      );
    }
    const taskToUpdate = await this.tasksService.findTaskById(parsedTaskId);
    if (!taskToUpdate) {
      throw new NotFoundException(
        `La tâche avec l'ID ${parsedTaskId} n'a pas été trouvée.`,
      );
    }
    const updatedTask = await this.tasksService.updateTask(
      parsedTaskId,
      updateTaskDto,
    );
    return updatedTask;
  }

  
  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async deleteTask(@Param('id') id: string): Promise<{ message: string }> {
    const parsedId = parseInt(id, 10); // Convertir la chaîne en nombre entier

    if (isNaN(parsedId)) {
      // Gérer l'erreur ici si l'ID n'est pas un nombre valide
      throw new BadRequestException('ID doit être un nombre entier valide.');
    }

    // Utilisez le service pour supprimer une tâche par son ID
    await this.tasksService.deleteTask(parsedId);

    // Retournez un message de succès
    return { message: `Tâche avec l'ID ${parsedId} supprimée avec succès.` };
  }
}
