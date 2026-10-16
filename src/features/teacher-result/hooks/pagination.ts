import type { PageResponse } from "@/shared/types/api.type";

export type InfinitePage<T> = PageResponse<T> & {
  requestedPage?: number;
};

export const toInfinitePage = <T>(
  response: PageResponse<T>,
  requestedPage: number,
): InfinitePage<T> => ({
  ...response,
  requestedPage,
});

export const getNextRequestedPage = <T>(
  lastPage: InfinitePage<T>,
  allPages: InfinitePage<T>[],
): number | undefined => {
  if (lastPage.totalPages <= 0) {
    return undefined;
  }

  if (lastPage.content.length === 0) {
    return undefined;
  }

  const loadedItems = allPages.reduce(
    (sum, page) => sum + page.content.length,
    0,
  );

  if (loadedItems >= lastPage.totalElements) {
    return undefined;
  }

  const lastRequestedPage =
    typeof lastPage.requestedPage === "number"
      ? lastPage.requestedPage
      : Math.max(allPages.length - 1, 0);

  const nextRequestedPage = lastRequestedPage + 1;

  if (nextRequestedPage >= lastPage.totalPages) {
    return undefined;
  }

  return nextRequestedPage;
};
