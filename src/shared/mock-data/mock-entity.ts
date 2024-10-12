import { Post } from "src/database/entities/post.entity";

// Mock User Entity
export const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed_password', // Include this to satisfy TypeScript, could be a placeholder
    createdAt: new Date(),
    updatedAt: new Date(),
    posts: [], // If you need to reference the posts, this could be an empty array for the mock
    comments: [], // Assuming comments are also part of User
  };
  
  // Mock Post Entity
  export const mockPost: Post = {
    id: 1,
    title: 'Test Post',
    content: 'This is a test post',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 12305923,
    comments:[],
    user: mockUser, // Using the complete mock user
  };
  