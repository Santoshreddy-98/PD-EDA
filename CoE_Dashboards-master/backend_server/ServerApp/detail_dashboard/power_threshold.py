import re
import logging

# Configure logger
logger = logging.getLogger('detaildashboard')


class DesignFileParser:
    def __init__(self, path, corner):
        # Initialize the DesignFileParser
        self.path = path
        self.corner = corner
        # Defining regular expressions for pattern matching for the QOR file
        self.cell_area_pattern = re.compile(
            r'^Cell Area \(netlist\)\s*:\s*([\d.]+)')
        self.all_cell_count_pattern = re.compile(
            r'^Leaf Cell Count\s*:\s*([\d.]+)')
        self.comb_cell_count_pattern = re.compile(
            r'^Combinational Cell Count\s*:\s*([\d.]+)')
        self.seq_cell_count_pattern = re.compile(
            r'^Sequential Cell Count\s*:\s*([\d.]+)')
        self.bufInv_cell_count_pattern = re.compile(
            r'^Buf/Inv Cell Count\s*:\s*([\d.]+)')
        self.macro_cell_count_pattern = re.compile(
            r'^Macro Count\s*:\s*([\d.]+)')
        self.clk_bufInv_count_pattern = re.compile(
            r'^CT Buf/Inv Cell Count\s*:\s*([\d.]+)')
        self.clk_gates_count_pattern = re.compile(
            r'^Integrated Clock-Gating Cell Count\s*:\s*([\d.]+)')
        self.comb_cell_area_pattern = re.compile(
            r'^Combinational Area\s*:\s*([\d.]+)')
        self.seq_cell_area_pattern = re.compile(
            r'^Noncombinational Area\s*:\s*([\d.]+)')
        self.bufInv_cell_area_pattern = re.compile(
            r'^Buf/Inv Area\s*:\s*([\d.]+)')
        self.macro_cell_area_pattern = re.compile(
            r'^Macro/Black Box Area\s*:\s*([\d.]+)')
        self.mbit_cell_flops_pattern = re.compile(
            r'^Multi-bit Sequential Cell Count\s*:\s*([\d.]+)')
        self.ratio_cell_flops_pattern = re.compile(
            r'^Sequential Cell Banking Ratio\s*:\s*([\d.]+)')
        self.utilization_pattern = re.compile(
            r'^Utilization Ratio\s*:\s*([\d.]+)')

        # Regular expressing for POWER file pattern matching
        self.Svt_pattern = re.compile(r'^Svt\s*:\s*([\d.]+)')
        self.Lvtll_pattern = re.compile(r'^Lvtll\s*:\s*([\d.]+)')
        self.Lvt_pattern = re.compile(r'^Lvt\s*:\s*([\d.]+)')
        self.Ulvtll_pattern = re.compile(r'^Ulvtll\s*:\s*([\d.]+)')
        self.Ulvt_pattern = re.compile(r'^Ulvt\s*:\s*([\d.]+)')
        self.Ulvt_percent_pattern = re.compile(r'^Ulvt_%\s*:\s*([\d.]+)')
        self.Ulvtll_percent_pattern = re.compile(r'^Ulvtll %\s*:\s*([\d.]+)')
        self.Lvt_percent_pattern = re.compile(r'^Lvt_%\s*:\s*([\d.]+)')
        self.Svt_percent_pattern = re.compile(r'^Svt %\s*:\s*([\d.]+)')
        self.Lvtll_percent_pattern = re.compile(r'^Lvtll %\s*:\s*([\d.]+)')
        self.Clk_pattern = re.compile(r'^Clk\s*:\s*([\d.]+)')

    def parse_qor_file(self):
        # Initialize the design_info dictionary to store parsed data
        design_info = {
            "cell:Count": {
                "all": {"value": None, "lineNumber": None, "path": None},
                "Comb": {"value": None, "lineNumber": None, "path": None},
                "Seq": {"value": None, "lineNumber": None, "path": None},
                "Buf/Inv": {"value": None, "lineNumber": None, "path": None},
                "Hold_Buf/Inv": {"value": None, "lineNumber": None, "path": None},
                "Unclocked_Seqs": {"value": None, "lineNumber": None, "path": None},
                "Macro": {"value": None, "lineNumber": None, "path": None},
                "Clk_Buf/Inv": {"value": None, "lineNumber": None, "path": None},
                "Clk_Gates": {"value": None, "lineNumber": None, "path": None}
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
                "Ratio": {"value": None, "lineNumber": None, "path": None}
            }
        }

        # Open and read the file
        with open(self.path, 'r') as file:
            for line_number, line in enumerate(file, start=1):
                all_cell_count_match = self.all_cell_count_pattern.search(
                    line.strip())
                if all_cell_count_match:
                    std_cell_count = float(all_cell_count_match.group(1))
                    design_info["cell:Count"]["all"]['value'] = std_cell_count
                    design_info["cell:Count"]["all"]["lineNumber"] = line_number
                    design_info["cell:Count"]["all"]["path"] = self.path
                combi_cell_count_match = self.comb_cell_count_pattern.search(
                    line.strip())

                if combi_cell_count_match:
                    combi_cell_count = float(combi_cell_count_match.group(1))
                    design_info["cell:Count"]["Comb"]['value'] = combi_cell_count
                    design_info["cell:Count"]["Comb"]["lineNumber"] = line_number
                    design_info["cell:Count"]["Comb"]["path"] = self.path
                seq_cell_count_match = self.seq_cell_count_pattern.search(
                    line.strip())

                if seq_cell_count_match:
                    seq_cell_count = float(seq_cell_count_match.group(1))
                    design_info["cell:Count"]["Seq"]['value'] = seq_cell_count
                    design_info["cell:Count"]["Seq"]["lineNumber"] = line_number
                    design_info["cell:Count"]["Seq"]["path"] = self.path

                bufInv_cell_count_match = self.bufInv_cell_count_pattern.search(
                    line.strip())
                if bufInv_cell_count_match:
                    bufInv_cell_count = float(bufInv_cell_count_match.group(1))
                    design_info["cell:Count"]["Buf/Inv"]['value'] = bufInv_cell_count
                    design_info["cell:Count"]["Buf/Inv"]["lineNumber"] = line_number
                    design_info["cell:Count"]["Buf/Inv"]["path"] = self.path

                macro_cell_count_match = self.macro_cell_count_pattern.search(
                    line.strip())
                if macro_cell_count_match:
                    macro_cell_count = float(macro_cell_count_match.group(1))
                    design_info["cell:Count"]["Macro"]['value'] = macro_cell_count
                    design_info["cell:Count"]["Macro"]["lineNumber"] = line_number
                    design_info["cell:Count"]["Macro"]["path"] = self.path

                clk_bufInv_count_match = self.clk_bufInv_count_pattern.search(
                    line.strip())
                if clk_bufInv_count_match:
                    clk_bufInv_count = float(clk_bufInv_count_match.group(1))
                    design_info["cell:Count"]["Clk_Buf/Inv"]['value'] = clk_bufInv_count
                    design_info["cell:Count"]["Clk_Buf/Inv"]["lineNumber"] = line_number
                    design_info["cell:Count"]["Clk_Buf/Inv"]["path"] = self.path

                clk_gates_count_match = self.clk_gates_count_pattern.search(
                    line.strip())
                if clk_gates_count_match:
                    clk_gates_count = float(clk_gates_count_match.group(1))
                    design_info["cell:Count"]["Clk_Gates"]['value'] = clk_gates_count
                    design_info["cell:Count"]["Clk_Gates"]["lineNumber"] = line_number
                    design_info["cell:Count"]["Clk_Gates"]["path"] = self.path

                cell_area_match = self.cell_area_pattern.search(line.strip())
                if cell_area_match:
                    design_info["cell:Area"]["all"]["value"] = float(
                        cell_area_match.group(1))
                    design_info["cell:Area"]["all"]["lineNumber"] = line_number
                    design_info["cell:Area"]["all"]["path"] = self.path

                comb_cell_area_macth = self.comb_cell_area_pattern.search(
                    line.strip())
                if comb_cell_area_macth:
                    design_info["cell:Area"]["Comb"]["value"] = float(
                        comb_cell_area_macth.group(1))
                    design_info["cell:Area"]["Comb"]["lineNumber"] = line_number
                    design_info["cell:Area"]["Comb"]["path"] = self.path

                seq_cell_area_match = self.seq_cell_area_pattern.search(
                    line.strip())
                if seq_cell_area_match:
                    design_info["cell:Area"]["Seq"]["value"] = float(
                        seq_cell_area_match.group(1))
                    design_info["cell:Area"]["Seq"]["lineNumber"] = line_number
                    design_info["cell:Area"]["Seq"]["path"] = self.path

                bufInv_cell_area_macth = self.bufInv_cell_area_pattern.search(
                    line.strip())
                if bufInv_cell_area_macth:
                    design_info["cell:Area"]["Buf/Inv"]["value"] = float(
                        bufInv_cell_area_macth.group(1))
                    design_info["cell:Area"]["Buf/Inv"]["lineNumber"] = line_number
                    design_info["cell:Area"]["Buf/Inv"]["path"] = self.path

                macro_cell_area_match = self.macro_cell_area_pattern.search(
                    line.strip())
                if macro_cell_area_match:
                    design_info["cell:Area"]["Macro"]["value"] = float(
                        macro_cell_area_match.group(1))
                    design_info["cell:Area"]["Macro"]["lineNumber"] = line_number
                    design_info["cell:Area"]["Macro"]["path"] = self.path

                mbit_cell_flops_match = self.mbit_cell_flops_pattern.search(
                    line.strip())
                if mbit_cell_flops_match:
                    design_info["cell:Flops"]["Mbit_flop%"]["value"] = float(
                        mbit_cell_flops_match.group(1))
                    design_info["cell:Flops"]["Mbit_flop%"]["lineNumber"] = line_number
                    design_info["cell:Flops"]["Mbit_flop%"]["path"] = self.path

                ratio_cell_flops_match = self.ratio_cell_flops_pattern.search(
                    line.strip())
                if ratio_cell_flops_match:
                    design_info["cell:Flops"]["Ratio"]["value"] = str(
                        ratio_cell_flops_match.group(1))
                    design_info["cell:Flops"]["Ratio"]["lineNumber"] = line_number
                    design_info["cell:Flops"]["Ratio"]["path"] = self.path
        logger.info("Design info parsed successfully")
        return design_info

    def parse_threshold_file(self):
        #  Initialize the power dictionary to store parsed data
        power = {
            "Svt": {
                "value": "-",
                "lineNumber": "-",
                "path": "-"
            },
            "Lvtll": {
                "value": "-",
                "lineNumber": "-",
                "path": "-"
            },
            "Lvt": {
                "value": "-",
                "lineNumber": "-",
                "path": "-"
            },
            "Ulvtll": {
                "value": "-",
                "lineNumber": "-",
                "path": "-"
            },
            "Ulvt": {
                "value": "-",
                "lineNumber": "-",
                "path": "-"
            },
            "Ulvt%": {
                "value": "-",
                "lineNumber": "-",
                "path": "-"
            },
            "Ulvtll%": {
                "value": "-",
                "lineNumber": "-",
                "path": "-"
            },
            "Lvt_%": {
                "value": "-",
                "lineNumber": "-",
                "path": "-"
            },
            "Svt%": {
                "value": "-",
                "lineNumber": "-",
                "path": "-"
            },
            "Lvtll%": {
                "value": "-",
                "lineNumber": "-",
                "path": "-"
            },
            "Clk": {
                "value": "-",
                "lineNumber": "-",
                "path": "-"
            },
        }
        # Open and read the file
        with open(self.path, 'r') as file:
            inside_cell_area_report = False
            for line_number, line in enumerate(file, start=1):
                line = line.strip()  # Strip leading and trailing whitespaces
                if line.startswith("Cell Area Report"):
                    inside_cell_area_report = True  # Reset the flag
                elif line.startswith("Total"):
                    inside_cell_area_report = False
                elif inside_cell_area_report:
                    lvt_match = re.match(
                        r'LVT\s+(\d+\.\d+)\s+\((\d+\.\d+)%\)', line)
                    svt_match = re.match(
                        r'SVT\s+(\d+\.\d+)\s+\((\d+\.\d+)%\)', line)
                    ulvt_match = re.match(
                        r'ULVT\s+(\d+\.\d+)\s+\((\d+\.\d+)%\)', line)

                    if lvt_match:
                        power['Lvt']['value'] = lvt_match.group(1)
                        power['Lvt']['lineNumber'] = line_number
                        power['Lvt']['path'] = self.path
                        power['Lvt_%']['value'] = lvt_match.group(2)
                        power['Lvt_%']['lineNumber'] = line_number
                        power['Lvt_%']['path'] = self.path
                    elif svt_match:
                        power['Svt']['value'] = svt_match.group(1)
                        power['Svt']['lineNumber'] = line_number
                        power['Svt']['path'] = self.path
                        power['Svt%']['value'] = svt_match.group(2)
                        power['Svt%']['lineNumber'] = line_number
                        power['Svt%']['path'] = self.path
                    elif ulvt_match:
                        power['Ulvt']['value'] = ulvt_match.group(1)
                        power['Ulvt']['lineNumber'] = line_number
                        power['Ulvt']['path'] = self.path
                        power['Ulvt']
                        power['Ulvt%']['value'] = ulvt_match.group(2)
                        power['Ulvt%']['lineNumber'] = line_number
                        power['Ulvt%']['path'] = self.path
        logger.info("Parsed the power_thresold file")
        return power

    def parse_power_file(self):
        # Initialize the data dictionary to store parsed data
        data = {
            "Internal_power": {
                "value": None,
                "lineNumber": None,
                "path": None
            },
            "Switching_power": {
                "value": None,
                "lineNumber": None,
                "path": None
            },
            "Leakage_power": {
                "value": None,
                "lineNumber": None,
                "path": None
            },
            "Total_count": {
                "value": None,
                "lineNumber": None,
                "path": None
            }
        }

        total_count = 0
        with open(self.path, 'r') as file:
            found_scenario = False
            for line_number, line in enumerate(file, start=1):
                if found_scenario:
                    # Check for specific patterns and update the data dictionary
                    if line.startswith('Total'):
                        total_count += 1

                        if total_count == 2:
                      
                            pattern = r'((?:\d+(?:\.\d+)?(?:e[+-]?\d+)?\s*[a-zA-Z]+)|N/A)'
                            matches = re.findall(pattern, line)

                            filtered_matches = [
                                match for match in matches if match]
                            data["Internal_power"]["value"] = (
                                0 if filtered_matches[0] == 'N/A' else round(float(filtered_matches[0].split()[0]) * 1e-9, 6))
                            data["Internal_power"]["lineNumber"] = line_number
                            data["Internal_power"]["path"] = self.path
                            data["Switching_power"]["value"] = (
                                0 if filtered_matches[1] == 'N/A' else round(float(filtered_matches[1].split()[0]) * 1e-9, 6))
                            data["Switching_power"]["lineNumber"] = line_number
                            data["Switching_power"]["path"] = self.path
                            data["Leakage_power"]["value"] = (
                                0 if filtered_matches[2] == 'N/A' else round(float(filtered_matches[2].split()[0]) * 1e-9, 6))
                            data["Leakage_power"]["lineNumber"] = line_number
                            data["Leakage_power"]["path"] = self.path
                            data["Total_count"]["value"] = (
                                0 if filtered_matches[3] == 'N/A' else round(float(filtered_matches[3].split()[0]) * 1e-9, 6))
                            data["Total_count"]["lineNumber"] = line_number
                            data["Total_count"]["path"] = self.path
                            break
                elif self.corner in line:
                    found_scenario = True
        logger.info("Parsed the power file")
        return data

    def utilization(self):
        # Initialize the u_data dictionary to store parsed data
        u_data = {
            "value": "-",
            "lineNumber": "-",
            "path": "-"
        }
        with open(self.path, 'r') as file:
            for line_number, line in enumerate(file, start=1):
                line = line.strip()
                utilization_match = self.utilization_pattern.search(line)
                if utilization_match:
                    u_data["value"] = float(utilization_match.group(1))
                    u_data["lineNumber"] = line_number
                    u_data["path"] = self.path
        logger.info("Utilization file found and parsed")
        return u_data
