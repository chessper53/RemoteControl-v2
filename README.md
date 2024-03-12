# RemoteControl-v2
Revamped Verison of my old RemoteControl Project. Now with an Express JS Server using my APIs to enable Communication between my react Dashboard and the C# Client.
### What can it do?

The Client automatically sends a comprehensive set of details and configurations to the API Server every 30 seconds this data is also accompanied by a Screenshot of the current Screen and the Devices Wallpaper. This is then temporarly saved on the Server, meanwhile React checks if the Server has any connected Devices and displays their corresponding DeviceNames on it's Dashboard. If a Device is clicked upon all available Information about it is displayed and there is a Timer showing excatcly how old the Dataset is.
[Link to Example Automated Data Set](#automatedDataSet)

<details id="automatedDataSet">
  <summary><strong>Example Automated Data Set</strong></summary>
  
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



### How does the Communication work?

## C# Client
### Description
The C# Client can be found under the XXX Folder and is a Console Application that will run in the Background, It is designed to use less Memory relativley to my last Version.
Starting it is as simple as just running the .exe File
## React Dashboard
## Node JS Server
