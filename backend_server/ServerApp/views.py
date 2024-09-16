# views.py
# latest code -06/12/2023

import os
import json
import logging
import re
from datetime import datetime
import pytz
from collections import defaultdict
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import DashboardParser, DetailDashboarParser
from .serializers import DashboardSerialzer, DetailDashboardSerializer
from .detail_dashboard.main import MainController
from .chart_data.chart_parser import Chart
from django.shortcuts import get_object_or_404
from .eda_parsers import main_parser
from concurrent.futures import ThreadPoolExecutor, as_completed

# logger = logging.getLogger(__name__)
django_logger = logging.getLogger('django')
tz = pytz.timezone('Asia/Kolkata')



class ChartList(APIView):
    """
    API endpoint to retrieve chart data based on parameters.

    Parameters:
    - param1: Identifier for the main dashboard document.
    - param2: Partition name for filtering data.

    Returns:
    - JSON response with chart data.
    """

    def get(self, request, format=None):
        try:
            param1 = request.GET.get('param1', None)
            param2 = request.GET.get('param2', None)

            if param1 is not None and param2 is not None:
                # Query MysqlDB for the specified main dashboard document
                data = DetailDashboarParser.objects.filter(id=param1)

                if data:
                    # Serialize the data
                    serializer = DetailDashboardSerializer(data, many=True)
                    serialized_data = serializer.data

                    # Filter content based on Partition_Name
                    values_for_smarph1 = [
                        item for item in serialized_data[0]['content'] if item['Partition_Name'] == param2]

                    # Process data using Chart class
                    chart_value = Chart(values_for_smarph1)
                    chart_final_data = chart_value.chart_data_converter()

                    django_logger.info("Successfully retrieved chart data ChartList")
                    return Response(chart_final_data, status=status.HTTP_200_OK)
                else:
                    django_logger.error("Data not found ChartList")
                    return Response("Data not found", status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            django_logger.error(f"Error accessing DB data: {str(e)}")
            return Response(f"Error accessing DB data: {str(e)}", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateDataETAView(APIView):
    def put(self, request):
        current_time = datetime.now(tz)
        """
        API endpoint to update ETA data in the database.

        PUT:
        - Updates ETA data for a specific entry.

        Parameters:
        - id: The ID of the document.
        - S_no: The serial number of the entry.
        - eta: The new ETA value.

        Returns:
        - JSON response indicating success or failure.
        """
        try:
            # Extract data from the request
            request_data = request.data
            object_id = request_data.get('id')
            sl_no = request_data.get('S_no')
            user = request_data.get('user')
            eta = request_data.get('eta')

            # Get the document from MySQL database
            doc = get_object_or_404(DashboardParser, id=object_id)
            
            entries = doc.content

            # Update ETA data in the document
            for entry in entries:
                if entry['S_no'] == sl_no:
                    entry['ETA'] = eta
                    entry['pre_ETA'].append(
                        {"ETA": eta, "user": user, "timestamp": current_time.strftime("%Y-%m-%d %H:%M:%S")})

            # Save the updated document
            doc.save()

            # Serialize the updated document
            serializer = DashboardSerialzer(
                instance=doc, data={'content': doc.content}, partial=True)

            if serializer.is_valid():
                serializer.save()
                django_logger.info(
                    'Successfully updated ETA data in MySQL database')
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                # Log if the data is invalid
                django_logger.error(
                    f'Invalid data in ETA update: {serializer.errors}')
                return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Log any other unexpected errors
            error_message = f"Error: {str(e)}"
            django_logger.error(error_message)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateDataPLAView(APIView):

    def put(self, request):
        """
        API endpoint to update Plan of Action (PLA) data in the database.

        PUT:
        - Updates PLA data for a specific entry.

        Parameters:
        - id: The ID of the document.
        - S_no: The serial number of the entry.
        - pla: The new PLA value.

        Returns:
        - JSON response indicating success or failure.
        """
        current_time = datetime.now(tz)
        try:
            # Extract data from the request
            request_data = request.data
            object_id = request_data.get('id')
            sl_no = request_data.get('S_no')
            user = request_data.get('user')
            pla = request_data.get('pla')

            # Get the document from MySQL database
            doc = get_object_or_404(DashboardParser, id=object_id)
            
            entries = doc.content

            # Update PLA data in the document
            for entry in entries:
                if entry['S_no'] == sl_no:
                    entry['Plan_of_Action'] = pla
                    entry['pre_PLA'].append(
                        {"PLA": pla, "user": user, "timestamp": current_time.strftime("%Y-%m-%d %H:%M:%S")})

            # Save the updated document
            doc.save()

            # Serialize the updated document
            serializer = DashboardSerialzer(
                instance=doc,  data={'content': doc.content}, partial=True)

            if serializer.is_valid():
                serializer.save()
                django_logger.info(
                    'Successfully updated PLA data in MySQL database')
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                # Log if the data is invalid
                django_logger.error(
                    f'Invalid data in PLA update: {serializer.errors}')
                return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Log any other unexpected errors
            error_message = f"Error: {str(e)}"
            django_logger.error(error_message)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateDataCommentsView(APIView):

    def put(self, request):
        """
        API endpoint to update Comments data in the database.

        PUT:
        - Updates Comments data for a specific entry.

        Parameters:
        - id: The ID of the document.
        - S_no: The serial number of the entry.
        - comment: The new comment.

        Returns:
        - JSON response indicating success or failure.
        """
        current_time = datetime.now(tz)
        try:
            # Extract data from the request
            request_data = request.data
            object_id = request_data.get('id')
            sl_no = request_data.get('S_no')
            user = request_data.get('user')
            comment = request_data.get('comment')
            # Get the document from MySQL database
            doc = get_object_or_404(DashboardParser, id=object_id)
            
            entries = doc.content

            # Update Comments data in the document
            for entry in entries:
                if entry['S_no'] == sl_no:
                    entry['Comments'] = comment
                    entry['pre_info'].append(
                        {"comment": comment, "user": user, "timestamp": current_time.strftime("%Y-%m-%d %H:%M:%S")})
 
            # Save the updated document
            doc.save()

            # Serialize the updated document
            serializer = DashboardSerialzer(
                instance=doc, data={'content': doc.content}, partial=True)

            if serializer.is_valid():
                serializer.save()
                django_logger.info(
                    'Successfully updated Comments data in MySQL database')
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                # Log if the data is invalid
                django_logger.error(
                    f'Invalid data in Comments update: {serializer.errors}')
                return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Log any other unexpected errors
            error_message = f"Error: {str(e)}"
            django_logger.error(error_message)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# *********** Main Dashboard **********
class MainDashboard(APIView):
    def get(self, request, format=None):
        """
        API endpoint to retrieve data from the main dashboard.

        GET:
        - Fetches all data from the main dashboard.

        Returns:
        - JSON response containing the data from the main dashboard.
        """
        try:
            # Retrieve all documents from MySQL database
            documents = DashboardParser.objects.all()

            # Serialize the data
            serializer_data = DashboardSerialzer(documents, many=True)

            # Return the serialized data in the response
            return Response(serializer_data.data, status=status.HTTP_200_OK)

        except DetailDashboarParser.DoesNotExist:
            # Log if the document is not found
            django_logger.error("Main Dashboard document not found")
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            # Log any other unexpected errors
            error_message = f"Error: {str(e)}"
            django_logger.error(error_message)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SelectMainRun(APIView):
    def get(self, request, format=None):
        """
        API endpoint to retrieve data from the main dashboard based on the provided ID.

        GET:
        - Fetches data from the main dashboard using the provided ID.

        Returns:
        - JSON response containing the serialized data from the main dashboard.
        """
        try:
            # Get the 'param1' value from the request parameters
            param1 = request.GET.get('param1', None)

            if param1 is not None:
                # Fetch data from MySQL database based on the provided ID
                data = get_object_or_404(DashboardParser, id=param1)

                if data:
                    # Serialize the data
                    serializer = DashboardSerialzer(data)

                    # Get the serialized data
                    serialized_data = serializer.data

                    # Return the serialized data in the response
                    return Response(serialized_data, status=status.HTTP_200_OK)
                else:
                    # Log if data is not found
                    django_logger.error("Data not found")
                    return Response("Data not found", status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            # Log any unexpected errors
            error_message = f"Error: {str(e)}"
            django_logger.error(error_message)
            return Response(f"Error accessing MySQL data: {str(e)}", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ***********  Detail Dashboard ************
def execute_concurrently(mainObj, pro_checker):
    
    with ThreadPoolExecutor(max_workers=2) as executor:
        futures = {
            executor.submit(mainObj.run_main): "parsed_data",
            executor.submit(main_parser.process_files, pro_checker['Input']): "timing_data"
        }
        
        results = {}
        for future in as_completed(futures):
            
            name = futures[future]
    
            try:
                results[name] = future.result()
            except Exception as exc:
                logging.error(f'{name} generated an exception: {exc}')
                results[name] = {"error": str(exc)}
    # print(results)
    return results['parsed_data'], results['timing_data']

class DetailDashboard(APIView):
    def post(self, request, format=None):
        request_data = request.data

        yaml_Data = request_data.get('FilePath')

        final_main_data = defaultdict(dict)
        list_of_main_data = list()
        
        count = 1

        if yaml_Data:
            try:
                mainObj = MainController(yaml_Data)
                pro_checker = mainObj.read_yaml_and_convert_to_json()
                project_name = pro_checker['Project']['Project_Name']
                
                
                detail_id = DetailDashboarParser.objects.filter(
                    project_name=pro_checker['Project']['Project_Name']).exists()

                if detail_id: 
                
                    detail_instance, _ = DetailDashboarParser.objects.get_or_create(
                        project_name=project_name)
                 
                    main_instance, _ = DashboardParser.objects.get_or_create(
                        project_name=project_name)
                 
                    parsed_data, timing_data = execute_concurrently(mainObj, pro_checker)
                    
                    
                    if "error" in parsed_data or "error" in timing_data:
                        return Response({
                            "success": False,
                            "message": "Error processing files.",
                            "details": {
                                "parsed_data_error": parsed_data.get("error"),
                                "timing_data_error": timing_data.get("error")
                            }
                        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                    # Update the existing instances' content
                    detail_instance.content = parsed_data[0]
                    main_instance.content = [
                        {
                            'S_no': count,
                            'Partition_Name': i["Partition_Name"],
                            'Lead': i['Lead'],
                            'Timing': i['Timing'],
                            'Congestion': i['Route']['Congestion']['Both%'],
                            'Utilization': i['Utilization'],
                            'Comments': '',
                            'ETA': '',
                            'Plan_of_Action': '',
                            'Directory': i['Directory'],
                            'pre_info': [],
                            'pre_PLA': [],
                            'pre_ETA': []
                        } for count, i in enumerate(parsed_data[0], start=1) if i.get('Stage') == 'route'
                    ]
                    
                    # Use serializers to validate and save the changes
                    detail_serializer = DetailDashboardSerializer(
                        detail_instance, data={'content': parsed_data[0], "timing_data": timing_data}, partial=True)
                    main_serializer = DashboardSerialzer(
                        main_instance, data={'content': main_instance.content}, partial=True)

                    if detail_serializer.is_valid() and main_serializer.is_valid():
                        detail_serializer.save()
                        main_serializer.save()

                        content_data = detail_serializer.data.get('content')

                        return Response({
                            "success": True,
                            "message": "Content updated successfully",
                            "detailDashboard_ID": detail_instance.id,
                            "mainDashboard_ID": main_instance.id,
                            "partition_stages": content_data[0].get('partition_stages')
                        }, status=status.HTTP_200_OK)
                    else:
                        return Response({
                            "success": False,
                            "errors": {
                                "detail_errors": detail_serializer.errors,
                                "main_errors": main_serializer.errors
                            }
                        }, status=status.HTTP_400_BAD_REQUEST)

                else:
                    
                    parsed_data, timing_data = execute_concurrently(mainObj, pro_checker)
                    
                    
                    if "error" in parsed_data or "error" in timing_data:
                        return Response({
                            "success": False,
                            "message": "Error processing files.",
                            "details": {
                                "parsed_data_error": parsed_data.get("error"),
                                "timing_data_error": timing_data.get("error")
                            }
                        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                    pattern = re.compile(rf'(\b[\w-]*route[\w-]*\b)', re.IGNORECASE)
                    for i in parsed_data[0]:
                        if pattern.search(i['Stage']):
                            final_main_data = {
                                'S_no': count,
                                'Partition_Name': i["Partition_Name"],
                                'Lead': i['Lead'],
                                'Timing': i['Timing'],
                                'Congestion': i['Route']['Congestion']['Both%'],
                                'Utilization': i['Utilization'],
                                'Comments': '',
                                'ETA': '',
                                'Plan_of_Action': '',
                                'Directory': i['Directory'],
                                'pre_info': [],
                                'pre_PLA': [],
                                'pre_ETA': []
                            }

                            list_of_main_data.append(final_main_data)
                            count += 1
                    
                    detail_data_store = {
                        "project_name": parsed_data[1],
                        'content': parsed_data[0],
                        "timing_data": timing_data
                    }

                    main_data_store = {
                        "project_name": parsed_data[1],
                        'content': list_of_main_data
                    }

                    serializer_DetailDashboard = DetailDashboardSerializer(
                        data=detail_data_store)
                
                    serializer_MainDashboard = DashboardSerialzer(
                        data=main_data_store)

                    if serializer_DetailDashboard.is_valid() and serializer_MainDashboard.is_valid():
                        serializer_DetailDashboard.save()
                        serializer_MainDashboard.save()
                        return Response({
                            "success": True,
                            "message": "Upload successful",
                            "mainDashboard_ID": serializer_MainDashboard.data['id'],
                            "detailDashboard_ID": serializer_DetailDashboard.data['id'],
                            "partition_stages": serializer_DetailDashboard.data['content'][0]['partition_stages']
                        }, status=status.HTTP_201_CREATED)
                    else:
                        # Return a JSON response indicating validation errors
                        return Response({
                            "success": False,
                            "errors": {
                                "detail_errors": serializer_DetailDashboard.errors,
                                "main_errors": serializer_MainDashboard.errors
                            }
                        }, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                error_message = f"Error: {str(e)}"
                logging.error(error_message)
                return Response({
                    "success": False,
                    "message": f"{str(e)}"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class Multirun(APIView):
    def get(self, request, format=None):
        """
        API endpoint to retrieve data for multiple runs.

        GET:
        - Retrieves data from DetailDashboarParser in MySQL.
        - Serializes the data and returns a JSON response.

        Returns:
        - JSON response containing data or an error message.
        """
        try:
            # Retrieve all documents from DetailDashboarParser
            documents = DetailDashboarParser.objects.all()
            django_logger.info("Successfully retrieved data for multiple runs")

            # Serialize the data
            serializer = DetailDashboardSerializer(documents, many=True)

            # Return the serialized data in the response
            return Response({"data": serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            error_message = "An error occurred while processing the request."
            django_logger.error(f"{error_message} Error: {str(e)}")
            return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SelectRun(APIView):
    def get(self, request, format=None):
        """
        API endpoint to select and retrieve data for a specific run.

        GET:
        - Retrieves data from DetailDashboarParser in MySQL based on the provided parameter.
        - Serializes the data and returns a JSON response.

        Returns:
        - JSON response containing data for the selected run or an error message.
        """
        try:
            # Get the value of the 'param1' parameter from the request
            param1 = request.GET.get('param1', None)

            if param1 is not None:
                # Retrieve data from DetailDashboarParser based on the provided parameter
                data = get_object_or_404(DetailDashboarParser, id=param1)

                if data:
                    # Serialize the data
                    serializer = DetailDashboardSerializer(data)
                    serialized_data = serializer.data
                    django_logger.info(
                        f"Successfully retrieved data for run: {param1}")
                    return Response(serialized_data, status=status.HTTP_200_OK)
                else:
                    django_logger.error("Data not found")
                    return Response("Data not found", status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            error_message = f"Error: {str(e)}"
            django_logger.error(error_message)
            return Response(f"Error accessing MongoDB data: {str(e)}", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CrossProbing(APIView):
    def access_dict_with_path(self, data, path):
        """
        Accesses a nested dictionary using a dot-separated path.

        Args:
        - data (dict): The dictionary to access.
        - path (str): Dot-separated path to access nested keys.

        Returns:
        - dict: A dictionary containing 'path' and 'lineNumber' values.
        """
        keys = path.split('.')  # Split the path into keys
        if not keys:
            return None  # Empty path
        result = {'path': None, 'lineNumber': None}
        for key in keys:
            if key in data:
                data = data[key]
            else:
                return None  # Key doesn't exist
        if 'path' in data:
            result['path'] = data['path']
        if 'lineNumber' in data:
            result['lineNumber'] = data['lineNumber']
        return result

    def post(self, request):
        """
        API endpoint to perform cross-probing.

        POST:
        - Reads the file content at the specified path.
        - Returns file content and line number.

        Returns:
        - JSON response containing file content and line number or an error message.
        """
        file_path = request.data
        path_data = file_path.get('data')
        path = file_path.get('path')
        convert_path = self.access_dict_with_path(path_data, path)
        django_logger.info(
            f"Received POST request with file path: {convert_path}")

        if convert_path:
            try:
                with open(convert_path['path'], 'r') as file:
                    file_content = file.read()
                django_logger.info("Successfully read file content in new tab")
                return Response({'content': file_content, 'lineNumber': convert_path['lineNumber']}, status=status.HTTP_200_OK)
            except FileNotFoundError:
                error_message = 'File not found'
                django_logger.error(error_message)
                return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            error_message = 'File path not provided'
            django_logger.error(error_message)
            return Response({'error': 'File path not provided'}, status=status.HTTP_400_BAD_REQUEST)
