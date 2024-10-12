
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index,
  } from 'typeorm';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
  
  
  @Entity('user')
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: number;
  
    @Column({ type: 'varchar', nullable: false })
    @Index({ unique: true }) // Index for unique email
    email: string;
  
    @Column({ type: 'varchar', nullable: false })
    name: string;
  
    @Column({ type: 'varchar', nullable: false })
    password: string;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
  
    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany(() => Post, (post) => post.user)
    comments: Comment[];
  }
  