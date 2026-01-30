import moment from "moment";

export function formatToMonthYear(
  date: Date | null | undefined
): string | null {
  if (!date) {
    return null;
  }
  return moment(date).format("MMMM, YYYY");
}

export function formatYearsOfExperience(decimalYears: number): string {
  if (!decimalYears || decimalYears <= 0) {
    return "0 Years";
  }
  
  const years = Math.floor(decimalYears);
  const decimalPart = decimalYears - years;
  const months = Math.floor(decimalPart * 12);
  
  if (years === 0) {
    return `${months} Months`;
  } else if (months === 0) {
    return `${years} Years`;
  } else {
    return `${years} Years and ${months} Months`;
  }
}
