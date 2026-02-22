export function toISODateString(date) {
  if (!(date instanceof Date)) return "";
  const tzOffset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 10);
}

export function getDefaultDateRange() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 7);
  return {
    startDate: toISODateString(startDate),
    endDate: toISODateString(endDate)
  };
}
