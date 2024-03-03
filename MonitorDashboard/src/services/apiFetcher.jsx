import { calculateElapsedTime } from "./timeParser";

export const fetchDevices = async (backendURL, setHardwareIterations) => {
    try {
      const response = await fetch(`${backendURL}/api/devices`);
      if (!response.ok) {
        throw new Error('Entry not found');
      }
      const data = await response.json();
      setHardwareIterations(data);

    } catch (error) {
      console.error('Error fetching device names:', error);

    }
};

export const fetchTableData = async (backendURL, deviceName, setElapsedTime, setDetails) => {
    try {
      const response = await fetch(`${backendURL}/api/monitored-data/${deviceName}`);
      if (!response.ok) {
        throw new Error('Entry not found');
      }
      const data = await response.json();
      setElapsedTime(calculateElapsedTime(data.monitorData.timeOfMonitoring.toString()));
      setDetails(data);
    } catch (error) {
      console.error('Error fetching monitored data:', error);
    }
};
  