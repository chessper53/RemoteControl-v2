import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors'; // Import the cors middleware

const app = express();
const port = 3001;
// Enable CORS for all routes
app.use(cors());

// Options handler for CORS preflight requests
app.options('*', cors());
app.use(bodyParser.json());
app.use(fileUpload());
let monitoredDataArray = [];


// Endpoint to receive data and image from C# app
app.post('/api/monitored-data', (req, res) => {
    const monitorData = req.body.monitorData ? JSON.parse(req.body.monitorData) : null;
    const image = req.files ? req.files.Screenshot : null;


    //Image does not get handeld! -> still need to handle that someway - mby just save the image idk


    // Check if an entry with the same device name already exists
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
    console.log(monitoredDataArray);
    res.status(200).send('Data received successfully');
});

// Endpoint to retrieve monitored data based on device name
app.get('/api/monitored-data/:deviceName', (req, res) => {
  const deviceName = req.params.deviceName;
  const entry = monitoredDataArray.find(item => item.monitorData.deviceName === deviceName);
  if (entry) {
    // Convert image data to base64
    const base64Image = entry.image.data.toString('base64');
    const imageData = {
      ...entry.image,
      data: base64Image,
    };
    // Send the modified entry with base64-encoded image data
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
    res.status(404).json({ error: 'No entries found' });
  }
}); 

app.listen(port, () => {
  console.log(`Server is running on port the ${port}`);
});