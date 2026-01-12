import moment from "moment";

export function formatToMonthYear(
  date: Date | null | undefined
): string | null {
  if (!date) {
    return null;
  }
  return moment(date).format("MMMM, YYYY");
}
