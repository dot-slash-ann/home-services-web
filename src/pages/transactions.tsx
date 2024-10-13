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
import TransactionsFiltersForm from '../components/forms/transactions-filters-form';
import { DateFilterType, FiltersType } from 'src/types/forms';

dayjs.extend(utc);

const TransactionsPage: FunctionalComponent = (): h.JSX.Element => {
  const postedOnInput = useSignal<Date | null>(null);
  const transactionOnInput = useSignal<Date | null>(null);
  const amountInput = useSignal<number | null>(null);

  const categoryInput = useSignal<string>('');
  const vendorInput = useSignal<string>('');

  const filterCategory = useSignal<string>('');
  const filterVendor = useSignal<string>('');
  const filterTransactionOnFrom = useSignal<string>('');
  const filterTransactionOnTo = useSignal<string>('');
  const filterPostedOnFrom = useSignal<string>('');
  const filterPostedOnTo = useSignal<string>('');

  const filters = useSignal<Map<`${FiltersType}_id` | DateFilterType, number | string>>(new Map());

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
          amount: amountInput.value,
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

  async function handleDelete(id: number): Promise<void> {
    try {
      const options = {
        method: 'DELETE',
      };

      const response = await fetch(`http://localhost:3000/api/transactions/${id}`, options);

      if (!response.ok) {
        console.error('Failed to delete transaction', response);

        return;
      }

      NewTransactionErrorSignal.value = false;

      transactions.value = transactions.value.filter((transaction) => transaction.id !== id);
    } catch (error: unknown) {
      console.error('Error deleting transaction', error);
    }
  }

  async function handleFilterCategoryChange(categoryJson: string) {
    try {
      const category = categoryJson !== '' ? (JSON.parse(categoryJson) as Category | '') : '';

      if (category === '') {
        filters.value.delete('category_id');
      } else {
        filters.value.set('category_id', category.id);
      }

      filterCategory.value = categoryJson;
      handleFilterChange();
    } catch (error: unknown) {
      console.log('Error filtering by category', error);
    }
  }

  async function handleFilterVendorChange(vendorJson: string) {
    try {
      const vendor = vendorJson !== '' ? (JSON.parse(vendorJson) as Category | '') : '';

      if (vendor === '') {
        filters.value.delete('vendor_id');
      } else {
        filters.value.set('vendor_id', vendor.id);
      }

      filterVendor.value = vendorJson;
      handleFilterChange();
    } catch (error: unknown) {
      console.log('Error filtering by vendor', error);
    }
  }

  async function handleFilterTransactionOnFromChange(transactionOnFrom: string) {
    if (transactionOnFrom === '') {
      filters.value.delete('transaction_on_from');
    } else {
      filters.value.set('transaction_on_from', transactionOnFrom);
    }

    filterTransactionOnFrom.value = transactionOnFrom;

    handleFilterChange();
  }

  async function handleFilterTransactionOnToChange(transactionOnTo: string) {
    if (transactionOnTo === '') {
      filters.value.delete('transaction_on_to');
    } else {
      filters.value.set('transaction_on_to', transactionOnTo);
    }

    filterTransactionOnTo.value = transactionOnTo;

    handleFilterChange();
  }

  async function handleFilterPostedOnFromChange(postedOnFrom: string) {
    if (postedOnFrom === '') {
      filters.value.delete('posted_on_from');
    } else {
      filters.value.set('posted_on_from', postedOnFrom);
    }

    filterPostedOnFrom.value = postedOnFrom;

    handleFilterChange();
  }

  async function handleFilterPostedOnToChange(postedOnTo: string) {
    if (postedOnTo === '') {
      filters.value.delete('posted_on_to');
    } else {
      filters.value.set('posted_on_to', postedOnTo);
    }

    filterPostedOnTo.value = postedOnTo;

    handleFilterChange();
  }

  async function handleFilterChange() {
    try {
      let url = 'http://localhost:3000/api/transactions';

      if (filters.value.size > 0) {
        url += '?';

        for (const [key, value] of filters.value.entries()) {
          url += `${key}=${value}&`;
        }

        url.substring(0, url.length - 1);
      }

      console.log(url);

      const response = await fetch(url);

      const transactionsList = (await response.json()) as TransactionsListResponse;

      transactions.value = transactionsList.data;
    } catch (error: unknown) {
      console.log('Error filtering', error);
    }
  }

  return (
    <div class="max-w-7xl mx-auto mt-10">
      <div class="max-w-md mx-auto">
        <TransactionForm
          postedOnInput={postedOnInput}
          transactionOnInput={transactionOnInput}
          amountInput={amountInput}
          categoryInput={categoryInput}
          vendorInput={vendorInput}
          categories={categories}
          vendors={vendors}
          handleSubmit={handleSubmit}
        />
      </div>

      <div class="max-w-7xl mx-auto mt-6">
        <TransactionsFiltersForm
          categories={categories}
          vendors={vendors}
          filterCategory={filterCategory}
          filterVendor={filterVendor}
          filterTransactionOnFrom={filterTransactionOnFrom}
          filterTransactionOnTo={filterTransactionOnTo}
          filterPostedOnFrom={filterPostedOnFrom}
          filterPostedOnTo={filterPostedOnTo}
          handleFilterCategoryChange={handleFilterCategoryChange}
          handleFilterVendorChange={handleFilterVendorChange}
          handleFilterTransactionOnFromChange={handleFilterTransactionOnFromChange}
          handleFilterTransactionOnToChange={handleFilterTransactionOnToChange}
          handleFilterPostedOnFromChange={handleFilterPostedOnFromChange}
          handleFilterPostedOnToChange={handleFilterPostedOnToChange}
        />
      </div>

      <div class="overflow-x-auto mx-auto my-8 shadow-md">
        <table class="min-w-full bg-white shadow-md rounded border-collapse">
          <thead>
            <tr>
              <th class="py-2 px-4 border text-gray-600 font-bold uppercase text-sm text-left">Actions</th>
              <th class="py-2 px-4 border text-gray-600 font-bold uppercase text-sm text-left">Posted On</th>
              <th class="py-2 px-4 border text-gray-600 font-bold uppercase text-sm text-left">Transaction On</th>
              <th class="py-2 px-4 border text-gray-600 font-bold uppercase text-sm text-left">Amount</th>
              <th class="py-2 px-4 border text-gray-600 font-bold uppercase text-sm text-left">Category</th>
              <th class="py-2 px-4 border text-gray-600 font-bold uppercase text-sm text-left">Vendor</th>
            </tr>
          </thead>
          <tbody>
            {transactions.value.map((transaction) => (
              <tr key={transaction.id}>
                <td class="py-2 px-4 border">
                  <button
                    class="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => handleDelete(transaction.id)}
                  >
                    Delete
                  </button>
                  <button
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => {}}
                  >
                    Tag
                  </button>
                </td>
                <td class="py-2 px-4 border">{dayjs.utc(transaction.posted_on).format('MM/DD/YYYY')}</td>
                <td class="py-2 px-4 border">{dayjs.utc(transaction.transaction_on).format('MM/DD/YYYY')}</td>
                <td class="py-2 px-4 border">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(transaction.amount)}
                </td>
                <td class="py-2 px-4 border">{transaction.category.name}</td>
                <td class="py-2 px-4 border">{transaction.vendor.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsPage;
