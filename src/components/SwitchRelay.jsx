import * as React from "react";
import {
  Box,
  FormGroup,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../Theme";
import MQTTHelper from "../controllers/mqttAPI"; // Adjust path as necessary

const label = { inputProps: { "aria-label": "Size switch demo" } };

const SwitchRelay = ({ size = "40", relay }) => {
  const [isOn, setIsOn] = React.useState(false); // Initially off
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  React.useEffect(() => {
    fetchInitialStatus();
  }, []);

  const fetchInitialStatus = () => {
    fetch("http://localhost:8000/relay-status")
      .then((response) => response.json())
      .then((data) => {
        setIsOn(data[relay] || false); // Assuming data structure is { relay1: true, relay2: false, ... }
      })
      .catch((error) => {
        console.error("Error fetching initial relay status:", error);
      });
  };

  const handleChange = (event) => {
    const newStatus = event.target.checked;
    setIsOn(newStatus);

    // Update relay status via API
    updateRelayStatus({ relay, status: newStatus });

    // Publish relay status via MQTT
    publishRelayStatus();
  };

  const updateRelayStatus = ({ relay, status }) => {
    fetch("http://localhost:8000/relay-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ relay, status }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(`Relay ${relay} status updated to ${status}`);
      })
      .catch((error) => {
        console.error("Error updating relay status:", error);
      });
  };

  const publishRelayStatus = async () => {
    try {
      const relayStatus = require("../controllers/relayStatus.json");
      // Initialize the MQTT helper
      const mqttHelper = new MQTTHelper();

      // Set the receive callback
      await mqttHelper.publish(
        "/innovation/airmonitoring/WSNs/ABC/relay",
        JSON.stringify(relayStatus)
      );
      console.log(relayStatus);
      console.log("Relay status JSON published via MQTT:", relayStatus);
    } catch (error) {
      console.error("Error publishing relay status JSON via MQTT:", error);
    }
  };

  return (
    <Box
      sx={{
        background: `${colors.primary[200]}, transparent 56%), ${colors.greenAccent[800]}`,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              {...label}
              defaultChecked={isOn}
              size="large"
              color="success"
              checked={isOn}
              onChange={handleChange}
              name="singleSwitch"
            />
          }
          label={<Typography>{isOn ? "ON" : "OFF"}</Typography>}
        />
      </FormGroup>
    </Box>
  );
};

export default SwitchRelay;
