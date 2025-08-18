import axios from "axios";

// .env
const baseURL = import.meta.env.VITE_API_URL!;
const token = import.meta.env.VITE_API_TOKEN!;

const apiClient = axios.create({
  baseURL,
  /*headers: {
    token, // Swagger token
    "Content-Type": "application/json",
  },*/
});

// common error handler
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err);
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    }
    return Promise.reject(err);
  }
);

// common GET
export async function get<TResponse>(url: string): Promise<TResponse> {
  const response = await apiClient.get<TResponse>(url);
  console.log(response.data);
  return response.data;
}

// common POST
export async function post<TRequest, TResponse>(
  url: string,
  data: TRequest
): Promise<TResponse> {
  const response = await apiClient.post<TResponse>(url, data);
  console.log(url, response.data);
  return response.data;
}

// common API response handler
export function handleApiResponse<T>(response: { content: T }): T {
  return response.content;
}
