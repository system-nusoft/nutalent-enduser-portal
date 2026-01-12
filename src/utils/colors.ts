export const colors = {
  backgroundOverlay: "rgba(0, 0, 0, 0.6)",
  primary: "#164CA3",
  primaryBlue: "#164CA3",
  white: "#fff",
  textColor: "#434343",
  selectedGrey: "#F6F6F6",
  border: "#d9d9d9",
  hoverBorderColor: "#4570b5",
  grey: "#00000040",
  geekBlue: "#f0f5ff",
  lightGreyBackground: "#fafafa",
  black: "#000000d9",
  lightText: "#00000073",
  inputGreyBackground: "#f5f5f5",
  shadow: "#00000005",
  darkBlack: "#1c1c1e",
  lightBlack: "#1c1c1eb8",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  borderColor: "#d9d9d9",
  scrollbarThumb: "#7b9fdc",
  scrollbarLight: "#acc0e7",
  scrollbarDark: "#8cafea",
  scrollbarTrack: "#cedaf4",
  imageBox: "#ff4d4f",
  busy: "#ff0000",
  vacation: "#808080",
  completed: "#008000",
  available: "#0000ff",
  hover: "#ADD8E6",
  hoverBorderColors: "#4570B5",
  red: "#FFF1F0",
  darkRed: "#FF0000",
  BorderGreen: "#8ddf4e",
  tooltip: "#164CA3",
  success: "#E8FAEB",
  avatarBg: "#FEF0D8",
};

export const colorsList = [
  "#E8F2E8",
  "#D9F2D9",
  "#C8F2C8",
  "#B3E0B3",
  "#A5E3A5",
  "#95D895",
  "#E8F2F5",
  "#F2F5E8",
  "#E8F2D1",
  "#D1F2E8",
  "#C2E8E8",
  "#B2E8D9",
  "#A1F2E0",
];

export const chartColorsList = [
  "#1570EF",
  "#2E90FA",
  "#53B1FD",
  "#84CAFF",
  "#EAECF0",
];

export const getRandomColor = (name: string) => {
  if (name) {
    const hash = name
      ?.split("")
      .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colorsList[hash % colorsList.length];
  }
  return colorsList[0];
};
