using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Driver1
{
    public static class BatteryInfo
    {
        [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
        public struct SYSTEM_POWER_STATUS
        {
            public byte ACLineStatus;
            public byte BatteryFlag;
            public byte BatteryLifePercent;
            public byte Reserved1;
            public uint BatteryLifeTime;
            public uint BatteryFullLifeTime;
        }

        [DllImport("kernel32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool GetSystemPowerStatus(out SYSTEM_POWER_STATUS systemPowerStatus);

        public static int GetBatteryPercentage()
        {
            if (GetSystemPowerStatus(out var status))
            {
                return status.BatteryLifePercent;
            }
            return -1; 
        }

        public static bool IsPluggedIn()
        {
            if (GetSystemPowerStatus(out var status))
            {
                return status.ACLineStatus == 1; // 1 means the device is connected to AC power
            }
            return false;
        }
    }
}
