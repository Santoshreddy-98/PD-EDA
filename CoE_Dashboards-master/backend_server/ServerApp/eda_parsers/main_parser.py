import re
import os
import pandas as pd
import json
from . import TimingPath, Net_Paths, Pin_parser
from .def_parser import merge_def_lef, parse_def1, lef_parser, parse_def1, parse_def3, f1
from . import parser
from . import TimingPath, Net_Paths, Pin_parser
from ..models import Paths
import logging
# Professional regex pattern to match .def, .lef, and any case variation of TIMING followed by optional characters and ending with .rpt
# pattern = re.compile(r'\.(def|lef)$|.*TIMING.*\.rpt', re.IGNORECASE)

def get_dict_key(filename):
    if re.search(r'\.def$', filename, re.IGNORECASE):
        return "fileDef_Data"
    elif re.search(r'\.lef$', filename, re.IGNORECASE):
        return "fileLef_Data"
    elif re.search(r'.*\w*TIMING\w*\.rpt$', filename, re.IGNORECASE):
        return "fileTiming_Data"
    return None

# def process_filenames(filenames):
#     results_dict = {}
#     for filename in filenames:
#         print(filename)
#         if pattern.search(filename):
#             key = get_dict_key(filename)
#             if key:
#                 results_dict[key] = filename
#     print(results_dict)
#     return results_dict


def process_filenames(dir_path):
    results_dict = {}

    try:
        # Check if the directory exists
        if not os.path.isdir(dir_path):
            # logging.error(f"Directory does not exist: {dir_path}")
            return results_dict

        # Iterate over files in the directory
        for filename in os.listdir(dir_path):
            file_path = os.path.join(dir_path, filename)

            # Ensure we're only processing files
            if os.path.isfile(file_path):
                
                # Generate a key for the results dictionary
                key = get_dict_key(filename)
                if key:
                    results_dict[key] = file_path

    except Exception as e:
        logging.error(f"An error occurred while processing files in {dir_path}: {e}")

    return results_dict




def process_files(filenames): 
    # Process filenames to get the dictionary
    # print(filenames)
    file_dict = process_filenames(filenames)
    

    # Extract file paths from the dictionary
    timing_report_path = file_dict.get("fileTiming_Data")
    def_file_path = file_dict.get("fileDef_Data")
    lef_file_path = file_dict.get("fileLef_Data")

    if timing_report_path and def_file_path and lef_file_path:
        # Example function calls to handle file processing
    
        
        filedata = parser.parse_timing(timing_report_path)
        
        # # Clear existing paths 
        # PATH = Paths.objects.all()
        # PATH.delete()

        # Parse and save paths from the timing report
        file_1 = parser.parse_timing_1(timing_report_path)
        reader = pd.read_csv(file_1)
        
        combined_data = reader.to_dict(orient='records')  # This creates a list of dictionaries
        
        # Convert combined_data to JSON format (optional)
        # combined_data_json = json.dumps(combined_data)
        
        new_file = Paths(
            data=combined_data  # Store directly as JSON in the JSONField
        )
        new_file.save()
        
        obj = f1(
            merge_def_lef(
                parse_def1(def_file_path),
                lef_parser(lef_file_path)
            ),
            parse_def3(def_file_path)
        )

        obj_Path = TimingPath.parse_timing(timing_report_path)
        obj_NetPath = Net_Paths.parse_timing(timing_report_path)
        obj_Pins = Pin_parser.merge_def_lef1(
            Pin_parser.merge_def_lef(
                Pin_parser.parse_def(def_file_path),
                Pin_parser.parse_lef(lef_file_path)
            ),
            Pin_parser.parse_lef(lef_file_path)
        )

        # Prepare the result
        return {
            "Timing_Data": filedata,
            "Diearea": obj.get("diearea"),
            "Cell_Data": obj.get("components"),
            "Ports_Data": obj.get("ports"),
            "Wires_Data": obj.get("nets"),
            "Paths_Data": obj_Path,
            "Net_Path": obj_NetPath,
            "Pins_Data": obj_Pins
        }
    else:
        return {"error": "Required files not provided."}
