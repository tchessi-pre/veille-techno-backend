import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(taskListId: number, createTaskDto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        content: createTaskDto.content,
        status: createTaskDto.status,
        taskList: {
          connect: {
            id: taskListId, // Utilisez taskListId au lieu d'une valeur statique
          },
        },
      },
    });

    return task;
  }

  async findAllTasks() {
    return this.prisma.task.findMany();
  }

  async findTaskById(id: number) {
    return this.prisma.task.findUnique({
      where: {
        id,
      },
    });
  }

  async updateTask(taskId: number, updateTaskDto: UpdateTaskDto) {
    // Supposons que taskId soit le paramètre d'URL pour l'ID de la tâche à mettre à jour
    const updatedTask = await this.prisma.task.update({
      where: {
        id: taskId, // Utilisez taskId (un entier) au lieu de "3" (une chaîne)
      },
      data: {
        // Utilisez les valeurs du DTO de mise à jour pour mettre à jour les champs appropriés
        title: updateTaskDto.title,
        content: updateTaskDto.content,
        status: updateTaskDto.status,
      },
    });

    return updatedTask;
  }

  // Supprimer une tâche
  async deleteTask(id: number): Promise<void> {
    // Assurez-vous que la tâche avec cet ID existe avant de la supprimer
    const taskToDelete = await this.prisma.task.findUnique({
      where: {
        id: id, // Utilisez l'ID passé en tant que nombre
      },
    });

    if (!taskToDelete) {
      // Gérer l'erreur ici si la tâche n'est pas trouvée
      throw new NotFoundException(`Tâche avec l'ID ${id} non trouvée`);
    }

    // Supprimez la tâche
    await this.prisma.task.delete({
      where: {
        id: id,
      },
    });
  }
}
