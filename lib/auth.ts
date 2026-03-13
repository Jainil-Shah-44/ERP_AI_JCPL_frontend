export async function refreshAccessToken() {
  const res = await fetch("http://103.196.187.61:8000/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.access_token;
}
