import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Importez le service Prisma approprié
import { UpdateBoardDto } from './dto/update-board.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from '@prisma/client';

@Injectable()
export class BoardsService {
  constructor(private readonly prisma: PrismaService) {}

  async createBoard(createBoardDto: CreateBoardDto) {
    return this.prisma.board.create({
      data: {
        title: createBoardDto.title,
        owner: {
          connect: {
            id: createBoardDto.ownerId,
          },
        },
      },
    });
  }

  async findAllBoards(): Promise<Board[]> {
    return this.prisma.board.findMany();
  }

  async findBoardById(id: number): Promise<Board> {
    return this.prisma.board.findUnique({
      where: {
        id,
      },
    });
  }

  async updateBoard(
    id: number,
    updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    return this.prisma.board.update({
      where: {
        id,
      },
      data: updateBoardDto,
    });
  }

  async deleteBoard(id: number): Promise<void> {
    await this.prisma.board.delete({
      where: {
        id,
      },
    });
  }
}
