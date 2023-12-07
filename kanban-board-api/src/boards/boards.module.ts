import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

@Module({
  controllers: [BoardsController],
  providers: [PrismaService, BoardsService],
})
export class BoardsModule {}
