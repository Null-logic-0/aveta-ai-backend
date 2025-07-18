import { User } from '../users/user.entity';
import { Chat } from '../chats/chat.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Visibility } from './enums/visibility.enum';
import { Tags } from './enums/tags.enum';

@Entity()
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    length: 96,
  })
  characterName: string;

  @Column({
    nullable: false,
  })
  avatar: string;

  @Column({ type: 'varchar', length: 1000 })
  tagline: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({
    nullable: true,
    length: 200,
    default: 'Hi, I’m your new companion!',
  })
  greeting?: string;

  @Column({
    type: 'enum',
    enum: Tags,
    array: true,
  })
  tags: Tags[];

  @Column({
    type: 'enum',
    enum: Visibility,
    default: Visibility.PUBLIC,
  })
  visibility: Visibility;

  @ManyToOne(() => User, (user) => user.characters, { eager: true })
  creator: User;

  @OneToMany(() => Chat, (chat) => chat.character, { cascade: true })
  chats: Chat[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
