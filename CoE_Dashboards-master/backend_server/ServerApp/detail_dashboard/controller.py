import os
import fnmatch
import json
import logging
from .power_threshold import DesignFileParser

# Initialize logger
logger = logging.getLogger('detaildashboard')


class PowerData:
    def __init__(self):
        # Design information structure
        self.design_info = {
            "cell:Count": {
                "all": {"value": None, "lineNumber": None, "path": None},
                "Comb": {"value": None, "lineNumber": None, "path": None},
                "Seq": {"value": None, "lineNumber": None, "path": None},
                "Buf/Inv": {"value": None, "lineNumber": None, "path": None},
                "Hold_Buf/Inv": {"value": None, "lineNumber": None, "path": None},
                "Unclocked_Seqs": {"value": None, "lineNumber": None, "path": None},
                "Macro": {"value": None, "lineNumber": None, "path": None},
                "Clk_Buf/Inv": {"value": None, "lineNumber": None, "path": None},
                "Clk_Gates": {"value": None, "lineNumber": None, "path": None},
            },
            "cell:Area": {
                "all": {"value": None, "lineNumber": None, "path": None},
                "Comb": {"value": None, "lineNumber": None, "path": None},
                "Seq": {"value": None, "lineNumber": None, "path": None},
                "Buf/Inv": {"value": None, "lineNumber": None, "path": None},
                "Macro": {"value": None, "lineNumber": None, "path": None},
                "Std_cell_Growth%": {"value": None, "lineNumber": None, "path": None},
                "Hold_Buf/Inv": {"value": None, "lineNumber": None, "path": None},
                "Unclocked_Seqs": {"value": None, "lineNumber": None, "path": None},
                "Pfet": {"value": None, "lineNumber": None, "path": None},
            },
            "cell:Flops": {
                "Mbit_flop%": {"value": None, "lineNumber": None, "path": None},
                "Ratio": {"value": None, "lineNumber": None, "path": None},
            },
        }

        # Power information structure
        self.power = {
            "Svt": {"value": None, "lineNumber": None, "path": None},
            "Lvtll": {"value": None, "lineNumber": None, "path": None},
            "Lvt": {"value": None, "lineNumber": None, "path": None},
            "Ulvtll": {"value": None, "lineNumber": None, "path": None},
            "Ulvt": {"value": None, "lineNumber": None, "path": None},
            "Ulvt%": {"value": None, "lineNumber": None, "path": None},
            "Ulvtll%": {"value": None, "lineNumber": None, "path": None},
            "Lvt_%": {"value": None, "lineNumber": None, "path": None},
            "Svt%": {"value": None, "lineNumber": None, "path": None},
            "Lvtll%": {"value": None, "lineNumber": None, "path": None},
            "Clk": {"value": None, "lineNumber": None, "path": None},
        }

        self.power_data = {
            "Internal_power": {"value": None, "lineNumber": None, "path": None},
            "Switching_power": {"value": None, "lineNumber": None, "path": None},
            "Leakage_power": {"value": None, "lineNumber": None, "path": None},
            "Total_count": {"value": None, "lineNumber": None, "path": None}
        }
        # Utilisation information structure
        self.u_data = {
            "value": None,
            "lineNumber": None,
            "path": None
        }
        # Combined data structure
        self.data = {
            "Design": self.design_info,
            "Power": {
                "Z": self.power,
                "Constant_Switching_Activity": self.power_data
            },
            "Utilization": self.u_data,
        }

    def update_design_data(self, data):
        self.data["Design"] = data

    def update_Z_data(self, z_data):
        self.data["Power"]["Z"] = z_data

    def update_u_data(self, u_data):
        self.data["Utilization"] = u_data

    def update_power_data(self, p_data):
        self.data["Power"]["Constant_Switching_Activity"] = p_data

    def get_data(self):
        return self.data


class PowerDataProcessor:
    def __init__(self, directory, corner):
        logger.info(
            f"Initializing PowerDataProcessor for corner: {corner.get('Power')['Corner']}")
        self.power_data = PowerData()
        self.corner = corner.get('Power')['Corner']
        self.directory = directory
        self.search_qor = '*qor*.rpt'
        self.search_threshold = '*report_thresold_voltage*.rpt'
        self.search_power = '*report_power*.rpt'
        self.utilization = '*BLock_utilization.rpt'

    def main_controller(self):
        try:
            for root, _, files in os.walk(self.directory):
                for filename in files:
                    if fnmatch.fnmatch(filename, self.search_qor):
                        file_path = os.path.join(root, filename)
                        file_reader = DesignFileParser(file_path, self.corner)
                        data = file_reader.parse_qor_file()
                        self.power_data.update_design_data(data)

                    if fnmatch.fnmatch(filename, self.search_threshold):
                        file_path = os.path.join(root, filename)
                        file_reader = DesignFileParser(file_path, self.corner)
                        z_data = file_reader.parse_threshold_file()
                        self.power_data.update_Z_data(z_data)

                    if fnmatch.fnmatch(filename, self.search_power):
                        file_path = os.path.join(root, filename)
                        file_reader = DesignFileParser(file_path, self.corner)
                        p_data = file_reader.parse_power_file()
                        self.power_data.update_power_data(p_data)

                    if fnmatch.fnmatch(filename, self.utilization):
                        file_path = os.path.join(root, filename)
                        logger.info(f"Matching utilization file: {file_path}")
                        file_reader = DesignFileParser(file_path, self.corner)
                        u_data = file_reader.utilization()
                        self.power_data.update_u_data(u_data)

            logger.info("All files in the directory are parsed successfully.")
            logger.info(f"The files in the directory are: {files}")

        except Exception as e:
            logger.error(f"An error occurred: {str(e)}")

        return self.power_data.get_data()
