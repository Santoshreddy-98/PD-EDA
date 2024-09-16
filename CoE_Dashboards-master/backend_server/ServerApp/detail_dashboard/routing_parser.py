import re
from collections import defaultdict
import os
import json
import logging

logger = logging.getLogger('detaildashboard')

class RoutingParser:
    def __init__(self, mergedPath):
        self.common_path = mergedPath

        self.filePattern = {
            'qor_pattern': re.compile(r'.*qor.*\.rpt', re.MULTILINE | re.DOTALL | re.IGNORECASE),
            'congestion_pattern': re.compile(r'.*congestion.*\.rpt', re.MULTILINE | re.DOTALL | re.IGNORECASE),
        }

        self.routingPattern = {
            'net_length': re.compile(r'Net Length:\s+(\d+(\.\d+)?)', re.MULTILINE | re.DOTALL),
            'total_no_counts': re.compile(r'Total Number of Nets:\s+(\d+(\.\d+)?)', re.MULTILINE | re.DOTALL)
        }

        #
        self.congestionPattern = {
            'pattern': re.compile(r'\(([\d. ]+)%\)'),
            'both_dir': re.compile(r'^Both Dirs \| (.*?)(?: \| (\d+(\.\d+)?))*$'),
            'horz_route': re.compile(r'^H routing \| (.*?)(?: \| (\d+(\.\d+)?))*$'),
            'vert_route': re.compile(r'^V routing \| (.*?)(?: \| (\d+(\.\d+)?))*$')
        }

        self.final_route = defaultdict(dict)
        # ******** qor report *********
        self.route_report_data = defaultdict(dict)
        # ******** congestion report *********
        self.congestion_report_data = defaultdict(dict)

    def file_reading_list(self, filePath):
        try:
            with open(filePath, 'r') as file:
                return file.readlines()
        except Exception as e:
            logger.error(f"Error reading file: {str(e)}")
            return []
        

    def file_reading(self, filePath):
        try:
            with open(filePath, 'r') as file:
                return file.read()
        except Exception as e:
            logger.error(f"Error reading file: {str(e)}")
            return []
        

    def qor_report(self, qorPath):
        try:
            qor_content = self.file_reading_list(qorPath)
            for i, line in enumerate(qor_content, start=1):
                matchNetLength = self.routingPattern['net_length'].search(line)
                matchNetCount = self.routingPattern['total_no_counts'].search(line)
                if matchNetLength:
                    self.route_report_data['net_length'] = {
                        'lineNumber': i,
                        'path': qorPath,
                        'value': matchNetLength.group(1)
                    }

                if matchNetCount:
                    self.route_report_data['net_count'] = {
                        'lineNumber': i,
                        'path': qorPath,
                        'value': matchNetCount.group(1)
                    }

                    break

            self.route_report_data['net_length'] = self.route_report_data.get('net_length', {
                "lineNumber": "-",
                "path": "-",
                "value": "-"
            })
            self.route_report_data['net_count'] = self.route_report_data.get('net_count', {
                "lineNumber": "-",
                "path": "-",
                "value": "-"
            })

            self.final_route['Routing'] = dict(self.route_report_data)

            # Log successful extraction
            logger.info(f"QOR report processed successfully for path: {qorPath}")

        except Exception as e:
            # Log the exception
            logger.error(f"An error occurred while processing QOR report for path {qorPath}: {str(e)}")

    def congestion_report(self, congestionPath):
        try:
            congestion_content = self.file_reading_list(congestionPath)
            for i, line in enumerate(congestion_content, start=1):
                val_both = self.congestionPattern['both_dir'].search(line)
                val_horz = self.congestionPattern['horz_route'].search(line)
                val_vert = self.congestionPattern['vert_route'].search(line)

                if val_both:
                    data = val_both.group(1)
                    match = self.congestionPattern['pattern'].search(data)
                    if match:
                        self.congestion_report_data['Both%'] = {
                            'lineNumber': i,
                            'path': congestionPath,
                            'value': match.group(1)
                        }

                if val_horz:
                    data = val_horz.group(1)
                    match = self.congestionPattern['pattern'].search(data)
                    if match:
                        self.congestion_report_data['Horz%'] = {
                            'lineNumber': i,
                            'path': congestionPath,
                            'value': match.group(1)
                        }

                if val_vert:
                    data = val_vert.group(1)
                    match = self.congestionPattern['pattern'].search(data)
                    if match:
                        self.congestion_report_data['Vert%'] = {
                            'lineNumber': i,
                            'path': congestionPath,
                            'value': match.group(1)
                        }

            self.congestion_report_data['Both%'] = self.congestion_report_data.get('Both%', {
                "lineNumber": "-",
                "path": "-",
                "value": "-"
            })
            self.congestion_report_data['Horz%'] = self.congestion_report_data.get('Horz%', {
                "lineNumber": "-",
                "path": "-",
                "value": "-"
            })
            self.congestion_report_data['Vert%'] = self.congestion_report_data.get('Vert%', {
                "lineNumber": "-",
                "path": "-",
                "value": "-"
            })

            self.final_route['Congestion'] = dict(self.congestion_report_data)

            # Log successful extraction
            logger.info(f"Congestion report processed successfully for path: {congestionPath}")
            return dict(self.final_route)

        except Exception as e:
            # Log the exception
            logger.error(f"An error occurred while processing Congestion report for path {congestionPath}: {str(e)}")

        

    def qor_not_matched(self):
        self.route_report_data['net_length'] = self.route_report_data.get('net_length', {
            "lineNumber": "-",
            "path": "-",
            "value": "-"
        })
        self.route_report_data['net_count'] = self.route_report_data.get('net_count', {
            "lineNumber": "-",
            "path": "-",
            "value": "-"
        })
        self.final_route['Routing'] = dict(self.route_report_data)

    def congestion_not_matched(self):
        self.congestion_report_data['Both%'] = self.congestion_report_data.get('Both%', {
            "lineNumber": "-",
            "path": "-",
            "value": "-"
        })
        self.congestion_report_data['Horz%'] = self.congestion_report_data.get('Horz%', {
            "lineNumber": "-",
            "path": "-",
            "value": "-"
        })
        self.congestion_report_data['Vert%'] = self.congestion_report_data.get('Vert%', {
            "lineNumber": "-",
            "path": "-",
            "value": "-"
        })
        self.final_route['Congestion'] = dict(self.congestion_report_data)
        return self.final_route

    def file_checker(self):
        try:
            all_files = os.listdir(self.common_path)
            matching_filenames = {
                pattern_name: ', '.join([
                    filename for filename in all_files if pattern.match(filename)])
                for pattern_name, pattern in self.filePattern.items()
            }

            if matching_filenames.get('qor_pattern'):
                self.qor_report(os.path.join(
                    self.common_path, matching_filenames.get('qor_pattern')))
            else:
                self.qor_not_matched()
                logger.warning("No file matched the QOR pattern.")

            if matching_filenames.get('congestion_pattern'):
                congestion = self.congestion_report(os.path.join(
                    self.common_path, matching_filenames.get('congestion_pattern')))
                return congestion
            else:
                congestion = self.congestion_not_matched()
                logger.warning("No file matched the Congestion pattern.")
                return congestion

        except Exception as e:
            # Log the exception
            logger.error(f"An error occurred while checking files: {str(e)}")

