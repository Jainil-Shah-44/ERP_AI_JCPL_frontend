const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Not authenticated. Please login again.");
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let message = "Request failed";

    try {
      const error = await res.json();
      message = error.detail || error.message || JSON.stringify(error);
    } catch {
      message = res.statusText;
    }

    throw new Error(message);   // ✅ ALWAYS throw Error
  }

  // ✅ HANDLE 204 (No Content)
  if (res.status === 204) {
    return null;
  }

  return res.json();

  
}
