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
import MQTTHelper from "../controllers/mqttAPI";
import relayStatus from "../controllers/relayStatus.json"; // Import JSON file
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { dbRelay } from "../controllers/dbRelay"; // Import Firestore database instance

const label = { inputProps: { "aria-label": "Size switch demo" } };

const SwitchRelay = ({ size = "40", relay }) => {
  const [isOn, setIsOn] = React.useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  React.useEffect(() => {
    fetchInitialStatus();

    const mqttHelper = new MQTTHelper();
    mqttHelper.setRecvCallBack(handleMqttMessage);

    mqttHelper.mqttClient.subscribe(
      "/innovation/airmonitoring/WSNs/ABC/relay",
      (err) => {
        if (!err) {
          console.log("Subscribed to MQTT topic for relay status updates.");
        } else {
          console.error("Failed to subscribe to MQTT topic:", err);
        }
      }
    );

    return () => {
      mqttHelper.mqttClient.unsubscribe(
        "/innovation/airmonitoring/WSNs/ABC/relay"
      );
    };
  }, []);

  const fetchInitialStatus = () => {
    fetch("http://localhost:8000/relay-status")
      .then((response) => response.json())
      .then((data) => {
        setIsOn(data[relay] || false);
      })
      .catch((error) => {
        console.error("Error fetching initial relay status:", error);
      });
  };

  const handleChange = (event) => {
    const newStatus = event.target.checked;
    setIsOn(newStatus);

    // Update local and Firebase relay statuses
    relayStatus[relay] = newStatus;
    updateRelayStatus(relayStatus);

    // Publish relay status via MQTT
    publishRelayStatus(newStatus);
  };

  const updateRelayStatus = async (updatedStatus) => {
    try {
      // Update Firestore with the entire relayStatus object
      const relayDocRef = doc(dbRelay, "relay", "relay");
      await setDoc(relayDocRef, updatedStatus);
      console.log("Relay status updated in Firestore:", updatedStatus);
    } catch (error) {
      console.error("Error updating relay status in Firestore:", error);
    }
  };

  const publishRelayStatus = async (newStatus) => {
    try {
      relayStatus[relay] = newStatus;

      const mqttHelper = new MQTTHelper();
      await mqttHelper.publish(
        "/innovation/airmonitoring/WSNs/ABC/relay",
        JSON.stringify(relayStatus)
      );
      console.log("Relay status JSON published via MQTT:", relayStatus);
    } catch (error) {
      console.error("Error publishing relay status JSON via MQTT:", error);
    }
  };

  const handleMqttMessage = (message) => {
    try {
      const data = JSON.parse(message);
      if (data[relay] !== undefined) {
        setIsOn(data[relay]);
        relayStatus[relay] = data[relay];

        // Update Firestore when receiving MQTT message
        updateRelayStatus(relayStatus);
      }
    } catch (error) {
      console.error("Error handling MQTT message:", error);
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
