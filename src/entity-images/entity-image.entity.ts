import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityImageType } from './enums/entity-images.enum';

@Entity()
export class EntityImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'enum', enum: EntityImageType })
  type: EntityImageType;

  @CreateDateColumn()
  createdAt: Date;
}
