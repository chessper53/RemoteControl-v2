import React, { useState, useEffect } from 'react';

function HardwareDetails({ deviceName }) {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/monitored-data/${deviceName}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Entry not found');
        }
      })
      .then(data => setDetails(data))
      .catch(error => console.error('Error fetching monitored data:', error));
  }, [deviceName]);

  return (
    <div>
      <div className='extendedInfo'>
        <h3>Details for Device Name: {deviceName}</h3>
        {details ? (
          <div>
            <table>
              <tbody>
                {Object.entries(details.monitorData).map(([property, value]) => (
                  <tr key={property}>
                    <td>{property}</td>
                    <td>{value.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
              {details.image && (
                <div>
                  <h4>Image:</h4>
                  <img
                    src={`data:${details.image.mimetype};base64,${details.image.data}`}
                    alt="Monitored Screenshot"
                    style={{ maxWidth: '100%', maxHeight: '400px' }}
                  />
                </div>
              )}
          </div>
        ) : (
          <p>Please wait...</p>
        )}
      </div>
    </div>
  );
}

export default HardwareDetails;
