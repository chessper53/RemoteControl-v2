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
        public static async Task SendMonitoredDataAsync(object monitorData, string imagePath)
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
    }
}
