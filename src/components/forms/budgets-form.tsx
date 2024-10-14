import { Signal } from '@preact/signals';
import { FunctionComponent, h } from 'preact';
import { TargetedEvent } from 'preact/compat';

type BudgetsFormProps = {
  handleSubmit: (event: TargetedEvent<HTMLFormElement, Event>) => void;
  nameInput: Signal<string>;
};

const BudgetsForm: FunctionComponent<BudgetsFormProps> = ({
  handleSubmit,
  nameInput,
}: BudgetsFormProps): h.JSX.Element => {
  return (
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
      <div class="mb-4">
        <label for="budget-name" class="block text-gray-700 text-sm font-bold mb-2">
          Budget Name
        </label>
        <input
          id="budget-name"
          class="shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          value={nameInput.value}
          onInput={(event) => {
            nameInput.value = (event.target as HTMLInputElement).value;
          }}
        />
      </div>
      <div class="flex items-center justify-between">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          New Budget
        </button>
      </div>
    </form>
  );
};

export default BudgetsForm;
