import { useQuasar } from 'quasar';

export function useDialog() {
  const $q = useQuasar();

  const showConfirm = (message: string, title: string = 'Confirmação') => {
    return $q.dialog({
      title,
      message,
      cancel: {
        label: 'Cancelar',
        color: 'negative',
        flat: true,
      },
      ok: {
        label: 'Confirmar',
        color: 'primary',
      },
      html: true,
    });
  };

  return {
    showConfirm,
  };
}
