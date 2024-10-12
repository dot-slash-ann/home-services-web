import { useSignal } from '@preact/signals';
import { FunctionalComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';
import { TargetedEvent } from 'preact/compat';

import { TagsListResponse, Tag, TagResponse } from '../types/tags';
import TagsForm, { NewTagNameErrorSignal } from '../components/forms/tags-form';

const TagsPage: FunctionalComponent = (): h.JSX.Element => {
  const nameInput = useSignal<string>('');
  const tags = useSignal<Tag[]>([]);

  useEffect(() => {
    async function fetchTags() {
      const response = await fetch('http://localhost:3000/api/tags');
      const tagsResponse = (await response.json()) as TagsListResponse;

      tags.value = tagsResponse.data;
    }

    fetchTags();
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

      const response = await fetch('http://localhost:3000/api/tags', payload);

      if (!response.ok) {
        NewTagNameErrorSignal.value = true;

        return;
      }

      const result = (await response.json()) as TagResponse;

      tags.value = [...tags.value, result.data];

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

      const response = await fetch(`http://localhost:3000/api/tags/${id}`, options);

      if (!response.ok) {
        console.error('Failed to submit', response);

        return;
      }

      NewTagNameErrorSignal.value = false;

      tags.value = tags.value.filter((tag) => tag.id !== id);

      nameInput.value = '';
    } catch (error: unknown) {
      console.error('Error submitting form', error);
    }
  }

  return (
    <div class="max-w-md mx-auto mt-10">
      <TagsForm nameInput={nameInput} handleSubmit={handleSubmit} />

      <table class="min-w-full bg-white shadow-md rounded border-collapse">
        <thead>
          <tr>
            <th class="py-2 px-4 border text-gray-600 font-bold uppercase text-sm text-left">Actions</th>
            <th class="py-2 px-4 border text-gray-600 font-bold uppercase text-sm text-left">Name</th>
          </tr>
        </thead>
        <tbody>
          {tags.value.map((tag) => (
            <tr key={tag.id}>
              <td class="py-2 px-4 border">{tag.name}</td>
              <td class="py-2 px-4 border">
                <button
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleDelete(tag.id)}
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

export default TagsPage;
