import { signal, Signal } from '@preact/signals';
import { FunctionComponent, h } from 'preact';
import { TargetedEvent } from 'preact/compat';
import { Category } from '../../types/categories';
import { Vendor } from '../../types/vendors';

type TransactionFormProps = {
  handleSubmit: (event: TargetedEvent<HTMLFormElement, Event>) => void;
  postedOnInput: Signal<Date | null>;
  transactionOnInput: Signal<Date | null>;
  amountInput: Signal<number | null>;
  transactionTypeInput: Signal<string>;

  categoryInput: Signal<string>;
  vendorInput: Signal<string>;

  categories: Signal<Category[]>;
  vendors: Signal<Vendor[]>;
};

export const NewTransactionErrorSignal = signal<boolean>(false);

const TransactionForm: FunctionComponent<TransactionFormProps> = ({
  handleSubmit,
  postedOnInput,
  transactionOnInput,
  amountInput,
  transactionTypeInput,
  categoryInput,
  vendorInput,
  categories,
  vendors,
}: TransactionFormProps): h.JSX.Element => {
  return (
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
      <div class="mb-4">
        <label for="transaction-on" class="block text-gray-700 text-sm font-bold mb-2">
          Transaction On
        </label>
        <input
          id="transaction-on"
          type="date"
          class={`${
            NewTransactionErrorSignal.value ? 'border-red-500 bg-red-100 ' : 'border-gray-300 '
          }shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          value={transactionOnInput.value?.toISOString().split('T')[0] || ''}
          onInput={(event) => {
            transactionOnInput.value = new Date((event.target as HTMLInputElement).value);
            NewTransactionErrorSignal.value = false;
          }}
        />
      </div>
      <div class="mb-4">
        <label for="posted-on" class="block text-gray-700 text-sm font-bold mb-2">
          Posted On
        </label>
        <input
          id="posted-on"
          type="date"
          class={`${
            NewTransactionErrorSignal.value ? 'border-red-500 bg-red-100 ' : 'border-gray-300 '
          }shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          value={postedOnInput.value?.toISOString().split('T')[0] || ''}
          onInput={(event) => {
            postedOnInput.value = new Date((event.target as HTMLInputElement).value);
            NewTransactionErrorSignal.value = false;
          }}
        />
      </div>
      <div class="mb-4">
        <label for="amount" class="block text-gray-700 text-sm font-bold mb-2">
          Amount
        </label>
        <input
          id="amount"
          type="number"
          step="any"
          class={`${
            NewTransactionErrorSignal.value ? 'border-red-500 bg-red-100 ' : 'border-gray-300 '
          }shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          value={amountInput.value || ''}
          onInput={(event) => {
            amountInput.value = parseFloat((event.target as HTMLInputElement).value);
            NewTransactionErrorSignal.value = false;
          }}
        />
      </div>
      <div class="mb-4">
        <label for="transaction-type" class="block text-gray-700 text-sm font-bold mb-2">
          Transaction Type
        </label>
        <select
          id="transaction-type"
          class="shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onInput={(event) => {
            transactionTypeInput.value = (event.target as HTMLInputElement).value;
            NewTransactionErrorSignal.value = false;
          }}
        >
          <option value="">Select a transaction type</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
      </div>
      <div class="mb-4">
        <label for="category" class="block text-gray-700 text-sm font-bold mb-2">
          Category
        </label>
        <select
          id="category"
          class="shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={categoryInput.value}
          onInput={(event) => {
            categoryInput.value = (event.target as HTMLSelectElement).value;
            NewTransactionErrorSignal.value = false;
          }}
        >
          <option value="">Select a category</option>
          {categories.value.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div class="mb-4">
        <label for="vendor" class="block text-gray-700 text-sm font-bold mb-2">
          Vendor
        </label>
        <select
          id="vendor"
          class="shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={vendorInput.value}
          onInput={(event) => {
            vendorInput.value = (event.target as HTMLSelectElement).value;
            NewTransactionErrorSignal.value = false;
          }}
        >
          <option value="">Select a vendor</option>
          {vendors.value.map((vendor) => (
            <option key={vendor.id} value={vendor.name}>
              {vendor.name}
            </option>
          ))}
        </select>
      </div>
      <div class="flex items-center justify-between">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Add Transaction
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
