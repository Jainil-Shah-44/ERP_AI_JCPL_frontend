const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

// export async function apiFetch(url: string, options: RequestInit = {}) {
//   const token = localStorage.getItem("access_token");

//   if (!token) {
//     throw new Error("Not authenticated. Please login again.");
//   }

//   const res = await fetch(`${BASE_URL}${url}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//       ...(options.headers || {}),
//     },
//   });

//   if (!res.ok) {
//     let message = "Request failed";

//     try {
//       const error = await res.json();
//       message = error.detail || error.message || JSON.stringify(error);
//     } catch {
//       message = res.statusText;
//     }

//     throw new Error(message);   
//   }

  
//   if (res.status === 204) {
//     return null;
//   }

//   return res.json();

  
// }
export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Not authenticated. Please login again.");
  }

  const isFormData = options.body instanceof FormData;

  // ✅ Use Record instead of HeadersInit
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  // merge custom headers if any
  if (options.headers) {
    Object.assign(headers, options.headers as Record<string, string>);
  }

  // ✅ Only set JSON header when NOT FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
  let errorMessage = "Request failed";

  try {
    const errorData = await response.json();

    if (Array.isArray(errorData.detail)) {
      errorMessage = errorData.detail
        .map((err: any) => {
          const field = err.loc?.join(" → ");
          return `${field}: ${err.msg}`;
        })
        .join("\n");
    } else {
      errorMessage =
        errorData.detail ||
        errorData.message ||
        JSON.stringify(errorData);
    }
  } catch {
    errorMessage = response.statusText;
  }

  throw new Error(errorMessage);
}
  // handle 204
  if (response.status === 204) {
    return null;
  }

  return response.json();
}



