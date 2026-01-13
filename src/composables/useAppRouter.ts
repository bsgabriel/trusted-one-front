import type { Page } from 'src/types/page';
import { useRouter } from 'vue-router';

export function useAppRouter() {
  const router = useRouter();

  /**
   * Navigates to a specific page.
   * @param page - The {@link Page} to navigate to.
   * @param params - Object containing dynamic route parameters (e.g., { id: 123 }).
   */
  const navigate = (page: Page, params?: Record<string, number>) => {
    if (!params) {
      void router.push(page.path);
      return;
    }

    let path = page.path;
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, String(value));
    });

    void router.push(path);
    return;
  };

  return {
    navigate,
    router,
  };
}
