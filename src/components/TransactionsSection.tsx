import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { Signal, useSignal } from '@preact/signals';
import { FunctionalComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';

import { TransactionsListResponse, Transaction } from '../types/transactions';
import { NewTransactionErrorSignal } from '../components/forms/transactions-form';
import { CategoriesListResponse, Category } from '../types/categories';
import { Vendor, VendorsListResponse } from '../types/vendors';
import TransactionsFiltersForm from '../components/forms/transactions-filters-form';
import { DateFilterType, FiltersType } from '../types/forms';
import TransactionsTable from '../components/tables/transactions-table';

dayjs.extend(utc);

type TransactionsSectionProps = {
  categories: Signal<Category[]>;
  transactions: Signal<Transaction[]>;
  vendors: Signal<Vendor[]>;
};

const TransactionsSection: FunctionalComponent<TransactionsSectionProps> = ({
  categories,
  transactions,
  vendors,
}: TransactionsSectionProps): h.JSX.Element => {
  const filterCategory = useSignal<string>('');
  const filterVendor = useSignal<string>('');
  const filterTransactionOnFrom = useSignal<string>('');
  const filterTransactionOnTo = useSignal<string>('');
  const filterPostedOnFrom = useSignal<string>('');
  const filterPostedOnTo = useSignal<string>('');

  const filters = useSignal<Map<`${FiltersType}_id` | DateFilterType, number | string>>(new Map());

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

  function handleClearFilters() {
    filters.value.clear();

    filterCategory.value = '';
    filterVendor.value = '';
    filterTransactionOnFrom.value = '';
    filterTransactionOnTo.value = '';
    filterPostedOnFrom.value = '';
    filterPostedOnTo.value = '';

    handleFilterChange();
  }

  return (
    <div class="max-w-7xl mx-auto mt-10">
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
          handleClearFilters={handleClearFilters}
        />
      </div>

      <div class="overflow-x-auto mx-auto my-8 shadow-md">
        <TransactionsTable transactions={transactions} handleDelete={handleDelete} />
      </div>
    </div>
  );
};

export default TransactionsSection;
