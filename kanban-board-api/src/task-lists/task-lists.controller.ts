import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TaskList } from '@prisma/client'; // Assurez-vous que le chemin vers TaskList est correct
import { TaskListsService } from './task-lists.service'; // Importez le service TaskListsService
import { CreateTaskListDto } from './dto/create-task-list.dto';
import { UpdateTaskListDto } from './dto/update-task-list.dto';

@Controller('task-lists')
export class TaskListsController {
  constructor(private readonly taskListsService: TaskListsService) {}

  @Post()
  @Post()
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
  async deleteTaskList(@Param('id') id: number): Promise<void> {
    await this.taskListsService.deleteTaskList(id);
  }
}
