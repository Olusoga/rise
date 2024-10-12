import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    Index,
    OneToMany,
  } from 'typeorm';
import { User } from './user.entity';
 import { Comment } from './comment.entity';
  @Entity('post')
  export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: number;
  
    @Column({ type: 'varchar', nullable: false })
    title: string;
  
    @Column({ type: 'text', nullable: false })
    content: string;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
  
    @Column({ type: 'int', nullable: false })
    @Index() // Index for userId
    userId: number;
  
    @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
    user: User;
  
    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];
  }
  