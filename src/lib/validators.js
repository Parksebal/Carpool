export function isEduEmail(email) {
  return /^[^\s@]+@[^\s@]+\.edu$/i.test(email.trim());
}