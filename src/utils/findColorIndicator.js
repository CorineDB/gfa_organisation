export const colors = [
  { limit: 0.25, color: "rgb(240 80 80)" },
  { limit: 0.5, color: "#FFC000" },
  { limit: 0.75, color: "#FFFF00" },
  { limit: 1, color: "#00B050" },
];

export const colorsExcel = [
  { limit: 0.25, color: "EF4444" },
  { limit: 0.5, color: "BA3030" },
  { limit: 0.75, color: "EAB308" },
  { limit: 1, color: "16A34A" },
];

export const optionResponses = [" Ne peux répondre", "Pas du tout", "Faiblement", "Moyennement"];

export const colorsOptionFactuel = [
  { value: 0, color: "rgb(239 68 68 )" },
  { value: 1, color: "rgb(22 163 74 )" },
];

export function getColorForValue(value) {
  for (const interval of colors) {
    if (value <= interval.limit) {
      return interval.color;
    }
  }

  return "";
}
export function getColorForExcel(value) {
  for (const interval of colorsExcel) {
    if (value <= interval.limit) {
      return interval.color;
    }
  }

  return "FFFFFFFF";
}
