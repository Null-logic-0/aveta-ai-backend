import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from '../dtos/sign-up.dto';
import { Role } from '../enums/role.enum';
import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { MailService } from '../../mail/providers/mail.service';

@Injectable()
export class SignUpProvider {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingPasswordProvider: HashingProvider,

    private readonly generateTokensProvider: GenerateTokensProvider,

    private readonly mailService: MailService,
  ) {}

  async signup(signUpDto: SignUpDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: signUpDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists with this email');
    }
    try {
      let newUser = this.usersRepository.create({
        ...signUpDto,
        role: Role.User,
        password: await this.hashingPasswordProvider.hashPassword(
          signUpDto.password,
        ),
      });

      newUser = await this.usersRepository.save(newUser);
      const tokens = await this.generateTokensProvider.generateToken(newUser);
      try {
        await this.mailService.sendUserWelcome(newUser);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }

      return {
        tokens,
        newUser,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Sign up Failed!');
    }
  }
}
