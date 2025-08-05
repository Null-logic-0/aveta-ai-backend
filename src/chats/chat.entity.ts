import { User } from '../users/user.entity';
import { Character } from '../characters/character.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from './messages/message.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Message, (msg) => msg.chat, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  messages: Message[];

  @Column({ type: 'varchar', nullable: true })
  theme?: string;

  @ManyToOne(() => Character, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  character: Character;

  @ManyToOne(() => User, { eager: true, nullable: false })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
