export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

export function initial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "♥";
}
export const OPENED_KEY = "std-opened";
