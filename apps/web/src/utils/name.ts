export function getUsernameInitials(username: string) {
  const initials = username
    .split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return initials;
}
