import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { tokens } from '../Theme';
import { Box, useTheme } from "@mui/material";
const label = { inputProps: { 'aria-label': 'Size switch demo' } };

const SwitchRelay = ({ size = "40" }) => {
  const [isOn, setIsOn] = React.useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleChange = (event) => {
    setIsOn(event.target.checked);
  };

  return (
    <Box sx={{
      background: `${colors.primary[200]} , transparent 56%),
            ${colors.greenAccent[800]}`,
      borderRadius: "50%",
      width: `${size}px`,
      height: `${size}px`
    }}>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
            {...label} defaultChecked size="large" 
            color="success"
              checked={isOn}
              onChange={handleChange}
              name="singleSwitch"
            />
          }
          label={
            <Typography>
              {isOn ? "ON" : "OFF"}
            </Typography>
          }
        />
      </FormGroup>
    </Box>
  );
}

export default SwitchRelay;
