import { signal, Signal } from '@preact/signals';
import { FunctionComponent, h } from 'preact';
import { TargetedEvent } from 'preact/compat';

type VendorFormProps = {
  handleSubmit: (event: TargetedEvent<HTMLFormElement, Event>) => void;
  nameInput: Signal<string>;
};

export const NewVendorErrorSignal = signal<boolean>(false);

const VendorForm: FunctionComponent<VendorFormProps> = ({
  handleSubmit,
  nameInput,
}: VendorFormProps): h.JSX.Element => {
  return (
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
      <div class="mb-4">
        <label for="vendor-name" class="block text-gray-700 text-sm font-bold mb-2">
          Vendor Name
        </label>
        <input
          id="vendor-name"
          class={`${
            NewVendorErrorSignal.value ? 'border-red-500 bg-red-100 ' : 'border-gray-300 '
          }shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          type="text"
          value={nameInput.value}
          onInput={(event) => {
            nameInput.value = (event.target as HTMLInputElement).value;
            NewVendorErrorSignal.value = false;
          }}
        />
      </div>
      <div class="flex items-center justify-between">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Add Vendor
        </button>
      </div>
    </form>
  );
};

export default VendorForm;
