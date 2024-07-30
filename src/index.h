const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ESP32 Sensor Dashboard</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .sensor-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #5a5a5a;
        }
        p {
            font-size: 18px;
        }
        .relay-container {
            margin-top: 20px;
        }
        .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
        }
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .slider {
            background-color: #007bff;
        }
        input:focus + .slider {
            box-shadow: 0 0 1px #007bff;
        }
        input:checked + .slider:before {
            transform: translateX(26px);
        }
        .switch-label {
            display: block;
            font-size: 18px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="sensor-container">
        <h2>Sensor Data</h2>
        <p>Temperature: <span id="temperature">--</span> °C</p>
        <p>Humidity: <span id="humidity">--</span> %</p>
        <p>Pressure: <span id="pressure">--</span> hPa</p>

        <div class="relay-container">
            <h2>Relay Control</h2>
            <div>
                <label class="switch-label" for="relay1">Relay 1</label>
                <label class="switch">
                    <input type="checkbox" id="relay1" onchange="toggleRelay(0, this.checked)">
                    <span class="slider"></span>
                </label>
            </div>
            <div>
                <label class="switch-label" for="relay2">Relay 2</label>
                <label class="switch">
                    <input type="checkbox" id="relay2" onchange="toggleRelay(1, this.checked)">
                    <span class="slider"></span>
                </label>
            </div>
            <div>
                <label class="switch-label" for="relay3">Relay 3</label>
                <label class="switch">
                    <input type="checkbox" id="relay3" onchange="toggleRelay(2, this.checked)">
                    <span class="slider"></span>
                </label>
            </div>
            <div>
                <label class="switch-label" for="relay4">Relay 4</label>
                <label class="switch">
                    <input type="checkbox" id="relay4" onchange="toggleRelay(3, this.checked)">
                    <span class="slider"></span>
                </label>
            </div>
        </div>
    </div>

    <script>
        function updateSensorData() {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "/ajax_data", true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        document.getElementById("temperature").textContent = data.temperature.toFixed(2);
                        document.getElementById("humidity").textContent = data.humidity.toFixed(2);
                        document.getElementById("pressure").textContent = data.pressure.toFixed(2);
                    } catch (error) {
                        console.error("Failed to parse JSON data:", error);
                    }
                }
            };
            xhr.send();
        }

        function toggleRelay(relayNumber, isChecked) {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", `/toggle?relay=${relayNumber}&state=${isChecked ? 1 : 0}`, true);
            xhr.send();
        }

        // Update sensor data every 3 seconds
        setInterval(updateSensorData, 3000);
    </script>
</body>
</html>
)rawliteral";
