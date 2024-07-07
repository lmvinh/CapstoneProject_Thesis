import * as React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../Theme";
import SwitchRelay from "./SwitchRelay";

const StatBox = ({ title, subtitle, icon, status, relay }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {title}
          </Typography>
        </Box>
        <Box>
          <SwitchRelay relay={relay} /> {/* Pass relay ID to SwitchRelay */}
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h5" sx={{ color: colors.greenAccent[200] }}>
          {subtitle}
        </Typography>
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[300] }}
        >
          {status}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
