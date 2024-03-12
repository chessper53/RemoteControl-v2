using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Driver1
{
    public static class APIHandler
    {
        public static string apiURL = "http://localhost:3001";

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
                var apiUrl = apiURL + "/api/monitored-data";
                var response = await httpClient.PostAsync(apiUrl, formData);

                response.EnsureSuccessStatusCode();
            }
        }
        public static async Task checkforRemoteCommands()
        {
            string apiUrl = $"{apiURL}/api/command/{System.Environment.MachineName}";
            using (HttpClient httpClient = new HttpClient())
            {
                try
                {
                    HttpResponseMessage response = await httpClient.GetAsync(apiUrl);
                    if (response.IsSuccessStatusCode)
                    {
                        string responseData = await response.Content.ReadAsStringAsync();
                        var result = JsonConvert.DeserializeObject<JArray>(responseData);

                        if (result.Count > 0)
                        {
                            string extractedData = result[0]["data"].ToString();
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
                                case "Exit":
                                    remoteCommandsHandler.stopClient();
                                    break;
                                case "Webpage":
                                    getRemoteAdditionalDataAsync();
                                    break;
                                case "Wallpaper":
                                    getRemoteAdditionalDataAsync();
                                    break;
                                case "Message":
                                    getRemoteAdditionalDataAsync();
                                    break;
                                default:
                                    break;
                            }
                        }

                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                }
            }   
        }
        public static async Task getRemoteAdditionalDataAsync()
        {
            try
            {
                string apiUrl = apiURL + "/api/additionalData";
                using (HttpClient client = new HttpClient())
                using (HttpResponseMessage response = await client.GetAsync(apiUrl))
                using (HttpContent content = response.Content)
                {
                    response.EnsureSuccessStatusCode();
                    string responseBody = await response.Content.ReadAsStringAsync();   
                    dynamic result = Newtonsoft.Json.JsonConvert.DeserializeObject(responseBody);
                    Console.WriteLine(result);

                    if (result != null && result is Newtonsoft.Json.Linq.JObject && result["additionalData"] != null)
                    {
                        string basedata = result.additionalData;
                        string[] imageDataParts = basedata.Split(',');
                        if (imageDataParts.Length == 2)
                        {
                            string contentType = imageDataParts[0];
                            string base64Data = imageDataParts[1];

                            byte[] byteArray = Convert.FromBase64String(base64Data);

                            using (MemoryStream stream = new MemoryStream(byteArray))
                            {
                                Image image = Image.FromStream(stream);
                                string executablePath = System.Reflection.Assembly.GetExecutingAssembly().Location;
                                string directory = System.IO.Path.GetDirectoryName(executablePath);
                                string filePath = System.IO.Path.Combine(directory, "newWallpaper.jpg");
                                image.Save(filePath, System.Drawing.Imaging.ImageFormat.Jpeg);
                                Console.WriteLine($"Image saved to: {filePath}");
                                remoteCommandsHandler.changeWallpaper(filePath);
                            }
                        }
                        else
                        {
                            Console.WriteLine(basedata);
                            string pattern = @"^(.*www.*|https?://\S+)$";
                            bool isWebpage = Regex.IsMatch(basedata, pattern);
                            if (isWebpage){remoteCommandsHandler.openWebpage(basedata); 
                            }
                            else // Is a Text Message from Dashboard
                            {
                                remoteCommandsHandler.displayRemoteMessage(basedata);
                            }
                        }
                    }
                    else
                    {
                        Console.WriteLine("Error: Additional Data is null or not present in the response");
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
