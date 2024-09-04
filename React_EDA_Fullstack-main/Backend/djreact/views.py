from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
# from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
import json
import pandas as pd

# ****** Pharser, Models, Serializers file import *******
from .models import Paths, EdaFile
from .serializers import PyToDb, FileSerializer
from . import parser
from .def_parser import *
from . import TimingPath, Net_Paths, Pin_parser



# ****** file import Ends here *******

ALLDATA = {}


class PostView(APIView):

    def get(self, request,*args, **kwargs):
        
        file_serializer = FileSerializer(data=request.data)
        
        if not file_serializer.is_valid():
            print("=====>",file_serializer.data.get("fileDef_Data"))
            
            # obj = f1(merge_def_lef(parse_def1(file_serializer.data.get("fileDef_Data").strip("/")), lef_parser(
            #         file_serializer.data.get("fileLef_Data").strip("/"))), parse_def3(file_serializer.data.get("fileDef_Data").strip("/")))
            
            # print(obj)
            return Response(file_serializer.data.get("fileDef_Data"))
        

    def post(self, request, *args, **kwargs):
        # posts_serializer = PostSerializer(data = request.data)
        file_serializer = FileSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            TIMING_REPORT = file_serializer.data.get("fileTiming_Data").strip("/")

            filedata = parser.parse_timing(TIMING_REPORT)

            PATH = Paths.objects.all()
            PATH.delete()
            file_1 = parser.parse_timing_1(TIMING_REPORT)

            reader = pd.read_csv(file_1)
            for _, row in reader.iterrows():
                new_file = Paths(
                    path=row['path'],
                    data=row["data"],
                )
                new_file.save()
            obj = f1(merge_def_lef(parse_def1(file_serializer.data.get("fileDef_Data").strip("/")), lef_parser(
                file_serializer.data.get("fileLef_Data").strip("/"))), parse_def3(file_serializer.data.get("fileDef_Data").strip("/")))

            
            obj_Path =  TimingPath.parse_timing(TIMING_REPORT)
            obj_NetPath = Net_Paths.parse_timing(TIMING_REPORT)
            obj_Pins = Pin_parser.merge_def_lef1(Pin_parser.merge_def_lef(Pin_parser.parse_def(file_serializer.data.get("fileDef_Data").strip("/")), Pin_parser.parse_lef(file_serializer.data.get("fileLef_Data").strip("/"))),Pin_parser.parse_lef(file_serializer.data.get("fileLef_Data").strip("/")))
            print(obj_Pins)
            
            return Response({"Timging_Data": filedata, "Diearea" : obj.get("diearea") , 
                            "Cell_Data": obj.get("components"), "Ports_Data": obj.get("ports"),
                            "Wires_Data": obj.get("nets"), "Paths_Data" : obj_Path,
                            "Net_Path" : obj_NetPath,"Pins_Data" : obj_Pins }, 
                            status=status.HTTP_201_CREATED)
        else:
            print('error', file_serializer.errors)
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def Timing_Data(request, pk):
    product = Paths.objects.get(path=pk)
    # obj = Paths.objects.get(pk=pk)
    # print(obj)
    serializer = PyToDb(product, many=False)

    print('===>>>>', product.data)
    a = serializer.data.get("data").strip("[ ]").split(",")

    print(a)

    return Response(a, status=status.HTTP_201_CREATED)


# @api_view(['GET'])
# def dieArea(request):
#     return Response(ALLDATA, status=status.HTTP_201_CREATED)
