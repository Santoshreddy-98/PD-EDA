import os
import re
import logging
import json
from .converterVOne import DataProcessor


class ReportData:
    def __init__(self):
        self.data = {}

    def fill_missing_data(self, jsonDatas):
        stages = ["syn_opt", "floorplan", "prects", "route", "cts"]

        # *************************************
        for i, stage in enumerate(stages[:-1]):
            next_stage = stages[i + 1]
            index = stages.index(next_stage)
            for i in range(len(stages)):
                current_index = (index + i) % len(stages)
                val = stages[current_index]
                if val in jsonDatas.keys():
                    missing_data = set(jsonDatas[val].keys()).difference(set(jsonDatas[stage].keys()))
                    if missing_data and len(set(jsonDatas[stage].keys())) < 4:
                        for missing_key in missing_data:
                            jsonDatas[stage][missing_key] = jsonDatas[val][missing_key]

        # Adding the logic to handle the last stage
        last_stage = stages[-1]
        if last_stage in jsonDatas:
            missing_data = set(jsonDatas[stages[0]].keys()).difference(
                set(jsonDatas[last_stage].keys()))
            if missing_data and len(set(jsonDatas[last_stage].keys())) < 4:
                for missing_key in missing_data:
                    jsonDatas[last_stage][missing_key] = jsonDatas[stages[0]][missing_key]
        obj = DataProcessor(jsonDatas)
        obj_two = obj.process_data()
        return obj_two

        
    def print_data_as_json(self):
        updated_data = self.fill_missing_data(self.data)

        print("==========  Final Data Printing ==========")
        # print(updated_data)
        return updated_data
        print("==========   ==========")


