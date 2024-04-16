import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { PAGINATION_LIMIT } from './config';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  // get list of all users
  async findAll(page: number = 1): Promise<UsersEntity[]> {
    const skip = (page - 1) * PAGINATION_LIMIT;
    return await this.usersRepo.find({
      skip,
      take: PAGINATION_LIMIT,
    });
  }

  async getTotalPages(): Promise<number> {
    return (await this.usersRepo.count()) / PAGINATION_LIMIT;
  }
}
