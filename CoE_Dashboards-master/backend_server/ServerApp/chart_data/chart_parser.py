from collections import defaultdict
import logging
import json
django_logger = logging.getLogger('django')

class Chart:
    def __init__(self, chartData):
        self.chartData = chartData

        self.setup = []
        self.hold = []

        self.final_data = defaultdict(dict)

        self.data_dict = defaultdict(list)
        self.data_dict["stages"] = []
        self.data_dict["sub_stages"] = []
        self.data_dict["area"] = defaultdict(list)
        self.data_dict["setup"] = defaultdict(list)
        self.data_dict["hold"] = defaultdict(list)
        self.data_dict["power"] = defaultdict(list)
        

    def chart_data_converter(self):
        try:
            self.data_dict["stages"] = [entry["Stage"] for entry in self.chartData]
            self.data_dict['sub_stages'].extend(["Area", "Setup", "Hold", "Power"]) 
            for value in self.chartData:
                setup_values = []
                hold_values = []
                setup_stages = []
                hold_stages = []

                for key, data in value["Timing"].items():

                    if key.endswith("(setup)"):
                        val = key.split(':')[1].split('(')[0]
                        setup_stages.append(val)
                        setup_values.append(data)

                    elif key.endswith("(hold)"):
                        val = key.split(':')[1].split('(')[0]
                        hold_stages.append(val)
                        hold_values.append(data)
    
                # Setup
                self.data_dict['setup'][f'{setup_stages[0]}_wns'].append(setup_values[0]['wns']['value'])
                self.data_dict['setup'][f'{setup_stages[0]}_tns'].append(setup_values[0]['tns']['value'])
                self.data_dict['setup'][f'{setup_stages[0]}_nvp'].append(setup_values[0]['voils']['value'])
                self.data_dict['setup'][f'{setup_stages[1]}_wns'].append(setup_values[1]['wns']['value'])
                self.data_dict['setup'][f'{setup_stages[1]}_tns'].append(setup_values[1]['tns']['value'])
                self.data_dict['setup'][f'{setup_stages[1]}_nvp'].append(setup_values[1]['voils']['value'])

                # Hold
                self.data_dict['hold'][f'{hold_stages[0]}_wns'].append(hold_values[0]['wns']['value'])
                self.data_dict['hold'][f'{hold_stages[0]}_tns'].append(hold_values[0]['tns']['value'])
                self.data_dict['hold'][f'{hold_stages[0]}_nvp'].append(hold_values[0]['voils']['value'])
                self.data_dict['hold'][f'{hold_stages[1]}_tns'].append(hold_values[1]['tns']['value'])
                self.data_dict['hold'][f'{hold_stages[1]}_wns'].append(hold_values[1]['wns']['value'])
                self.data_dict['hold'][f'{hold_stages[1]}_nvp'].append(hold_values[1]['voils']['value'])

                
                # Area
                self.data_dict["area"]['InstCount'].append(value['Design']['cell:Count']['all']['value'])
                self.data_dict["area"]['TotalArea'].append(value['Design']['cell:Area']['all']['value'])

                # Power
                self.data_dict["power"]['internalPower'].append(value['Power']['Constant_Switching_Activity']['Internal_power']['value'])
                self.data_dict["power"]['switchingPower'].append(value['Power']['Constant_Switching_Activity']['Switching_power']['value'])
                self.data_dict["power"]['leakagePower'].append(value['Power']['Constant_Switching_Activity']['Leakage_power']['value'])
                self.data_dict["power"]['totalPower'].append(value['Power']['Constant_Switching_Activity']['Total_count']['value'])
            django_logger.info("Data conversion successful.")
            return self.data_dict
        except Exception as e:
            # Log the exception
            django_logger.error(f"An error occurred: {str(e)}")