import { Category } from './categories';

export interface Budget {
  id: number;
  name: string;
  categories: Category[];
}

export interface BudgetsListResponse {
  data: Budget[];
}

export interface BudgetResponse {
  data: Budget;
}
