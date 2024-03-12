# RemoteControl-v2
Revamped Verison of my old RemoteControl Project. Now with an Express JS Server using my APIs to enable Communication between my react Dashboard and the C# Client.
### What can it do?

The client automatically sends comprehensive details and configurations to the API server every 30 seconds. This data, accompanied by a screenshot of the current screen and the device's wallpaper, is temporarily saved on the server. Meanwhile, React checks for connected devices and displays their corresponding device names on its dashboard. Clicking on a device reveals all available information, including a timer showing exactly how old the dataset is.

<details id="automatedDataSet">
  <summary><strong>Example Dataset</strong></summary>
  
  - **Device Name:** `MyComputer`
  - **User Name:** `the_test`
  - **Local IP:** `192.168.1.100`
  - **Language Layout:** `English (United States)`
  - **Time Zone:** `(UTC-05:00) Eastern Time (US & Canada)`
  - **Battery Percentage:** `80%`
  - **Is Battery Plugged In:** `true`
  - **Is Connected to Internet:** `true`
  - **Processor Model:** `Intel Core i7-7700HQ`
  - **Processor Architecture:** `x86_64`
  - **Processor Count:** `4`
  - **Logical Drives Available:** `[C:\, D:\]`
  - **OS Version:** `Microsoft Windows NT 10.0.19042.0`
  - **Is 64-Bit OS:** `true`
  - **RAM Usage:** `256 MB`
  - **Time of Monitoring:** `14:30:45 - 03/05/2024`
  - **Run Path:** `C:\Program Files\MyApp\MyApp.exe`

</details>

Additionally, you can issue commands to the selected device. These commands, executed over the server, have a response time of around 1 second:

- **Lock Device:** Click to lock the device.
- **Initiate Shut down:** Click to initiate a shutdown.
- **Send Message:** Click to send a message to the device.
- **Open Webpage:** Click to open a webpage.
- **Change Wallpaper:** Click to change the wallpaper.
- **Stop Client:** Click to stop the client.


### How does the Communication work?

## Set up
### C# Client
The C# Client can be found under the [Driver1](Driver1/Driver1) Folder and is a Console Application that will run in the Background, It is designed to use less Memory relativley to my last Version.
Starting it is as simple as just running the .exe File

### React Dashboard
The React Frontend can be found under the [MonitorDashboard](MonitorDashboard) Folder and provides an Interface for the User to control all the connected Devices.

To start the dashboard, open a terminal, move into your  `Project Folder` folder, and run the following commands:

```bash
cd ./MonitorDashboard/
npm i
npm run dev
```

### Node JS Server
The Node JS Server is also Located in the MonitorDashboard folder under the [server.js](MonitorDashboard/server.js) file.

