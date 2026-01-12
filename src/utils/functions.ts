import moment from "moment";

export const returnMonthAndYear = (myDate: string) => {
  const date = moment(myDate);
  return date.format("MMMM YYYY");
};

const greetList = [
  "Hello",
  "Bonjour",
  "Ciao",
  "Marhaba",
  "Hola",
  "Salām",
  "Nǐ hǎo",
];

export const getRandomGreeting = () => {
  const randomIndex = Math.floor(Math.random() * greetList.length);
  return greetList[randomIndex];
};

export function formatNumberWithPlus(number: number) {
  if (number === 0) {
    return "0";
  }
  const roundedNumber = Math.ceil(number);
  return roundedNumber >= 16 ? `${roundedNumber}+` : roundedNumber.toString();
}

export const returnTime = (newDate: string | null) => {
  if (!newDate) {
    return "";
  }
  const date = new Date(newDate);
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return time;
};
export const returnDateOnly = (newDate: string) => {
  const date = new Date(newDate);
  const time = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return time;
};

export const returnDateYear = (newDate: string) => {
  const date = new Date(newDate);
  const time = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return time;
};
export const returnYearOnly = (newDate: string) => {
  const date = new Date(newDate);
  const time = date.toLocaleDateString("en-US", {
    year: "numeric",
  });
  return time;
};

export const PASSWORDREGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
