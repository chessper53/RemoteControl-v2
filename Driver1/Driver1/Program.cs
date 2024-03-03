using Driver1;
using System;
using System.Globalization;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Net.Sockets;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Drawing;
using System.Drawing.Imaging;


public class Program
{
    static async Task SendMonitoredDataAsync(object monitorData, string imagePath)
    {
        using (var httpClient = new HttpClient())
        using (var formData = new MultipartFormDataContent())
        {
            // Convert monitorData to JSON and add it to the form
            var jsonContent = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(monitorData));
            formData.Add(jsonContent, "monitorData");

            // Add the image to the form
            var imageContent = new ByteArrayContent(File.ReadAllBytes(imagePath));
            imageContent.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");
            formData.Add(imageContent, "Screenshot", "CurrentScreenshot.jpg");

            // Send the form data to the API
            var apiUrl = "http://localhost:3001/api/monitored-data";
            var response = await httpClient.PostAsync(apiUrl, formData);

            response.EnsureSuccessStatusCode();
        }
    }

    static async Task Main()
    {
        while (true)
        {
            try
            {
                var monitoredData = new
                {
                    // Monitored data properties
                    deviceName = System.Environment.MachineName,
                    localIP = GetLocalIPAddress(),
                    languageLayout = CultureInfo.InstalledUICulture.EnglishName,
                    timeZone = TimeZoneInfo.Local.DisplayName,
                    batteryPercentage = BatteryInfo.GetBatteryPercentage(),
                    isBatteryPluggedIn = BatteryInfo.IsPluggedIn(),
                    isConnectedToInternet = new WebClient().DownloadString("http://www.google.com") != null, // Bad way to check but it works
                    timeOfMonitoring = DateTime.Now.ToString("HH:mm:ss - dd/MM/yyyy"),
                };

                await SendMonitoredDataAsync(monitoredData, ScreenshotCapture.GetScreenshotPath());
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
            Thread.Sleep(60000);
        }
        
    }

    public static string GetLocalIPAddress()
    {
        var host = Dns.GetHostEntry(Dns.GetHostName());
        foreach (var ip in host.AddressList)
        {
            if (ip.AddressFamily == AddressFamily.InterNetwork)
            {
                return ip.ToString();
            }
        }
        throw new Exception("No network adapters with an IPv4 address in the system!");
    }

}
