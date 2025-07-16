import { Exclude } from 'class-transformer';
import { Role } from '../auth/enums/role.enum';
import { UserPlan } from '../subscription/enums/userPlan.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Blog } from 'src/blogs/blogs.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  userName: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
    unique: true,
  })
  email: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  password?: string;

  @Exclude()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  googleId?: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  profileImage?: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @Column({
    type: 'enum',
    enum: UserPlan,
    default: UserPlan.Free,
  })
  UserPlan: UserPlan;

  @Column({
    type: 'boolean',
    default: false,
  })
  isPaid: boolean;

  @OneToMany(() => Blog, (blogList) => blogList.creator)
  blogs?: Blog[];

  characters?: [];

  likedCharacters?: [];

  @Column({
    type: 'boolean',
    default: false,
  })
  isBlocked: boolean;

  @Column({ default: 0 })
  tokenVersion: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
