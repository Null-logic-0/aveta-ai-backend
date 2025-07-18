import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chat } from '../chat.entity';
import { User } from 'src/users/user.entity';
import { Character } from 'src/characters/character.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
  chat: Chat;

  @ManyToOne(() => User, { nullable: true })
  user?: User;

  @ManyToOne(() => Character, { nullable: true })
  character?: Character;

  @Column({ length: 1000 })
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
