import re
import os
import yaml
import json
from collections import defaultdict
import logging

logger = logging.getLogger('detaildashboard')


class Timing:

    def __init__(self, mergedPath, yamlData) -> None:
        self.common_path = mergedPath
        self.yamlData = yamlData
        self.qor_file_pattern = {
            'qor_pattern': re.compile(r'^.*qor.*\.rpt$', re.MULTILINE | re.DOTALL | re.IGNORECASE)
        }

        self.qor_hold_pattern = {
            'qor_hold_wns': re.compile(r"(\d+) Worst Hold Violation:\s+(-?\d+(\.\d+)?)"),
            'qor_hold_tns': re.compile(r"(\d+) Total Hold Violation:\s+(-?\d+(\.\d+)?)"),
            'qor_hold_voils': re.compile(r"(\d+) No. of Hold Violations:\s+(-?\d+(\.\d+)?)")
        }

        self.qor_setup_pattern = {
            'qor_setup_wns': re.compile(r"(\d+) Critical Path Slack:\s+(-?\d+(\.\d+)?)"),
            'qor_setup_tns': re.compile(r"(\d+) Total Negative Slack:\s+(-?\d+(\.\d+)?)"),
            'qor_setup_voils': re.compile(r"(\d+) No. of Violating Paths:\s+(-?\d+(\.\d+)?)")
        }

        self.final_timing_data = defaultdict(dict)
        self.setup_data = defaultdict(dict)
        self.hold_data = defaultdict(dict)

    def read_file(self, filePath):
        try:
            with open(filePath, 'r') as file:
                file_content = file.readlines()
                modified_lines = [f"{i} {line.strip()}" for i,
                                  line in enumerate(file_content, 1)]
                modified_content = '\n'.join(modified_lines)
            return modified_content
        except Exception as e:
            logger.error(f"Error reading file: {str(e)}")
            return ''

    def finding_setup_data(self, file_path):
        try:
            content = self.read_file(file_path)
            yaml_matched_data = self.yamlData.get('Setup', [])

            for val in yaml_matched_data:
                scenario = val.get('Corner')
                for group in val['Group'].keys():
                    group_data = val.get('Group')[group]
                    key = f'{scenario}:{group_data}(setup)'
                    setup_pattern = re.compile(
                        fr"(\d+) (Scenario\s+'{re.escape(scenario)}'[\n](\d+) Timing Path Group\s+'{re.escape(group_data)}'.*?No\. of Hold Violations:\s+\d+)",
                        re.MULTILINE | re.DOTALL
                    )
                    setup_match = setup_pattern.search(content)

                    if setup_match:
                        setup_wns = self.qor_setup_pattern['qor_setup_wns'].search(
                            setup_match.group(2))
                        if setup_wns:
                            self.final_timing_data[key]['wns'] = {
                                'lineNumber': setup_wns.group(1),
                                'path': file_path,
                                'value': setup_wns.group(2)
                            }

                        setup_tns = self.qor_setup_pattern['qor_setup_tns'].search(
                            setup_match.group(2))
                        if setup_tns:
                            self.final_timing_data[key]['tns'] = {
                                'lineNumber': setup_tns.group(1),
                                'path': file_path,
                                'value': setup_tns.group(2)
                            }

                        setup_voils = self.qor_setup_pattern['qor_setup_voils'].search(
                            setup_match.group(2))
                        if setup_voils:
                            self.final_timing_data[key]['voils'] = {
                                'lineNumber': setup_voils.group(1),
                                'path': file_path,
                                'value': setup_voils.group(2)
                            }
            # return dict(self.final_timing_data)
        except Exception as e:
            logger.error(f"Error finding setup data: {str(e)}")

    def finding_hold_data(self, file_path):
        try:
            content = self.read_file(file_path)
            yaml_matched_data = self.yamlData.get('Hold', [])
            for val in yaml_matched_data:
                scenario = val.get('Corner')
                for group in val['Group'].keys():
                    group_data = val.get('Group')[group]
                    key = f'{scenario}:{group_data}(hold)'
                    hold_pattern = re.compile(
                        fr"(\d+) (Scenario\s+'{re.escape(scenario)}'[\n](\d+) Timing Path Group\s+'{re.escape(group_data)}'.*?No\. of Hold Violations:\s+\d+)",
                        re.MULTILINE | re.DOTALL
                    )
                    hold_match = hold_pattern.search(content)

                    if hold_match:
                        hold_wns = self.qor_hold_pattern['qor_hold_wns'].search(
                            hold_match.group(2))
                        if hold_wns:
                            self.final_timing_data[key]['wns'] = {
                                'lineNumber': hold_wns.group(1),
                                'path': file_path,
                                'value': hold_wns.group(2)
                            }

                        hold_tns = self.qor_hold_pattern['qor_hold_tns'].search(
                            hold_match.group(2))
                        if hold_tns:
                            self.final_timing_data[key]['tns'] = {
                                'lineNumber': hold_tns.group(1),
                                'path': file_path,
                                'value': hold_tns.group(2)
                            }

                        hold_voils = self.qor_hold_pattern['qor_hold_voils'].search(
                            hold_match.group(2))
                        if hold_voils:
                            self.final_timing_data[key]['voils'] = {
                                'lineNumber': hold_voils.group(1),
                                'path': file_path,
                                'value': hold_voils.group(2)
                            }

            return dict(self.final_timing_data)
        except Exception as e:
            logger.error(f"Error finding hold data: {str(e)}")

    def initialize_default_data(self):
        try:
            yaml_setup_data = self.yamlData.get('Setup', [])
            yaml_hold_data = self.yamlData.get('Hold', [])

            for data in yaml_setup_data + yaml_hold_data:
                scenario = data.get('Corner')
                for group, group_data in data.get('Group', {}).items():

                    if data in yaml_setup_data:
                        key = f'{scenario}:{group_data}(setup)'
                        self.final_timing_data[key] = {
                            'wns': {'lineNumber': "-", 'path': "-", 'value': "-"},
                            'tns': {'lineNumber': "-", 'path': "-", 'value': "-"},
                            'voils': {'lineNumber': "-", 'path': "-", 'value': "-"}
                        }
                    elif data in yaml_hold_data:
                        key = f'{scenario}:{group_data}(hold)'
                        self.final_timing_data[key] = {
                            'wns': {'lineNumber': "-", 'path': "-", 'value': "-"},
                            'tns': {'lineNumber': "-", 'path': "-", 'value': "-"},
                            'voils': {'lineNumber': "-", 'path': "-", 'value': "-"}
                        }
            return dict(self.final_timing_data)
        except Exception as e:
            logger.error(f"Error initializing default data: {str(e)}")

    def timing_report(self):
        try:
            qor_file = os.listdir(self.common_path)

            matching_filenames = {
                pattern_name: ', '.join([
                    filename for filename in qor_file if pattern.match(filename)])
                for pattern_name, pattern in self.qor_file_pattern.items()
            }
            if matching_filenames.get('qor_pattern'):
                file_matched = os.path.join(self.common_path, matching_filenames.get('qor_pattern'))
                self.finding_setup_data(file_matched)
                timing_data = self.finding_hold_data(file_matched)
                return timing_data
            else:
                data = self.initialize_default_data()
                return data
        except Exception as e:
            logger.error(f"Error generating timing report: {str(e)}")
