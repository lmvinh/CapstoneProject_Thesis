import React, { useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme, Button, ButtonGroup } from "@mui/material";
import { tokens } from "../Theme";
import { getChartData } from "./getChartData";

const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [timeRange, setTimeRange] = useState("day"); // Default to 'day'

  const data = getChartData(); // Get the raw data

  // Filter data based on selected time range
  const filterData = (data, range) => {
    const now = new Date();
    let filteredData;

    switch (range) {
      case "6hours":
        filteredData = data.map((series) => ({
          ...series,
          data: series.data.filter(
            (d) => new Date(d.x) >= new Date(now - 6 * 60 * 60 * 1000)
          ),
        }));
        break;
      case "day":
        filteredData = data.map((series) => ({
          ...series,
          data: series.data.filter(
            (d) => new Date(d.x) >= new Date(now - 24 * 60 * 60 * 1000)
          ),
        }));
        break;
      case "week":
        filteredData = data.map((series) => ({
          ...series,
          data: series.data.filter(
            (d) => new Date(d.x) >= new Date(now - 7 * 24 * 60 * 60 * 1000)
          ),
        }));
        break;
      default:
        filteredData = data;
    }
    return filteredData;
  };

  const filteredData = filterData(data, timeRange);

  console.log("Filtered Data:", filteredData); // Debugging: log filtered data

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1000, // Ensure buttons are above chart
        }}
      >
        <Button onClick={() => setTimeRange("6hours")}>Last 6 Hours</Button>
        <Button onClick={() => setTimeRange("day")}>Last Day</Button>
        <Button onClick={() => setTimeRange("week")}>Last Week</Button>
      </ButtonGroup>
      <ResponsiveLine
        data={filteredData}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: colors.grey[100],
              },
            },
            legend: {
              text: {
                fill: colors.grey[100],
              },
            },
            ticks: {
              line: {
                stroke: colors.grey[100],
                strokeWidth: 1,
              },
              text: {
                fill: colors.grey[100],
              },
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
            },
          },
          tooltip: {
            container: {
              color: colors.primary[500],
            },
          },
        }}
        colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }}
        margin={{ top: 50, right: 110, bottom: 80, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 0,
          max: 100,
          stacked: false,
          reverse: false,
        }}
        yFormat=" >-.2f"
        curve="catmullRom"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 90,
          legend: isDashboard ? undefined : "Date",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickValues: 5,
          tickSize: 3,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : "Value",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        enableGridX={false}
        enableGridY={false}
        pointSize={8}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default LineChart;
