using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using static System.Net.WebRequestMethods;

namespace Driver1
{
    internal class remoteCommandsHandler
    {
        [DllImport("user32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        static extern bool SystemParametersInfo(uint uiAction, uint uiParam, String pvParam, uint fWinIni);

        private const uint SPI_SETDESKWALLPAPER = 0x14;
        private const uint SPIF_UPDATEINIFILE = 0x1;
        private const uint SPIF_SENDWININICHANGE = 0x2;

        [DllImport("user32")]
        public static extern void LockWorkStation();

        public static void lockDevice()
        {
            LockWorkStation();
        }
        public static void shutdownDevice()
        {

        }
        public static void openWebpage(string URL)
        {
            var psi = new ProcessStartInfo
            {
                FileName = URL,
                UseShellExecute = true
            };
            Process.Start(psi);
        }


    public static void LaunchToastNotification(string message)
    {

    }


    public static void restartDevice()
        {
            System.Diagnostics.Process.Start("shutdown.exe", "-r -t 0");
        }
        public static void changeWallpaper(string wallpaperstring)
        {
            uint flags = 0;
            if (!SystemParametersInfo(SPI_SETDESKWALLPAPER,0, wallpaperstring, flags))
            {
                Console.WriteLine("Error");
            }
        }
        public static void stopClient(){ System.Environment.Exit(0);}
    }
}
