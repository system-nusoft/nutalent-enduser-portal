export const formatDisplayName = (
  firstName?: string | null,
  lastName?: string | null,
): string => {
  const first = (firstName || '').trim();
  if (!first) return (lastName || '').trim();

  const firstParts = first.split(/\s+/).filter(Boolean);
  return firstParts[0] || '';
};

export const formatFullNameString = (fullName?: string | null): string => {
  const trimmed = (fullName || '').trim();
  if (!trimmed) return '';

  const parts = trimmed.split(/\s+/).filter(Boolean);
  return parts[0] || '';
};