class FileParser:
    def __init__(self):
        self.pattern = {
            "total_power": re.compile(r'^(Total Power\s*\n)[-]*\n(Total Internal Power:\s*(.*?)\s*(\d+\.?\d+)%\n)(Total Switching Power:\s*(.*?)\s*(\d+\.?\d+)%\n)(Total Leakage Power:\s*(.*?)\s*(\d+\.?\d+)%\n)(Total Power:\s+(.*?)\s*(\d+\.?\d+))', re.MULTILINE),
            "find_design": re.compile(r'[#\s]*(Design|Module):\s*([a-zA-Z0-9_]+)', re.MULTILINE | re.DOTALL),
            "find_instance": re.compile(r'^\s*(Instance|Hinst Name).*$', re.MULTILINE),
            "find_setup": re.compile(r'^# ((SETUP|HOLD)(.*?))# DRV', re.DOTALL | re.MULTILINE),
            "find_reg2reg": re.compile(r'\s+Group\s*:\s*(reg2reg)\s+(-?\d+(?:\.\d+)?|N/A)\s+(-?\d+(?:\.\d+)?|N/A)\s+(-?\d+(?:\.\d+)?|N/A)'),
            "find_setup_group": re.compile(r'\s+Group\s*:\s*(in2out|reg2out|in2reg)\s+(-?\d+(?:\.\d+)?|N/A)\s+(-?\d+(?:\.\d+)?|N/A)\s+(-?\d+(?:\.\d+)?|N/A)')
        }
        self.report = ReportData()

    def read_matched_files(self, file_path):
        try:
            with open(file_path, 'r') as file:
                file_content = file.read()
                if file_content:
                    return file_content
                else:
                    print(f"No Data in the file {file_path}")
                    return False

        except FileNotFoundError:
            print(f"File not found: {file_path}")
        except Exception as e:
            print(f"ERROR occures in read_matched_files function -> {str(e)}")

    def process_power_file(self, file_path, file_type, folder_name):
        try:
            file_content = self.read_matched_files(file_path)

            if file_content:
                total_power_match = self.pattern['total_power'].search(
                    file_content)

                if total_power_match:
                    if folder_name not in self.report.data:
                        self.report.data[folder_name] = {}
                    self.report.data[folder_name][file_type] = {
                        "InternalPower": total_power_match.group(3),
                        "SwitchingPower": total_power_match.group(6),
                        "leakagePower": total_power_match.group(9),
                        "TotalPower": total_power_match.group(13)
                    }
                else:
                    print("No power data found in the file.")
            else:
                print("No data available in the file. -")

        except FileNotFoundError:
            print(f"File not found: {file_path}")
        except Exception as e:
            print(
                f"An error occurred while processing the power file: {str(e)}")

    def process_area_summary_file(self, file_path, file_type, folder_name):
        print(f"Processing area summary file: '{file_path}'")
        try:
            file_content = self.read_matched_files(file_path)
            file_content = file_content.strip()
            if file_content:
                design_module_match = self.pattern['find_design'].search(
                    file_content)
                design_module_name = design_module_match.group(2)
                instance_hinst_match = self.pattern['find_instance'].search(
                    file_content)
                instance_hinst_line = instance_hinst_match.group(0).strip()
                split_line = re.split(r'\s{2,}', instance_hinst_line)
                instance_hinst_names = split_line[2:]
                design_module_lines_match = re.search(
                    rf"^{re.escape(design_module_name)}.*$", file_content, re.MULTILINE)
                design_module_lines = design_module_lines_match.group(0)
                if design_module_lines_match:
                    pattern = r'\b\d+(?:\.\d+)?\b'
                    numbers = re.findall(pattern, design_module_lines)
                    subset = ["Inst Count", "Cell Count", "Total Area"]
                    positions = [instance_hinst_names.index(
                        column) for column in subset if column in instance_hinst_names]
                    if folder_name not in self.report.data:
                        self.report.data[folder_name] = {}

                    self.report.data[folder_name][file_type] = {
                        "InstCount": numbers[positions[0]],
                        "TotalArea": numbers[positions[1]]
                    }
                else:
                    print("No area data found in the file")
            else:
                print("No data available in the file.")

        except Exception as e:
            print(f"ERROR occurs {str(e)}")

    def extract_numeric_value(self, value):
        # Helper function to extract and convert numeric values
        if '.' in value:
            return float(value)
        elif value != 'N/A':
            return int(value)
        else:
            return None

    def process_hold_analysis_file(self, file_path, file_type, folder_name):
        print(f"Processing hold analysis file: '{file_path}'")
        try:
            file_content = self.read_matched_files(file_path)
            # print(file_content)
            if file_content:
                setup_pattern = self.pattern['find_setup'].search(
                    file_content).group(0)
                if not setup_pattern:
                    print("SETUP section not found in the data.")
                    return
                reg2reg_match = self.pattern['find_reg2reg'].search(
                    setup_pattern)
                group_matches = self.pattern['find_setup_group'].findall(
                    setup_pattern)
                numeric_values = [self.extract_numeric_value(
                    match[1]) for match in group_matches if match[1] != 'N/A']

                if not numeric_values:
                    print("No valid numeric values found in the SETUP section.")
                    return

                worst_value = min(numeric_values)
                print(worst_value)
                worst_line_pattern = rf'\s+Group\s*:\s*(in2out|reg2out|in2reg)\s+({worst_value})\s+(-?\d+(?:\.\d+)?|N/A)\s+(-?\d+(?:\.\d+)?|N/A)'
                worst_line_match = re.search(
                    worst_line_pattern, setup_pattern, re.MULTILINE)

                if worst_line_match:
                    if folder_name not in self.report.data:
                        self.report.data[folder_name] = {}
                    self.report.data[folder_name][file_type] = {
                        "HoldReg2RegWNS": reg2reg_match.group(2),
                        "HoldReg2RegTNS": reg2reg_match.group(3),
                        "HoldReg2RegNVP": reg2reg_match.group(4),
                        "HoldIOWNS": worst_line_match.group(2),
                        "HoldIOTNS": worst_line_match.group(3),
                        "HoldIONVP": worst_line_match.group(4)
                    }
        except Exception as e:
            print(f"ERROR in process_setup_analysis_file => {str(e)}")

    def process_setup_analysis_file(self, file_path, file_type, folder_name):
        print(f"Processing setup analysis file: '{file_path}'")
        try:
            file_content = self.read_matched_files(file_path)
            if file_content:
                setup_pattern = self.pattern['find_setup'].search(
                    file_content).group(0)
                if not setup_pattern:
                    print("SETUP section not found in the data.")
                    return
                reg2reg_match = self.pattern['find_reg2reg'].search(
                    setup_pattern)
                group_matches = self.pattern['find_setup_group'].findall(
                    setup_pattern)
                numeric_values = [self.extract_numeric_value(
                    match[1]) for match in group_matches if match[1] != 'N/A']

                if not numeric_values:
                    print("No valid numeric values found in the SETUP section.")
                    return

                worst_value = min(numeric_values)
                print(worst_value)
                worst_line_pattern = rf'\s+Group\s*:\s*(in2out|reg2out|in2reg)\s+({worst_value})\s+(-?\d+(?:\.\d+)?|N/A)\s+(-?\d+(?:\.\d+)?|N/A)'
                worst_line_match = re.search(
                    worst_line_pattern, setup_pattern, re.MULTILINE)

                if worst_line_match:
                    if folder_name not in self.report.data:
                        self.report.data[folder_name] = {}
                    self.report.data[folder_name][file_type] = {
                        "SetupReg2RegWNS": reg2reg_match.group(2),
                        "SetupReg2RegTNS": reg2reg_match.group(3),
                        "SetupReg2RegNVP": reg2reg_match.group(4),
                        "SetupIOWNS": worst_line_match.group(2),
                        "SetupIOTNS": worst_line_match.group(3),
                        "SetupIONVP": worst_line_match.group(4)
                    }
        except Exception as e:
            print(f"ERROR in process_setup_analysis_file => {str(e)}")
