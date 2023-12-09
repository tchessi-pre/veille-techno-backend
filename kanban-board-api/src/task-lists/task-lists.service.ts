import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Importez le service Prisma approprié
import { UpdateTaskListDto } from './dto/update-task-list.dto';
import { CreateTaskListDto } from './dto/create-task-list.dto';
import { TaskList } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
    try {
      // D'abord, supprimez toutes les tâches associées à la liste de tâches
      await this.prisma.task.deleteMany({
        where: { taskListId: id },
      });

      // Ensuite, supprimez la liste de tâches elle-même
      await this.prisma.taskList.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Liste de tâches avec l'ID ${id} non trouvée.`,
        );
      } else if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new ConflictException(
          'Il existe des tâches associées à cette liste de tâches.',
        );
      } else {
        throw error;
      }
    }
  }
}
