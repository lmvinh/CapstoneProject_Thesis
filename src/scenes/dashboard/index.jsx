import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Header from "../../components/header";
import SwitchRelay from "../../components/SwitchRelay";
import StatBox from "../../components/StatBox";
import LineChart from "../../components/LineChart";
import { tokens } from "../../Theme";
import CurtainsIcon from "@mui/icons-material/Curtains";
import TungstenIcon from "@mui/icons-material/Tungsten";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import CloudIcon from "@mui/icons-material/Cloud";
import ReviewsBar from "../../components/GaugeChart";
import client from "../../controllers/mqttAPI";
const DashBoard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
            Current Temp/Humi
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
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Relay 1"
            subtitle="Relay 1"
            progress="0.75"
            increase="+14%"
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
            progress="0.50"
            increase="+21%"
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
            progress="0.30"
            increase="+5%"
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
            progress="0.80"
            increase="+43%"
            icon={
              <CurtainsIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        {/* ROW 2 */}
        <Box
          gridColumn=" span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            dislay="flex"
            justifyContent="space-center"
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
            <LineChart isDashboard="true"></LineChart>
          </Box>
        </Box>
        {/* ROW 3 */}

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
            style={{ width: 250, height: 200 }}
          >
            <ReviewsBar />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Current Temperature
          </Typography>
          <Box height="200px" style={{ width: 250, height: 200 }}>
            <ReviewsBar isDashboard={true} score={33} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Current Humidity
          </Typography>
          <Box height="200px" style={{ width: 250, height: 200 }}>
            <ReviewsBar isDashboard={true} score={20} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default DashBoard;
