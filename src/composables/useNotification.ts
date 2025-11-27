import { useQuasar } from 'quasar';

export function useNotification() {
  const $q = useQuasar();

  const showSuccess = (message: string) => {
    return $q.notify({
      type: 'positive',
      message,
      icon: 'check_circle',
    });
  };

  const showError = (message: string, caption?: string) => {
    return $q.notify({
      type: 'negative',
      message: message,
      caption: caption,
      icon: 'error_outline',
    });
  };

  const showWarning = (message: string) => {
    return $q.notify({
      type: 'warning',
      message,
      icon: 'warning_amber',
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
  };
}
