// src/utils/getChartData.js
import data from "../data/historyenv.json";
import { tokens } from "../Theme";

const themeColors = tokens("dark");

export const getChartData = () => {
  return [
    {
      id: "Temperature",
      color: tokens("dark").redAccent[200],
      data: data.map(item => ({
        x: item.date,
        y: item.temp,
      })),
    },
    {
      id: "Humidity",
      color: tokens("dark").greenAccent[500],
      data: data.map(item => ({
        x: item.date,
        y: item.humi,
      })),
    },
    {
      id: "Air Quality",
      color: tokens("dark").blueAccent[500],
      data: data.map(item => ({
        x: item.date,
        y: item.air,
      })),
    },
  ];
};
