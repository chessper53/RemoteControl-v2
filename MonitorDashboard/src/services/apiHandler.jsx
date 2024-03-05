import { calculateElapsedTime } from "./parser";

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

export const postCommand = async (data, deviceName) => {
  try {
    const response = await fetch('http://localhost:3001/api/command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data, deviceName }),
    });
    if (!response.ok) {
      throw new Error('Failed to submit data');
    }
    console.log('Data submitted successfully');
  } catch (error) {
    console.error('Error submitting data:', error);
  }
};


export const sendAdditionalData = async (AdditionalData) => {
  try {
    const apiUrl = 'http://localhost:3001/api/AdditionalDataUpload';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ AdditionalData }),
    });
  } catch (error) {
    console.error('Error sending Base64 data:', error.message);
  }
};



  