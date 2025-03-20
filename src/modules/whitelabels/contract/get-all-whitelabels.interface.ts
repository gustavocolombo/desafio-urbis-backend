import { Whitelabel } from '@prisma/client';

export interface IResponseGetWhitelabels {
  whitelabels: Whitelabel[];
  totalWhitelabels: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
