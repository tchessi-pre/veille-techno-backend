import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private _user: any;
  public get user(): any {
    return this._user;
  }
  public set user(value: any) {
    this._user = value;
  }
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Definition de la méthode $connect pour renvoyer une promesse
  async $connect() {
    return super.$connect();
  }

  // Redéfinition de la méthode $disconnect pour renvoyer une promesse
  async $disconnect() {
    return super.$disconnect();
  }
}
