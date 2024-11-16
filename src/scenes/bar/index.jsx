import { Box } from "@mui/material";
import Header from "../../components/header";
import BarChart from "../../components/BarChart";
import { getChartData } from "../../components/getChartData";
const Bar = () => {
  const chartData = getChartData();

  return (
    <Box m="20px">
      <Header
        title="Bar Charts"
        subtitle="Temperature, Humidity, and Air Quality"
      />
      <Box display="flex" flexDirection="column" gap="20px">
        {chartData.map((chart, index) => (
          <Box key={index} height="30vh">
            <Header title={chart.id} subtitle={`${chart.id} over time`} />
            <BarChart data={[chart]} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Bar;
