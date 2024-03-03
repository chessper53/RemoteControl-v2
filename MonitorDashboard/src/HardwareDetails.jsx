import React, { useState, useEffect } from 'react';
import { backendURL } from './services/setupGuide';
import { fetchTableData} from './services/deviceDetailsFetcher';


function HardwareDetails({ deviceName }) {
  const [details, setDetails] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchTableData(backendURL, deviceName, setElapsedTime, setDetails);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className='wrap'>
      <div className='extendedInfo'>
        <h2>Fetched Data for : {deviceName}</h2>
        <h3>This data was received {elapsedTime} seconds ago</h3>
        <h4>New dataset every 60 Seconds</h4>
        
        {details ? (
          <div>
            <table>
              <tbody>
                <tr>
                  <th></th>
                  <th></th>
                </tr>
                {Object.entries(details.monitorData).map(([property, value]) => (
                  <tr key={property}>
                    <td>{property}</td>
                    <td>{value.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
              {details.image && (
                <div className='screenBox'>
                  <h3>Current Screen:</h3>
                  <img
                    src={`data:${details.image.mimetype};base64,${details.image.data}`}
                    alt="Monitored Screenshot"
                    style={{ maxWidth: '100%', maxHeight: '400px' }}
                  />
                </div>
              )}
              {details.image && (
                <div className='screenBox'>
                  <h3>Current Webcam:</h3>
                  <img
                    src={`data:${details.image.mimetype};base64,${details.image.data}`}
                    alt="Monitored Screenshot"
                    style={{ maxWidth: '100%', maxHeight: '400px' }}
                  />
                </div>
              )}
          </div>
        ) : (
          <p>Setting it up...</p>
        )}
      </div>
    </div>
  );
}

export default HardwareDetails;
