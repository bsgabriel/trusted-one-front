import type { ApiError } from 'src/types/erros';
import { useQuasar } from 'quasar';

export function useApiError() {
  const $q = useQuasar();

  const notifyError = (error: unknown, defaultMessage?: string) => {
    const problem = (error as ApiError).problem;

    if (problem.status === 401) {
      return;
    }

    $q.notify({
      type: 'negative',
      message: problem.title || defaultMessage || 'Ocorreu um erro',
      caption: problem.detail,
      position: 'top-right',
      timeout: 5000,
      actions: [{ icon: 'close', color: 'white' }],
    });

    if (problem.errors && problem.errors.length > 0) {
      problem.errors.forEach((err) => {
        $q.notify({
          type: 'warning',
          message: err,
          position: 'top-right',
          timeout: 3000,
        });
      });
    }
    console.error('API Error:', problem);
  };

  return { notifyError };
}
