import { useSignal } from '@preact/signals';
import { FunctionComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';
import { Budget, BudgetResponse, BudgetsListResponse } from '../types/budgets';
import BudgetsForm from '../components/forms/budgets-form';
import { TargetedEvent } from 'preact/compat';

const BudgetsPage: FunctionComponent = (): h.JSX.Element => {
  const nameInput = useSignal<string>('');
  const budgets = useSignal<Budget[]>([]);

  useEffect(() => {
    async function fetchBudgets() {
      const response = await fetch('http://localhost:3000/api/budgets');
      const budgetsResponse = (await response.json()) as BudgetsListResponse;

      budgets.value = budgetsResponse.data;
    }

    fetchBudgets();
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

      const response = await fetch('http://localhost:3000/api/budgets', payload);

      if (!response.ok) {
        // TODO: add error state
        return;
      }

      const result = (await response.json()) as BudgetResponse;

      budgets.value = [...budgets.value, result.data];

      nameInput.value = '';
    } catch (error: unknown) {
      console.error('Error creating new budget', error);
    }
  }

  async function handleDelete(id: number): Promise<void> {
    try {
      const options = {
        method: 'DELETE',
      };

      const response = await fetch(`http://localhost:3000/api/budgets/${id}`, options);

      if (!response.ok) {
        // TODO: add error state
        return;
      }

      budgets.value = budgets.value.filter((budget) => budget.id !== id);

      nameInput.value = '';
    } catch (error: unknown) {
      console.error('Error deleting budget', error);
    }
  }

  return (
    <div class="max-w-md mx-auto mt-10">
      <BudgetsForm nameInput={nameInput} handleSubmit={handleSubmit} />

      <table class="min-w-full bg-white shadow-md rounded border-collapse">
        <thead>
          <tr>
            <th class="py-2 px-4 border text-gray-600 font-bold uppercase text-sm text-left">Actions</th>
            <th class="py-2 px-4 border text-gray-600 font-bold uppercase text-sm text-left">Name</th>
          </tr>
        </thead>
        <tbody>
          {budgets.value.map((budget) => (
            <tr key={budget.id}>
              <td class="py-2 px-4 border">
                <button
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleDelete(budget.id)}
                >
                  Delete
                </button>
              </td>
              <td class="py-2 px-4 border">{budget.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetsPage;
