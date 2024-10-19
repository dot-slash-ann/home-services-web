import { Signal } from '@preact/signals';
import dayjs from 'dayjs';
import { FunctionalComponent, h } from 'preact';
import { capitalize } from '../../lib/lib';
import { Transaction } from '../../types/transactions';

type TransactionsTableProps = {
  transactions: Signal<Transaction[]>;
  handleDelete: (id: number) => void;
};

const TransactionsTable: FunctionalComponent<TransactionsTableProps> = ({
  transactions,
  handleDelete,
}: TransactionsTableProps): h.JSX.Element => {
  return (
    <table class="min-w-full bg-white shadow-md rounded border-collapse">
      <thead>
        <tr>
          <th class="py-2 px-4 border text-gray-600 font-bold uppercase text-sm text-left">Actions</th>
          <th class="py-2 px-4 border text-gray-600 font-bold uppercase text-sm text-left">Transaction On</th>
          <th class="py-2 px-4 border text-gray-600 font-bold uppercase text-sm text-left">Posted On</th>
          <th class="py-2 px-4 border text-gray-600 font-bold uppercase text-sm text-left">Amount</th>
          <th class="py-2 px-4 border text-gray-600 font-bold uppercase text-sm text-left">Type</th>
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
            <td class="py-2 px-4 border">{dayjs.utc(transaction.transaction_on).format('MM/DD/YYYY')}</td>
            <td class="py-2 px-4 border">{dayjs.utc(transaction.posted_on).format('MM/DD/YYYY')}</td>
            <td class={`py-2 px-4 border ${transaction.transaction_type === 'debit' ? 'text-red-500' : ''}`}>
              {transaction.transaction_type === 'debit'
                ? `(${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                    transaction.amount / 100,
                  )})`
                : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                    transaction.amount / 100,
                  )}
            </td>
            <td class="py-2 px-4 border">{capitalize(transaction.transaction_type)}</td>
            <td class="py-2 px-4 border">{transaction.category.name}</td>
            <td class="py-2 px-4 border">{transaction.vendor.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionsTable;
