import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Importez le service Prisma approprié
import { UpdateTaskListDto } from './dto/update-task-list.dto';
import { CreateTaskListDto } from './dto/create-task-list.dto';
import { TaskList } from '@prisma/client';

@Injectable()
export class TaskListsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTaskList(createTaskListDto: CreateTaskListDto) {
    const { title, boardId } = createTaskListDto;

    return this.prisma.taskList.create({
      data: {
        title,
        boardId, // Associez la liste de tâches à un tableau (Board) en utilisant boardId
      },
    });
  }

  async findAllTaskLists(): Promise<TaskList[]> {
    return this.prisma.taskList.findMany();
  }

  async findTaskListById(id: number): Promise<TaskList> {
    return this.prisma.taskList.findUnique({
      where: {
        id,
      },
    });
  }

  async updateTaskList(
    id: number,
    updateTaskListDto: UpdateTaskListDto,
  ): Promise<TaskList> {
    return this.prisma.taskList.update({
      where: {
        id,
      },
      data: updateTaskListDto,
    });
  }

  async deleteTaskList(id: number): Promise<void> {
    await this.prisma.taskList.delete({
      where: {
        id,
      },
    });
  }
}
