// MainComponent.jsx
import React, { useState, useEffect } from 'react';
import HardwareDetails from './HardwareDetails'; // Adjust the path as needed

function MainComponent() {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [hardwareIterations, setHardwareIterations] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/devices')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setHardwareIterations(data))
      .catch(error => console.error('Error fetching device names:', error));
  }, []); 

  const handleHardwareClick = (deviceName) => {
    setSelectedDevice(deviceName);
  };

  

  return (
    <div>
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
