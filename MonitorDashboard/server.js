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


// Endpoint to receive data and image from C# app
app.post('/api/monitored-data', (req, res) => {
    const monitorData = req.body.monitorData ? JSON.parse(req.body.monitorData) : null;
    const image = req.files ? req.files.Screenshot : null;

    const existingEntryIndex = monitoredDataArray.findIndex(item => item.monitorData.deviceName === monitorData.deviceName);
    if (existingEntryIndex !== -1) {
        // If exists, overwrite the existing entry with new data
        console.log("did exist");
        monitoredDataArray[existingEntryIndex] = { monitorData, image };
    } else {
        // If not exists, add a new entry
        console.log("did not exist");
        monitoredDataArray.push({ monitorData, image });
    }
    res.status(200).send('Data received successfully');
});

// Endpoint to retrieve monitored data based on device name
app.get('/api/monitored-data/:deviceName', (req, res) => {
  const deviceName = req.params.deviceName;
  const entry = monitoredDataArray.find(item => item.monitorData.deviceName === deviceName);
  if (entry) {
    const base64Image = entry.image.data.toString('base64');
    const imageData = {
      ...entry.image,
      data: base64Image,
    };
    res.status(200).json({ ...entry, image: imageData });
  } else {
    res.status(404).send('Entry not found');
  }
});

// Endpoint to get all deviceNames
app.get('/api/devices', (_, res) => {
  const deviceNames = monitoredDataArray.map(item => item.monitorData.deviceName);
  console.log('All Received Devices:', deviceNames);

  if (deviceNames.length > 0) {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200).json(deviceNames);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(404).json({ error: 'No Devices are connected' });
  }
}); 

app.listen(port, () => {
  console.log(`Server is up on ${port}`);
});