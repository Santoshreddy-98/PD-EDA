# # import re

# # # Professional regex pattern to match .def, .lef, and any case variation of TIMING followed by optional characters and ending with .rpt
# # pattern = r'\.(def|lef)$|TIMING.*\.rpt'

# # # Example usage
# # test_strings = [
# #     "example.def",
# #     "file.lef",
# #     "report_timing_20.rpt",
    
# # ]

# # for test in test_strings:
# #     if re.search(pattern, test, re.IGNORECASE):
# #         print(f"Matched: {test}")
# #     else:
# #         print(f"Did not match: {test}")



import re

# Professional regex pattern to match .def, .lef, and any case variation of TIMING followed by optional characters and ending with .rpt
pattern = re.compile(r'\.(def|lef)$|TIMING.*\.rpt', re.IGNORECASE)

# Function to determine the dictionary key based on the file name
def get_dict_key(filename):
    if re.search(r'\.def$', filename, re.IGNORECASE):
        return "fileDef_Data"
    elif re.search(r'\.lef$', filename, re.IGNORECASE):
        return "fileLef_Data"
    elif re.search(r'TIMING.*\.rpt$', filename, re.IGNORECASE):
        return "fileTiming_Data"
    return None

# Example usage
test_strings = [
    "example.def",
    "file.lef",
    "report_timing_20.rpt",
    "another_file.TIMING_final.rpt"
]

# Dictionary to store the results
results_dict = {}

# Process each filename and update the dictionary
for filename in test_strings:
    if pattern.search(filename):
        key = get_dict_key(filename)
        if key:
            results_dict[key] = filename
           
      

# Print the final results
print("Results dictionary:", results_dict)


