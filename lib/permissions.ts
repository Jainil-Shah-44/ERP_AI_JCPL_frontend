export function hasPermission(code: string) {

  if (typeof window === "undefined") return false;

  const perms = JSON.parse(
    localStorage.getItem("permissions") || "[]"
  );

  return perms.includes(code);
}

export function hasAnyPermission(...codes: string[]) {

  if (typeof window === "undefined") return false;

  const perms = JSON.parse(
    localStorage.getItem("permissions") || "[]"
  );

  return codes.some(c => perms.includes(c));
}