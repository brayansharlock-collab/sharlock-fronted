// service/infiniteFetcher.ts
import api from "../service/api";

interface InfiniteFetcherOptions {
  url: string;
  body?: any;
  normalize?: (data: any) => any[];
  pageParam?: string;
  pageSizeParam?: string;
  pageSize?: number;
  method?: "GET" | "POST";
}

export async function infiniteFetcher<T>(
  page: number,
  options: InfiniteFetcherOptions
): Promise<{ data: T[]; nextPage: number | null }> {
  const {
    url,
    body = {},
    normalize = (data: any) => data?.results || [],
    pageParam = "page",
    pageSizeParam = "pageSize",
    pageSize = 10, // valor por defecto
    method = "POST",
  } = options;

  const paramsOrBody = {
    ...body,
    [pageParam]: page,
    [pageSizeParam]: pageSize,
  };

  let res;
  if (method === "GET") {
    res = await api.get(url, { params: paramsOrBody });
  } else {
    res = await api.post(url, paramsOrBody);
  }

  const results = normalize(res.data);

  // Determinar si hay más páginas basados en el pageSize
  const hasNext = results.length === pageSize;

  return {
    data: results,
    nextPage: hasNext ? page + 1 : null,
  };
}

