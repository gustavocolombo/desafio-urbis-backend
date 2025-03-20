import { User } from '@prisma/client';

export interface IresponseGetUsers {
  users: User[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
