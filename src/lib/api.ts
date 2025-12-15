// Helper to define the structure of the API call options
interface ApiOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  isFormData?: boolean;
}

// Function to handle all API fetches
export async function apiFetch(endpoint: string, options: ApiOptions = {}): Promise<any> {
  // Use the environment variable for your API base URL (e.g., http://localhost:8000/api/v1)
  const baseUrl = import.meta.env.VITE_API_URL as string;
  const url = `${baseUrl}${endpoint}`;

  // Get the token from local storage for Authorization header
  const token = localStorage.getItem('sc_token');

  const headers = new Headers(options.headers);

  // Only set Content-Type for non-FormData requests
  if (!options.isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    // Attach the JWT for authenticated requests
    headers.set('Authorization', `Bearer ${token}`);
  }

  let body: any;
  if (options.isFormData) {
    // For FormData, don't stringify and don't set Content-Type (browser will set it with boundary)
    body = options.body;
  } else {
    // Convert the JavaScript body object to a JSON string if it exists
    body = options.body ? JSON.stringify(options.body) : options.body;
  }

  const finalOptions: RequestInit = {
    ...options,
    headers,
    body,
    credentials: 'include', // Important: send cookies with requests
  };

  const response = await fetch(url, finalOptions);

  // Try to parse the response body as JSON
  let data;
  try {
    data = await response.json();
  } catch (error) {
    // If response is not JSON (e.g., 204 No Content), data will be undefined
    data = null;
  }

  if (!response.ok) {
    // Throw an error with the response data (which often contains the error message)
    const error = new Error(data?.message || `API call failed with status ${response.status}`);
    (error as any).data = data; // Attach the response body to the error object
    throw error;
  }

  return data;
}