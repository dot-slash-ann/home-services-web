import { Category } from './categories';

export interface Budget {
  id: number;
  name: string;
}

export interface BudgetsListResponse {
  data: Budget[];
}

export interface BudgetResponse {
  data: Budget;
}

export interface BudgetDetailsResponse {
  data: {
    budget: Budget;
    categories: BudgetCategory[];
  };
}

export interface BudgetCategory {
  amount: number;
  category: Category;
}
