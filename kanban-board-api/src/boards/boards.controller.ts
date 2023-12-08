import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BoardsService } from './boards.service'; 
import { Board } from '@prisma/client'; 
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AdminRoleGuard } from '../guards/admin-role.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  // Create a new board
  @Post()
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async createBoard(@Body() createBoardDto: CreateBoardDto) {
    return this.boardsService.createBoard(createBoardDto);
  }

  // Get all boards
  @Get()
  async findAllBoards(): Promise<Board[]> {
    return this.boardsService.findAllBoards();
  }

  // Get a single board
  @Get(':id')
  async findBoardById(@Param('id') id: number): Promise<Board> {
    return this.boardsService.findBoardById(id);
  }

  // Update a board
  @Put(':id')
  async updateBoard(
    @Param('id') id: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    return this.boardsService.updateBoard(id, updateBoardDto);
  }

  // Delete a board
  @Delete(':id')
  async deleteBoard(@Param('id') id: number): Promise<void> {
    return this.boardsService.deleteBoard(id);
  }
}
