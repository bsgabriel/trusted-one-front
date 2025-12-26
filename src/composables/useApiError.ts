import type { ApiError } from 'src/types/erros';
import { useNotification } from './useNotification';

export function useApiError() {
  const { showError, showWarning } = useNotification();

  const notifyError = (error: unknown, defaultMessage?: string) => {
    console.log('Error received in useApiError:', error);
    const problem = (error as ApiError).problem;

    if (problem.status === 401) {
      return;
    }

    showError(problem.title || defaultMessage || 'Ocorreu um erro', problem.detail);

    if (problem.errors && problem.errors.length > 0) {
      problem.errors.forEach((err) => showWarning(err));
    }
    console.error('API Error:', problem);
  };

  return { notifyError };
}
