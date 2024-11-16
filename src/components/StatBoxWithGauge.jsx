import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../Theme";
import ReviewsBar from "./GaugeChart";

const StatBoxWithGauge = ({ title, subtitle, score, displayType }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  let displayContent;

  switch (displayType) {
    case "temp":
      displayContent = <ReviewsBar score={score} displayType="temp" />;
      break;
    case "humi":
      displayContent = <ReviewsBar score={score} displayType="humi" />;
      break;
    case "air":
      displayContent = <ReviewsBar score={score} displayType="air" />;
      break;
    default:
      displayContent = null;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      width="100%"
      height="100%"
      bgcolor={colors.primary[400]}
      p={3}
      borderRadius={8}
    >
      <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
        {title}
      </Typography>
      <Box
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        mt={2}
      >
        {displayContent}
      </Box>
      <Typography variant="h6" color={colors.greenAccent[500]} mt={2}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default StatBoxWithGauge;
