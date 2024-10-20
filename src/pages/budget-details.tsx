import { FunctionComponent, h } from 'preact';
import { useParams } from 'react-router-dom';
import { useSignal } from '@preact/signals';
import { useEffect } from 'react';

import TransactionsSection from '../components/TransactionsSection';
import { Budget, BudgetCategory, BudgetDetailsResponse } from '../types/budgets';
import { Transaction, TransactionsListResponse } from '../types/transactions';
import { CategoriesListResponse, Category } from '../types/categories';
import { Vendor, VendorsListResponse } from '../types/vendors';

const BudgetDetailsPage: FunctionComponent = (): h.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const budget = useSignal<Budget>();
  const budgetCategories = useSignal<BudgetCategory[]>([]);

  const transactions = useSignal<Transaction[]>([]);
  const categories = useSignal<Category[]>([]);
  const vendors = useSignal<Vendor[]>([]);

  useEffect(() => {
    async function fetchBudget() {
      const response = await fetch(`http://localhost:3000/api/budgets/${id}/overview`);
      const budgetResponse = (await response.json()) as BudgetDetailsResponse;

      budget.value = budgetResponse.data.budget;
      budgetCategories.value = budgetResponse.data.categories;
    }

    async function fetchTransactions() {
      const response = await fetch('http://localhost:3000/api/transactions');
      const transactionsResponse = (await response.json()) as TransactionsListResponse;

      transactions.value = transactionsResponse.data;
    }

    async function fetchCategories() {
      const response = await fetch('http://localhost:3000/api/categories');
      const categoriesResponse = (await response.json()) as CategoriesListResponse;

      categories.value = categoriesResponse.data;
    }

    async function fetchVendors() {
      const response = await fetch('http://localhost:3000/api/vendors');
      const vendorsResponse = (await response.json()) as VendorsListResponse;

      vendors.value = vendorsResponse.data;
    }

    fetchTransactions();
    fetchCategories();
    fetchVendors();
    fetchBudget();
  }, [id]);

  return (
    <div class="max-w-7xl mx-auto mt-10">
      <h1 class="text-2xl font-bold">{budget.value?.name}</h1>
      <div class="mt-4">
        <h2 class="text-xl font-semibold">Categories</h2>
        {budgetCategories.value.map((budgetCategory) => (
          <div key={budgetCategory.category.id} class="mt-2 p-4 bg-gray-100 rounded shadow-sm">
            <div class="text-lg">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(budgetCategory.amount / 100)}
            </div>
            <div class="text-sm text-gray-600">{budgetCategory.category.name}</div>
            <div class="text-sm text-gray-600">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(
                transactions.value
                  .filter((transaction) => transaction.category.name === budgetCategory.category.name)
                  .map((transaction) => transaction.amount)
                  .reduce((sum, amount) => {
                    return (sum += amount);
                  }, 0) / 100,
              )}
            </div>
          </div>
        ))}
      </div>

      <TransactionsSection categories={categories} transactions={transactions} vendors={vendors} />
    </div>
  );
};

export default BudgetDetailsPage;
