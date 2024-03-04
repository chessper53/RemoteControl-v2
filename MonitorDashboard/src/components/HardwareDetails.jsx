import React, { useState ,useRef , useEffect } from 'react';
import { backendURL } from '../services/setupGuide';
import { fetchTableData, postCommand} from '../services/apiHandler';


function HardwareDetails({ deviceName }) {
  const [details, setDetails] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
      };
      reader.readAsDataURL(selectedFile);
    }
  };


  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchTableData(backendURL, deviceName, setElapsedTime, setDetails);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  function handleCommandInput(command){
    if (command === 'Wallpaper') {
      fileInputRef.current.click();
    }else{
      postCommand(command,deviceName)
    }
  }
  return (
    <div className='wrap'>
      <div className='extendedInfo'>
        <h2>Fetched Data for : {deviceName}</h2>
        <h3>This data was received {elapsedTime} seconds ago</h3>
        <h4>New dataset every 30 Seconds</h4>

        <table>
          <tbody>
          <th className='command' onClick={() => handleCommandInput("Lock")}>Lock Device</th>
          <th className='command' onClick={() => handleCommandInput("Shutdown")}>Initiate Shut down</th>
          <th className='command' onClick={() => handleCommandInput("Restart")}>Initiate Restart</th>
          </tbody>
          <tbody>
          <th className='command' onClick={() => handleCommandInput("-")}></th>
          <th className='command' onClick={() => handleCommandInput("Wallpaper")}>Change Wallpaper</th>
          <th className='command' onClick={() => handleCommandInput("Exit")}>Stop Client</th>
          </tbody>
        </table>
        {details ? (
          <div >
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
                    <a
                      href={`data:${details.image.mimetype};base64,${details.image.data}`}
                      download={details.image.name}
                    >
                    Download
                    </a>
                </div>
              )}              {details.wallpaper && (
                <div className='screenBox'>
                <h3>Current Wallpaper:</h3>
                    <img
                      src={`data:${details.wallpaper.mimetype};base64,${details.wallpaper.data}`}
                      alt="Monitored Screenshot"
                      style={{ maxWidth: '100%', maxHeight: '400px' }}
                    />
                    <a
                      href={`data:${details.wallpaper.mimetype};base64,${details.wallpaper.data}`}
                      download={details.wallpaper.name}
                    >
                    Download
                    </a>
                </div>
              )}
          </div>
        ) : (
          <p>Setting it up...</p>
        )}
      </div>
       {/* Hidden file input */}
      <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleFileChange}/>
    </div>
  );
}

export default HardwareDetails;
