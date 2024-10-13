import { Signal } from '@preact/signals';
import { FunctionalComponent, h } from 'preact';
import { Category } from '../../types/categories';
import { Vendor } from '../../types/vendors';

type TransactionsFiltersFormProps = {
  vendors: Signal<Vendor[]>;
  categories: Signal<Category[]>;

  filterCategory: Signal<string>;
  handleFilterCategoryChange: (category: string) => void;
};

const TransactionsFiltersForm: FunctionalComponent<TransactionsFiltersFormProps> = ({
  categories,
  vendors,
  filterCategory,
  handleFilterCategoryChange,
}: TransactionsFiltersFormProps): h.JSX.Element => {
  return (
    <div class="bg-white shadow-md rounded p-4 flex space-x-4 items-end">
      <div>
        <label for="filterCategory" class="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="filterCategory"
          class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={filterCategory}
          onChange={(event: Event) => handleFilterCategoryChange((event.target as HTMLInputElement).value)}
        >
          <option value="">All</option>
          {categories.value.map((category) => (
            <option key={category.id} value={JSON.stringify({ id: category.id, name: category.name })}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label for="filterVendor" class="block text-sm font-medium text-gray-700">
          Vendor
        </label>
        <select
          id="filterVendor"
          class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          // value={filterVendor}
          // onChange={handleFilterVendorChange}
        >
          <option value="">All</option>
          {vendors.value.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label for="filterPostedOn" class="block text-sm font-medium text-gray-700">
          Posted On
        </label>
        <input
          type="date"
          id="filterPostedOn"
          class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          // value={filterPostedOn}
          // onChange={handleFilterPostedOnChange}
        />
      </div>

      <div>
        <label for="filterTransactionOn" class="block text-sm font-medium text-gray-700">
          Transaction On
        </label>
        <input
          type="date"
          id="filterTransactionOn"
          class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          // value={filterTransactionOn}
          // onChange={handleFilterTransactionOnChange}
        />
      </div>

      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        // onClick={handleClearFilters}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default TransactionsFiltersForm;
