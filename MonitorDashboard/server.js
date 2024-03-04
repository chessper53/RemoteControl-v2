import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';

const app = express();
const port = 3001;
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(fileUpload());
let monitoredDataArray = [];
let outgoingCommandsArray = [];

// Endpoint to receive data and image from C# app
app.post('/api/monitored-data', (req, res) => {
    const monitorData = req.body.monitorData ? JSON.parse(req.body.monitorData) : null;
    const image = req.files ? req.files.Screenshot : null;
    const wallpaper = req.files ? req.files.Wallpaper : null;
    const existingEntryIndex = monitoredDataArray.findIndex(item => item.monitorData.deviceName === monitorData.deviceName);
    
    if (existingEntryIndex !== -1) {
        console.log("did exist");
        monitoredDataArray[existingEntryIndex] = { monitorData, image, wallpaper};
    } else {
        console.log("did not exist");
        monitoredDataArray.push({ monitorData, image, wallpaper});
    }
    console.log(monitoredDataArray);  

    res.status(200).send('Data received successfully');
});

// Endpoint to receive command and and device name
app.post('/api/command', (req, res) => {
  const { data, deviceName } = req.body;
  if (!outgoingCommandsArray[deviceName]) {
    outgoingCommandsArray[deviceName] = [];
  }
  outgoingCommandsArray[deviceName] = [{ data }];
});

// Endpoint to retrieve monitored data based on device name
app.get('/api/monitored-data/:deviceName', (req, res) => {
  const deviceName = req.params.deviceName;
  const entry = monitoredDataArray.find(item => item.monitorData.deviceName === deviceName);
  if (entry) {
    const base64Image = entry.image.data.toString('base64');
    const base64Image2 = entry.wallpaper.data.toString('base64');
    const imageData = {
      ...entry.image,
      data: base64Image,
    };
    const wallpaperData = {
      ...entry.wallpaper,
      data: base64Image2,
    };
    res.status(200).json({ ...entry, image: imageData , wallpaper :wallpaperData});
  } else {
    res.status(404).send('Entry not found');
  }
});

// Endpoint to get all deviceNames
app.get('/api/devices', (_, res) => {
  const deviceNames = monitoredDataArray.map(item => item.monitorData.deviceName);

  if (deviceNames.length > 0) {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200).json(deviceNames);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(404).json({ error: 'No Devices are connected' });
  }
}); 

// Endpoint to get command data for a specific device
app.get('/api/command/:deviceName', (req, res) => {
  const { deviceName } = req.params;
  if (outgoingCommandsArray[deviceName]) {
    const commandData = outgoingCommandsArray[deviceName];
    commandData.data
    //Clear Array//////////////////////////////////////////////////////////////////////////////
    console.log(`Sending command data for device ${deviceName}:`, commandData);
    res.status(200).json(commandData);
  } else {
    console.log(`No data found for device ${deviceName}`);
    res.status(404).json({ error: 'No data found for the specified device' });
  }
});


app.listen(port, () => {
  console.log(`Server is up on ${port}`);
});