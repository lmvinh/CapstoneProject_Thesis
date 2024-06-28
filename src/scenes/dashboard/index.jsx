import { Box,Button,IconButton,Typography,useTheme } from "@mui/material";
import Header from "../../components/header";
import SwitchRelay from "../../components/SwitchRelay";
import StatBox from "../../components/StatBox";
import LineChart from "../../components/LineChart";
import { tokens } from "../../Theme";
import CurtainsIcon from '@mui/icons-material/Curtains';
import TungstenIcon from '@mui/icons-material/Tungsten';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CloudIcon from '@mui/icons-material/Cloud';
const DashBoard = () => {
    const theme = useTheme();
    const colors =tokens(theme.palette.mode);

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
                subtitle="Relay 2"
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
                subtitle="Sales Obtained"
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
                subtitle="New Clients"
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
                subtitle="Traffic Received"
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
            gridRow = "span 2"
            backgroundColor = {colors.primary[400]}
            >
            <Box
            mt = "25px"
            p = "0 30px"
            dislay = "flex"
            justifyContent= "space-center"
            alignItems="center"
            >
                <Box
                >
                    <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>Data sensor generate</Typography>
                </Box>
               
            </Box>
                <Box height="250px" ml ="-20px"> 
                    <LineChart isDashboard = "true"></LineChart>
                </Box>
            </Box>
            </Box>
            </Box>
            )
}
export default DashBoard;
