export default async function fetchJson<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const endpoint = `${input.toString()}`;

  const headers: { 'Content-Type'?: string } = {
    'Content-Type': 'application/json',
  };

  if (init?.body instanceof FormData) {
    delete headers['Content-Type']; // Fetch will automatically add correct header for FormData
  }

  const response = await fetch(endpoint, {
    ...init,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    console.error(data.error);
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
}
