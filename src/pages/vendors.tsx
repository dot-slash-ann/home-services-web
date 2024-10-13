import { useSignal } from '@preact/signals';
import { FunctionalComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';
import { TargetedEvent } from 'preact/compat';

import { VendorsListResponse, Vendor, VendorResponse } from '../types/vendors';
import VendorForm, { NewVendorErrorSignal } from '../components/forms/vendors-form';

const VendorsPage: FunctionalComponent = (): h.JSX.Element => {
  const nameInput = useSignal<string>('');
  const vendors = useSignal<Vendor[]>([]);

  useEffect(() => {
    async function fetchVendors() {
      const response = await fetch('http://localhost:3000/api/vendors');
      const vendorsResponse = (await response.json()) as VendorsListResponse;

      vendors.value = vendorsResponse.data;
    }

    fetchVendors();
  }, []);

  async function handleSubmit(event: TargetedEvent<HTMLFormElement, Event>): Promise<void> {
    event.preventDefault();

    if (nameInput.value.trim() === '') {
      return;
    }

    try {
      const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: nameInput.value }),
      };

      const response = await fetch('http://localhost:3000/api/vendors', payload);

      if (!response.ok) {
        NewVendorErrorSignal.value = true;

        return;
      }

      const result = (await response.json()) as VendorResponse;

      vendors.value = [...vendors.value, result.data];

      nameInput.value = '';
    } catch (error: unknown) {
      console.error('Error submitting vendor', error);
    }
  }

  async function handleDelete(id: number): Promise<void> {
    try {
      const options = {
        method: 'DELETE',
      };

      const response = await fetch(`http://localhost:3000/api/vendors/${id}`, options);

      if (!response.ok) {
        console.error('Failed to delete vendor', response);

        return;
      }

      NewVendorErrorSignal.value = false;

      vendors.value = vendors.value.filter((vendor) => vendor.id !== id);
    } catch (error: unknown) {
      console.error('Error deleting vendor', error);
    }
  }

  return (
    <div class="max-w-md mx-auto mt-10">
      <VendorForm nameInput={nameInput} handleSubmit={handleSubmit} />

      <table class="min-w-full bg-white shadow-md rounded border-collapse">
        <thead>
          <tr>
            <th class="py-2 px-4 border text-gray-600 font-bold uppercase text-sm text-left">Actions</th>
            <th class="py-2 px-4 border text-gray-600 font-bold uppercase text-sm text-left">Name</th>
          </tr>
        </thead>
        <tbody>
          {vendors.value.map((vendor) => (
            <tr key={vendor.id}>
              <td class="py-2 px-4 border">{vendor.name}</td>
              <td class="py-2 px-4 border">
                <button
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleDelete(vendor.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorsPage;
