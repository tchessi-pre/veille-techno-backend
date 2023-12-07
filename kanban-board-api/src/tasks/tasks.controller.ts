import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { TasksService } from './tasks.service'; // Importez le service TasksService
import { Task } from '@prisma/client'; // Assurez-vous que le chemin vers Task est correct
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post(':taskListId')
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
    // Utilisez le service pour obtenir toutes les tâches
    return this.tasksService.findAllTasks();
  }

  @Get(':id')
  async findTaskById(@Param('id') id: number): Promise<Task> {
    // Utilisez le service pour obtenir une tâche par son ID
    return this.tasksService.findTaskById(id);
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    // Utilisez le service pour mettre à jour une tâche par son ID
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: number): Promise<void> {
    // Utilisez le service pour supprimer une tâche par son ID
    return this.tasksService.deleteTask(id);
  }
}
