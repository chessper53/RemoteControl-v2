// MainComponent.jsx
import React, { useState, useEffect } from 'react';
import HardwareDetails from './HardwareDetails';
import { backendURL } from './services/setupGuide';

function MainComponent() {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [hardwareIterations, setHardwareIterations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${backendURL}/api/devices`);
        const data = await response.json();
        setHardwareIterations(data);
      } catch (error) { console.error('Error fetching device names:', error);}
    };
    fetchData();
    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, []); 

  const handleHardwareClick = (deviceName) => {
    setSelectedDevice(deviceName);
  };

  return (
    <div className='wrap'>
      <h1>Initialized Devices:</h1>
      <div className='container'>
        {hardwareIterations.map((deviceName, index) => (
          <div key={index} className='HardwareIteration' onClick={() => handleHardwareClick(deviceName)}>
            <h3 className='HardwareID'>{deviceName}</h3>
            <img src="src/assets/iteration.png" alt="clipartHardware" className='clipartHardware'/>
          </div>
        ))}
      </div>
      
      {selectedDevice && <HardwareDetails deviceName={selectedDevice} />}
    </div>
  );
}

export default MainComponent;
