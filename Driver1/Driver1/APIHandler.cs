using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Driver1
{
    public static class APIHandler
    {
        public static async Task SendMonitoredDataAsync(object monitorData, string imagePath, string wallpaperPath)
        {
            using (var httpClient = new HttpClient())
            using (var formData = new MultipartFormDataContent())
            {
                // Convert monitorData to JSON and add it to the form
                var jsonContent = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(monitorData));
                formData.Add(jsonContent, "monitorData");

                // Add the images to the form
                var imageContent = new ByteArrayContent(File.ReadAllBytes(imagePath));
                imageContent.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");
                formData.Add(imageContent, "Screenshot", "CurrentScreenshot.jpg");

                var imageContent2 = new ByteArrayContent(File.ReadAllBytes(wallpaperPath));
                imageContent2.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");
                formData.Add(imageContent2, "Wallpaper", "Wallpaper.jpg");

                // Send the form data to the API
                var apiUrl = "http://localhost:3001/api/monitored-data";
                var response = await httpClient.PostAsync(apiUrl, formData);

                response.EnsureSuccessStatusCode();
            }
        }
        public static async Task checkforRemoteCommands()
        {
            string apiUrl = $"http://localhost:3001/api/command/{System.Environment.MachineName}";
            using (HttpClient httpClient = new HttpClient())
            {
                try
                {
                    HttpResponseMessage response = await httpClient.GetAsync(apiUrl);
                    if (response.IsSuccessStatusCode)
                    {
                        string responseData = await response.Content.ReadAsStringAsync();
                        var commandList = JsonConvert.DeserializeObject<dynamic>(responseData);
                        string extractedData = commandList[0]?.data;
                        switch (extractedData)
                        {
                            case "Lock":
                                remoteCommandsHandler.lockDevice();
                                break;
                            case "Shutdown":
                                remoteCommandsHandler.shutdownDevice();
                                break;
                            case "Restart":
                                remoteCommandsHandler.restartDevice();
                                break;
                            case "Wallpaper":
                                remoteCommandsHandler.changeWallpaper("e");
                                break;
                            case "Exit":
                                remoteCommandsHandler.stopClient();
                                break;
                            default:
                                break;
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                }
            }   
        }
    }
}
