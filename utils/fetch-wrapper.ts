export async function fetchWrapper<T>(
	url: string,
	options?: RequestInit,
): Promise<T> {
	const response = await fetch(url, options);

	const data = (await response.json()) as T;

	return data;
}
