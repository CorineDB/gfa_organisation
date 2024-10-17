export const colors = [
  { limit: 0.25, color: "rgb(239 68 68 )" },
  { limit: 0.5, color: "rgb(127 29 29)" },
  { limit: 0.75, color: "rgb(234 179 8 )" },
  { limit: 1, color: "rgb(22 163 74 )" },
];

export const optionResponses = [" Ne peux répondre", "Pas du tout", "Faiblement", "Moyennement", "Dans une grande mesure", "Totalement"];

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
