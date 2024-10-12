import { useSignal } from '@preact/signals';
import { FunctionalComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';
import { TargetedEvent } from 'preact/compat';

import { CategoriesListResponse, Category, CategoryResponse } from '../types/categories';
import CategoriesForm, { NewCategoryNameErrorSignal } from '../components/forms/categories-form';

const CategoriesPage: FunctionalComponent = (): h.JSX.Element => {
  const nameInput = useSignal<string>('');
  const categories = useSignal<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch('http://localhost:3000/api/categories');
      const categoriesResponse = (await response.json()) as CategoriesListResponse;

      categories.value = categoriesResponse.data;
    }

    fetchCategories();
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

      const response = await fetch('http://localhost:3000/api/categories', payload);

      if (!response.ok) {
        NewCategoryNameErrorSignal.value = true;

        return;
      }

      const result = (await response.json()) as CategoryResponse;

      categories.value = [...categories.value, result.data];

      nameInput.value = '';
    } catch (error: unknown) {
      console.error('Error submitting form', error);
    }
  }

  async function handleDelete(id: number): Promise<void> {
    try {
      const options = {
        method: 'DELETE',
      };

      const response = await fetch(`http://localhost:3000/api/categories/${id}`, options);

      if (!response.ok) {
        console.error('Failed to submit', response);

        return;
      }

      NewCategoryNameErrorSignal.value = false;

      categories.value = categories.value.filter((category) => category.id !== id);

      nameInput.value = '';
    } catch (error: unknown) {
      console.error('Error submitting form', error);
    }
  }

  return (
    <div class="max-w-md mx-auto mt-10">
      <CategoriesForm nameInput={nameInput} handleSubmit={handleSubmit} />

      <table class="min-w-full bg-white shadow-md rounded border-collapse">
        <thead>
          <tr>
            <th class="py-2 px-4 border text-gray-600 font-bold uppercase text-sm text-left">Actions</th>
            <th class="py-2 px-4 border text-gray-600 font-bold uppercase text-sm text-left">Name</th>
          </tr>
        </thead>
        <tbody>
          {categories.value.map((category) => (
            <tr key={category.id}>
              <td class="py-2 px-4 border">{category.name}</td>
              <td class="py-2 px-4 border">
                <button
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleDelete(category.id)}
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

export default CategoriesPage;
