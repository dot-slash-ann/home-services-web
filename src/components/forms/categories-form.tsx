import { signal, Signal } from '@preact/signals';
import { FunctionComponent, h } from 'preact';
import { TargetedEvent } from 'preact/compat';

type CategoriesFormProps = {
  handleSubmit: (event: TargetedEvent<HTMLFormElement, Event>) => void;
  nameInput: Signal;
};

export const NewCategoryNameErrorSignal = signal<boolean>(false);

const CategoriesForm: FunctionComponent<CategoriesFormProps> = ({
  handleSubmit,
  nameInput,
}: CategoriesFormProps): h.JSX.Element => {
  return (
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
      <div class="mb-4">
        <label for="category-name" class="block text-gray-700 text-sm font-bold mb-2">
          Category Name
        </label>
        <input
          id="category-name"
          class={`${
            NewCategoryNameErrorSignal.value ? 'border-red-500 bg-red-100 ' : 'border-gray-300 '
          }shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          type="text"
          value={nameInput.value}
          onInput={(event) => {
            nameInput.value = (event.target as HTMLInputElement).value;
            NewCategoryNameErrorSignal.value = false;
          }}
        />
      </div>
      <div class="flex items-center justify-between">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Add Category
        </button>
      </div>
    </form>
  );
};

export default CategoriesForm;
