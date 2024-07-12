import React, { useState, useEffect } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import Header from "../../components/header";
import StatBox from "../../components/StatBox";
import StatBoxWithGauge from "../../components/StatBoxWithGauge";
import LineChart from "../../components/LineChart";
import { tokens } from "../../Theme";
import CurtainsIcon from "@mui/icons-material/Curtains";
import MQTTHelper from "../../controllers/mqttAPI";
import ReviewsBar from "../../components/GaugeChart";

const DashBoard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [tempData, setTempData] = useState(0);
  const [humiData, setHumiData] = useState(0);
  const [airData, setAirData] = useState(0);

  useEffect(() => {
    const mqttHelper = new MQTTHelper();

    mqttHelper.setRecvCallBack((message) => {
      const data = JSON.parse(message);
      setTempData(data.temp);
      setHumiData(data.humi);
      setAirData(data.air);
    });

    return () => {
      mqttHelper.mqttClient.end();
    };
  }, []);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to our dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <CurtainsIcon sx={{ mr: "10px" }} />
            Current Temp/Humi/Air
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 - StatBoxes for Relays */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Relay 1"
            subtitle="Status"
            status="OFF"
            relay="relay1"
            icon={
              <CurtainsIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Relay 2"
            subtitle="Relay 2"
            status="OFF"
            relay="relay2"
            icon={
              <CurtainsIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Relay 3"
            subtitle="Relay 3"
            status="OFF"
            relay="relay3"
            icon={
              <CurtainsIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Relay 4"
            subtitle="Relay 4"
            status="OFF"
            relay="relay4"
            icon={
              <CurtainsIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 - LineChart */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Data sensor generate
              </Typography>
            </Box>
          </Box>
          <Box height="250px" ml="-20px">
            <LineChart isDashboard="true" />
          </Box>
        </Box>

        {/* ROW 3 - Campaign Statistics */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p="30px"
        >
          <Typography variant="h5" fontWeight="600" sx={{ mb: "15px" }}>
            Campaign
          </Typography>
          <Box style={{ width: "100%", height: "100%" }}>
            <ReviewsBar displayType="temp" />
          </Box>
          <Typography
            variant="h5"
            color={colors.greenAccent[500]}
            sx={{ mt: "15px" }}
          >
            $48,352 revenue generated
          </Typography>
          <Typography>Includes extra misc expenditures and costs</Typography>
        </Box>

        {/* ROW 4 - Temperature, Humidity, Air */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p="30px"
        >
          <StatBoxWithGauge
            title="Temperature"
            subtitle="Room Temp"
            score={tempData}
            displayType="temp"
          />
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p="30px"
        >
          <StatBoxWithGauge
            title="Humidity"
            subtitle="Room Humidity"
            score={humiData}
            displayType="humi"
          />
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p="30px"
        >
          <StatBoxWithGauge
            title="Air Quality"
            subtitle="Room Air Quality"
            score={airData}
            displayType="air"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DashBoard;
