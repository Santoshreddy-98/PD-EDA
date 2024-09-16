import json
from collections import defaultdict

class DataProcessor:
    def __init__(self, data):
        self.data = data
        self.data_dict = defaultdict(list)
        self.data_dict["stages"] = []
        self.data_dict["sub_stages"] = []
        self.data_dict["area"] = defaultdict(list)
        self.data_dict["setup"] = defaultdict(list)
        self.data_dict["hold"] = defaultdict(list)
        self.data_dict["power"] = defaultdict(list)

    def process_data(self):
        keyOne = list(self.data.keys())
        self.data_dict['stages'].extend(keyOne)
        self.data_dict['sub_stages'].extend(["Area", "Setup", "Hold", "Power"])
        for i in keyOne:
            self.data_dict['area']["InstCount"].append(self.data[i].get("area").get("InstCount"))
            self.data_dict['area']["TotalArea"].append(self.data[i].get("area").get("TotalArea"))

            self.data_dict['setup']["setupReg2RegWNS"].append(self.data[i].get("setup").get("SetupReg2RegWNS"))
            self.data_dict['setup']["setupReg2RegTNS"].append(self.data[i].get("setup").get("SetupReg2RegTNS"))
            self.data_dict['setup']["setupReg2RegNVP"].append(self.data[i].get("setup").get("SetupReg2RegNVP"))
            self.data_dict['setup']["setupIOWNS"].append(self.data[i].get("setup").get("SetupIOWNS"))
            self.data_dict['setup']["setupIOTNS"].append(self.data[i].get("setup").get("SetupIOTNS"))
            self.data_dict['setup']["setupIONVP"].append(self.data[i].get("setup").get("SetupIONVP"))

            self.data_dict['hold']["HoldReg2RegWNS"].append(self.data[i].get("hold").get("HoldReg2RegWNS"))
            self.data_dict['hold']["HoldReg2RegTNS"].append(self.data[i].get("hold").get("HoldReg2RegTNS"))
            self.data_dict['hold']["HoldReg2RegNVP"].append(self.data[i].get("hold").get("HoldReg2RegNVP"))
            self.data_dict['hold']["HoldIOWNS"].append(self.data[i].get("hold").get("HoldIOWNS"))
            self.data_dict['hold']["HoldIOTNS"].append(self.data[i].get("hold").get("HoldIOTNS"))
            self.data_dict['hold']["HoldIONVP"].append(self.data[i].get("hold").get("HoldIONVP"))

            self.data_dict['power']['internalPower'].append(self.data[i].get('power').get("InternalPower"))
            self.data_dict['power']['switchingPower'].append(self.data[i].get('power').get("SwitchingPower"))
            self.data_dict['power']['leakagePower'].append(self.data[i].get('power').get("leakagePower"))
            self.data_dict['power']['totalPower'].append(self.data[i].get('power').get("TotalPower"))
    
        return json.dumps(self.data_dict, indent=2)
    
   