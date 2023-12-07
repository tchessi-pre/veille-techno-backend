import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { BoardsService } from './boards.service'; 
import { Board } from '@prisma/client'; 
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  async createBoard(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardsService.createBoard(createBoardDto);
  }

  @Get()
  async findAllBoards(): Promise<Board[]> {
    return this.boardsService.findAllBoards();
  }

  @Get(':id')
  async findBoardById(@Param('id') id: number): Promise<Board> {
    return this.boardsService.findBoardById(id);
  }

  @Put(':id')
  async updateBoard(
    @Param('id') id: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    return this.boardsService.updateBoard(id, updateBoardDto);
  }

  @Delete(':id')
  async deleteBoard(@Param('id') id: number): Promise<void> {
    return this.boardsService.deleteBoard(id);
  }
}
