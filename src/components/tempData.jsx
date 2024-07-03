import React, { useEffect, useState } from "react";

const TempData = () => {
  const [tempData, setTempData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/getTemp");
      const data = await response.json();
      setTempData(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Temperature Data</h1>
      <ul>
        {tempData.map((temp) => (
          <li key={temp._id}>
            {temp.date}: {temp.value}°C
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TempData;
