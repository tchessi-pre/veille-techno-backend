import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        content: createTaskDto.content,
        status: createTaskDto.status, 
        taskList: {
          connect: {
            id: createTaskDto.taskListId, // On utilise l'ID de la liste de tâches à partir de createTaskDto
          },
        },
      },
    });
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

  async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: {
        id,
      },
      data: updateTaskDto,
    });
  }

  async deleteTask(id: number): Promise<void> {
    await this.prisma.task.delete({
      where: {
        id,
      },
    });
  }
}
