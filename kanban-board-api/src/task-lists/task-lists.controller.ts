import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { TaskList } from '@prisma/client'; // Assurez-vous que le chemin vers TaskList est correct
import { TaskListsService } from './task-lists.service'; // Importez le service TaskListsService
import { CreateTaskListDto } from './dto/create-task-list.dto';
import { UpdateTaskListDto } from './dto/update-task-list.dto';

@Controller('task-lists')
export class TaskListsController {
  constructor(private readonly taskListsService: TaskListsService) {}

  @Post()
  async createTaskList(@Body() createTaskListDto: CreateTaskListDto) {
    return this.taskListsService.createTaskList(createTaskListDto);
  }

  @Get()
  async findAllTaskLists(): Promise<TaskList[]> {
    return this.taskListsService.findAllTaskLists();
  }

  @Get(':id')
  async findTaskListById(@Param('id') id: number): Promise<TaskList> {
    return this.taskListsService.findTaskListById(id);
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
