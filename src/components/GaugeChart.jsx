import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ReviewsProvider from "./ReviewsProvider";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { tokens } from "../Theme";
import mqtt from "mqtt";
import axios from "axios"; // Import axios for HTTP requests
import debounce from "lodash.debounce";

const MAIN_TOPIC = "/innovation/airmonitoring/WSNs/ABC/env";

const ReviewsBar = ({ displayType }) => {
  const [tempData, setTempData] = useState(0);
  const [humiData, setHumiData] = useState(0);
  const [airData, setAirData] = useState(0);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const mqttClient = mqtt.connect("mqtt://mqttserver.tk", {
      port: 9001,
      username: "innovation",
      password: "Innovation_RgPQAZoA5N",
    });

    const handleMessage = debounce((topic, message) => {
      console.log("Received:", message.toString());
      const data = JSON.parse(message.toString());
      setTempData(data.temp);
      setHumiData(data.humi);
      setAirData(data.air);

      axios
        .post("http://localhost:8000/enviV", {
          temp: data.temp,
          humi: data.humi,
          air: data.air,
        })
        .then((response) => {
          console.log("Data saved successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error saving data:", error);
        });
    }, 1000); // Adjust debounce interval as needed

    mqttClient.on("connect", () => {
      console.log("Connected successfully!!");
      mqttClient.subscribe(MAIN_TOPIC, (err) => {
        if (!err) {
          console.log("Subscribed to Topic!!!");
        } else {
          console.log("Subscription error:", err);
        }
      });
    });

    mqttClient.on("message", handleMessage);

    return () => {
      mqttClient.end();
      handleMessage.cancel();
    };
  }, []);

  const calcColor = (percent, start, end) => {
    let a = percent / 100,
      b = (end - start) * a,
      c = b + start;

    return "hsl(" + c + ", 100%, 50%)";
  };

  const responsiveStyle = {
    width: { xs: "20px", sm: "75px", md: "100px", lg: "100px", xl: "150px" },
    height: { xs: "20px", sm: "75px", md: "100px", lg: "100px", xl: "150px" },
  };

  let displayValue = tempData;

  if (displayType === "humi") {
    displayValue = humiData;
  } else if (displayType === "air") {
    displayValue = airData;
  }

  return (
    <Box
      sx={{
        background: `${colors.primary[200]}, transparent 56%), ${colors.greenAccent[800]}`,
        borderRadius: "50%",
        ...responsiveStyle,
      }}
    >
      <ReviewsProvider valueStart={0} valueEnd={displayValue}>
        {(value) => (
          <CircularProgressbar
            value={value}
            text={`${displayValue} ${displayType === "temp" ? "°C" : ""}${
              displayType === "humi" ? "%" : ""
            }${displayType === "air" ? "" : ""}`}
            circleRatio={0.7}
            styles={{
              trail: {
                strokeLinecap: "butt",
                transform: "rotate(-126deg)",
                transformOrigin: "center center",
              },
              path: {
                strokeLinecap: "butt",
                transform: "rotate(-126deg)",
                transformOrigin: "center center",
                stroke: calcColor(value, 0, 120),
              },
              text: {
                fill: "#ddd",
              },
            }}
            strokeWidth={10}
          />
        )}
      </ReviewsProvider>
    </Box>
  );
};

export default ReviewsBar;
