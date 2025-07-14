import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FindByEmailProvider } from './providers/find-by-email-provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,

    private readonly findOneByEmailProvider: FindByEmailProvider,
  ) {}

  getAll() {
    return this.usersRepository.find();
  }

  getOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByEmail(email: string) {
    return this.findOneByEmailProvider.findOneByEmail(email);
  }
}
