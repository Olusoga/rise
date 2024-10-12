import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    Index,
  } from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

  @Entity('comment')
  export class Comment {
   @PrimaryGeneratedColumn('uuid')
    id: number;
  
    @Column({ type: 'text', nullable: false })
    content: string;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @Index() 
    createdAt: Date;
  
    @Column({ type: 'int', nullable: false })
    @Index() 
    postId: number;

    @Column({ type: 'int', nullable: false })
    @Index() 
    userId: number;

    @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
    user: User;
  
    @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
    post: Post;
  }
  