import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { useSignal } from '@preact/signals';
import { FunctionalComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';
import { TargetedEvent } from 'preact/compat';

import { TransactionsListResponse, Transaction, TransactionResponse } from '../types/transactions';
import TransactionForm, { NewTransactionErrorSignal } from '../components/forms/transactions-form';
import { CategoriesListResponse, Category } from '../types/categories';
import { Vendor, VendorsListResponse } from '../types/vendors';
import TransactionsSection from '../components/TransactionsSection';

dayjs.extend(utc);

const TransactionsPage: FunctionalComponent = (): h.JSX.Element => {
  const postedOnInput = useSignal<Date | null>(null);
  const transactionOnInput = useSignal<Date | null>(null);
  const amountInput = useSignal<number | null>(null);
  const transactionTypeInput = useSignal<string>('');

  const categoryInput = useSignal<string>('');
  const vendorInput = useSignal<string>('');

  const transactions = useSignal<Transaction[]>([]);
  const categories = useSignal<Category[]>([]);
  const vendors = useSignal<Vendor[]>([]);

  useEffect(() => {
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
  }, []);

  async function handleSubmit(event: TargetedEvent<HTMLFormElement, Event>): Promise<void> {
    event.preventDefault();

    if (!postedOnInput.value || !transactionOnInput.value || amountInput.value === null) {
      return;
    }

    try {
      const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          posted_on: dayjs.utc(postedOnInput.value).format('YYYY-MM-DD'),
          transaction_on: dayjs.utc(transactionOnInput.value).format('YYYY-MM-DD'),
          amount: amountInput.value * 100,
          transaction_type: transactionTypeInput.value,
          category: categoryInput.value,
          vendor: vendorInput.value,
        }),
      };

      const response = await fetch('http://localhost:3000/api/transactions', payload);

      if (!response.ok) {
        NewTransactionErrorSignal.value = true;

        return;
      }

      const result = (await response.json()) as TransactionResponse;

      transactions.value = [...transactions.value, result.data];

      postedOnInput.value = null;
      transactionOnInput.value = null;
      amountInput.value = null;
      categoryInput.value = '';
      vendorInput.value = '';
    } catch (error: unknown) {
      console.error('Error submitting transaction', error);
    }
  }

  return (
    <div class="max-w-7xl mx-auto mt-10">
      <div class="max-w-md mx-auto">
        <TransactionForm
          postedOnInput={postedOnInput}
          transactionOnInput={transactionOnInput}
          amountInput={amountInput}
          transactionTypeInput={transactionTypeInput}
          categoryInput={categoryInput}
          vendorInput={vendorInput}
          categories={categories}
          vendors={vendors}
          handleSubmit={handleSubmit}
        />
      </div>

      <TransactionsSection />
    </div>
  );
};

export default TransactionsPage;
