import { useQuasar } from 'quasar';

export function useDialog() {
  const $q = useQuasar();

  const showConfirm = (message: string, title: string = 'Confirmação', hint?: string) => {
    const formattedMessage = hint
      ? `${message}<br><br><small class="text-grey-7">${hint}</small>`
      : message;

    return $q.dialog({
      title,
      message: formattedMessage,
      cancel: {
        label: 'Cancelar',
        color: 'negative',
        flat: true,
      },
      ok: {
        label: 'Confirmar',
        color: 'primary',
      },
      html: !!hint,
    });
  };

  return {
    showConfirm,
  };
}
