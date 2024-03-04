using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Win32;

namespace Driver1
{
    internal class remoteCommandsHandler
    {
        [DllImport("user32")]
        public static extern void LockWorkStation();
        public static void lockDevice()
        {
            LockWorkStation();
        }
        public static void shutdownDevice()
        {

        }
        public static void restartDevice()
        {

        }
        public static void changeWallpaper(string wallpaperstring)
        {

        }
        public static void stopClient(){ System.Environment.Exit(0);}
    }
}
