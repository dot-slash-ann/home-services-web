import { Category } from './categories';
import { Tag } from './tags';
import { Vendor } from './vendors';

export interface Transaction {
  id: number;
  postedOn: Date;
  transactionOn: Date;
  amount: number;
  category: Category;
  tags: Tag[];
  vendor: Vendor;
}

export interface TransactionsListResponse {
  data: Transaction[];
}

export interface TransactionResponse {
  data: Transaction;
}
