// src/apps/shared/lib/auth/utils.js
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
