export const currency = (n: number) =>
  new Intl.NumberFormat("az-AZ", {
    style: "currency",
    currency: "AZN",
    maximumFractionDigits: 2,
  }).format(n);

export const compactCurrency = (n: number) =>
  new Intl.NumberFormat("az-AZ", {
    style: "currency",
    currency: "AZN",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("az-AZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));

export const formatDayGroup = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const that = new Date(d);
  that.setHours(0, 0, 0, 0);
  const diff = Math.round(
    (today.getTime() - that.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diff === 0) return "Bu gün";
  if (diff === 1) return "Dünən";
  return new Intl.DateTimeFormat("az-AZ", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(d);
};
