import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ nullable: false })
  media: string;

  @Column({ type: 'varchar', length: 1000 })
  excerpt: string;

  @ManyToOne(() => User, (user) => user.blogs, { eager: true })
  creator: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
