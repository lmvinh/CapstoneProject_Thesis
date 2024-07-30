$(document).ready(function () {
    function fetchData() {
      $.ajax({
        url: "192.168.1.9", // Use the IP address of your ESP32 or Arduino
        type: "GET",
        dataType: "json",
        success: function (data) {
          // Update the HTML elements with the new data
          $('#temperatureOutput').html(data.temperatureValue + "&deg;C");
          $('#humidityOutput').html(data.humidityValue + "&percnt;");
          $('#pressureOutput').html(data.pressureValue + " hPa");
        },
        error: function (xhr, status, error) {
          console.error("Error fetching data: ", error);
        }
      });
    }
  
    // Fetch data every 5 seconds (5000 milliseconds)
    setInterval(fetchData, 5000);
  });
  function fetchData() {
  fetch("/data.js")
    .then((response) => response.text())
    .then((data) => {
      // Execute the received JavaScript code
      eval(data);

      // Update the HTML elements with the new data
      document.getElementById("temperatureOutput").innerHTML = temperatureValue.toFixed(2) + "&deg;C";
      document.getElementById("humidityOutput").innerHTML = humidityValue.toFixed(2) + "&percnt;";
      document.getElementById("pressureOutput").innerHTML = pressureValue.toFixed(2) + " hPa";
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    });
}

// Fetch data every 3 seconds
setInterval(fetchData, 3000);

// Fetch data immediately on page load
fetchData();