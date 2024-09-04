import re
import yaml
import json
import os
from collections import defaultdict
import logging

from .timing_parser import Timing
from .routing_parser import RoutingParser
from .controller import PowerDataProcessor

logger = logging.getLogger('detaildashboard')


class MainController:
    def __init__(self, yaml_file_path):
        self.yaml_file_path = yaml_file_path
        self.list_of_dicts = defaultdict(dict)
        self.final_data = list()
        self.stages = ["syn_opt", "place", 'cts', "route"]

    def read_yaml_and_convert_to_json(self):
        try:
            with open(self.yaml_file_path, 'r') as file:
                yaml_data = file.read()
                logger.info('YAML file read')

            data_dict = yaml.safe_load(yaml_data)
            return data_dict
        except Exception as e:
            logger.error(f"Error reading YAML file: {str(e)}")
            return f"Error: {str(e)}"

    def run_main(self):
        try:
            jsonData = self.read_yaml_and_convert_to_json()
            partition_names_list = [item['Partition_Name']
                                    for item in jsonData['Partitions']]
            self.list_of_dicts['partition_stages'] = partition_names_list

            if 'Partitions' in jsonData:
                partitions = jsonData['Partitions']
                for partition in partitions:
                    self.list_of_dicts['Partition_Name'] = partition.get(
                        'Partition_Name')
                    self.list_of_dicts['Lead'] = partition.get('Lead')
                    self.list_of_dicts['Directory'] = partition.get('DIR')

                    data = self.list_directory_contents(
                        partition['DIR'], jsonData)
                return data, jsonData['Project']['Project_Name']
        except Exception as e:
            logger.exception(f"Error in run_main: {str(e)}")

    def list_directory_contents(self, dirPath, jsonData):
        try:
            if os.path.exists(dirPath) and os.path.isdir(dirPath):
                logger.info(f"Contents of directory: {dirPath}")
                contents = os.listdir(dirPath)

                for i in self.stages:
                    for item in contents:
                        pattern = re.compile(
                            rf'(\b[\w-]*{re.escape(i)}[\w-]*\b)', re.IGNORECASE)
                        match = pattern.search(item)
                        if match:
                            matched_text = match.group()
                            self.list_of_dicts['Stage'] = matched_text
                            merged_path = os.path.join(dirPath, matched_text)

                            logger.info(
                                f"Processing stage: {matched_text} in {dirPath}")

                            timingObj = Timing(merged_path, jsonData)
                            val1 = timingObj.timing_report()
                            self.list_of_dicts['Timing'] = val1

                            routeObj = RoutingParser(merged_path)
                            val2 = routeObj.file_checker()
                            self.list_of_dicts['Route'] = val2

                            controller_data = PowerDataProcessor(
                                merged_path, jsonData)
                            val3 = controller_data.main_controller()
                            self.list_of_dicts.update(val3)
                            self.final_data.append(dict(self.list_of_dicts))
                        else:
                            logger.warning("Pattern not found in the text.")
                return self.final_data
            else:
                logger.warning(
                    f"Directory '{dirPath}' does not exist or is not a valid directory.")
        except Exception as e:
            logger.exception(f"Error listing contents for directory: {str(e)}")
