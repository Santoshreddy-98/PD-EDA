import os
import re
import logging
import json

from .ParserVOne import FileParser    

class DirectoryFileChecker:

    def __init__(self, parent_directory, folders_to_check):
        self.parent_directory = parent_directory
        self.folders_to_check = folders_to_check

        self.regex_patterns = {
            "file_pattern": re.compile(r'(area|hold|power|setup|qor)([._]?)(analysis|summary|all)([._]?)(analysis|summary|all)?\.rpt$')
        }
        self.file_parser = FileParser()
        # Configure logging
        # logging.basicConfig(filename='report_parser.log', level=print, format='%(asctime)s - %(levelname)s - %(message)s')

    def process_file(self, file_path, file_type, folder_name):
        if file_type == "power":
            self.file_parser.process_power_file(file_path, file_type, folder_name)
        elif file_type == "area":
            self.file_parser.process_area_summary_file(file_path, file_type, folder_name)
        elif file_type == "hold":
            self.file_parser.process_hold_analysis_file(file_path, file_type, folder_name)
        elif file_type == "setup":
            self.file_parser.process_setup_analysis_file(file_path, file_type, folder_name)
        else:
            print(f"Unsupported file type: '{file_type}'")

    def print_files_in_folder(self, folder_name, files):
        try:
            if files:
                print(f"Files in => '{folder_name}':")
                for file_name in files:
                    matchFile = self.regex_patterns.get('file_pattern').match(file_name)
                    if matchFile:
                        file_type = matchFile.group(1)
                        file_path = os.path.join( self.parent_directory, folder_name, file_name)
                        print(f"- {file_name}")
                        self.process_file(file_path, file_type, folder_name)
                    else:
                        print(f"Skipping unknown file '{file_name}'")
        except Exception as e:
            print(f"ERROR processing Files in print_files_in_folder function '{folder_name}': {str(e)} ")

    def process_folders(self):
        for folder_name in self.folders_to_check:
            folder_path = os.path.join(self.parent_directory, folder_name)
            try:
                if os.path.exists(folder_path) and os.path.isdir(folder_path):
                    print(f"Processing folder => '{folder_name}'")
                    
                    with os.scandir(folder_path) as entries:
                        files = [entry.name for entry in entries if entry.is_file()]
                    self.print_files_in_folder(folder_name, files)
                    print("===============================")
                    print(f"Folder '{folder_name}' done.")
                    print("===============================")
                else:
                    print(
                        f"------------------------------------------------------------")
                    print(
                        f"\tFolder '{folder_name}' does not exist in the directory")
                    print(
                        f"------------------------------------------------------------\n")
            except Exception as e:
                print(f"ERROR processing folder '{folder_name}': {str(e)}")
        


# if __name__ == "__main__":
#     parent_directory = "D:/DD/TestCases/test_1/"
#     folders_to_check = ["syn_opt", "floorplan", "prects", "route"]

#     processor = DirectoryFileChecker(parent_directory, folders_to_check)
#     processor.process_folders()
#     final_data = processor.file_parser.report.print_data_as_json()
    # print(final_data)
