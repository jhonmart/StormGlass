export function buildURL(
  baseURL: string,
  params: { [key: string]: string | number },
) {
  const url = new URL(baseURL);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value.toString());
  });
  return url.toString();
}
