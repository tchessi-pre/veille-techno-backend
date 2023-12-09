import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { BoardsService } from './boards.service'; 
import { Board } from '@prisma/client'; 
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AdminRoleGuard } from '../guards/admin-role.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
  async findBoardById(@Param('id') id: string): Promise<Board> {
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      throw new BadRequestException('ID doit être un nombre entier valide.');
    }

    try {
      const board = await this.boardsService.findBoardById(parsedId);
      if (!board) {
        throw new NotFoundException(`Board avec l'ID ${parsedId} non trouvé.`);
      }
      return board;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Board avec l'ID ${parsedId} non trouvé.`);
      } else {
        throw error;
      }
    }
  }

  // Update a board
  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async updateBoard(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      throw new BadRequestException('ID doit être un nombre entier valide.');
    }

    try {
      const updatedBoard = await this.boardsService.updateBoard(
        parsedId,
        updateBoardDto,
      );
      return updatedBoard;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        // P2025 est le code d'erreur pour "Enregistrement non trouvé"
        throw new NotFoundException(`Board avec l'ID ${parsedId} non trouvé.`);
      } else {
        // Relancez l'erreur si elle est d'un autre type
        throw error;
      }
    }
  }

  // Delete a board
  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async deleteBoard(@Param('id') id: string): Promise<{ message: string }> {
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      throw new BadRequestException('ID doit être un nombre entier valide.');
    }

    try {
      await this.boardsService.deleteBoard(parsedId);
      return { message: `Board avec l'ID ${parsedId} supprimé avec succès.` };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        // P2025 est le code d'erreur pour "Enregistrement non trouvé"
        throw new NotFoundException(`Board avec l'ID ${parsedId} non trouvé.`);
      } else {
        // Relancez l'erreur si elle est d'un autre type
        throw error;
      }
    }
  }
}
