import json
import pathlib
import numpy as np

a ='fulladder_feb21.def'
b='fulladder_V0.1.lef.txt'
c = 'fulladder_def_complete.json'

def parse_def1(input):
    main_dict1 = {}
    index_end = 0 
    components = []
    print('opening file in read mode')
    with open(input) as f:
        lines = f.readlines()
        print('iterating over each line')
        i=0 
        for line in lines:
            if line.startswith('VERSION'):
                line = line.split()
                main_dict1['VERSION'] = line[1]
            elif line.startswith('BUSBITCHARS'):
                line = line.strip().split(" ")
                new_list = [item.replace('"', '') for item in line]
                main_dict1['BUSBITCHARS'] = new_list[1]
            elif line.startswith('DIVIDERCHAR'):
                line = line.strip().split()
                new_list = [item.replace('"', '') for item in line]
                main_dict1['DIVIDERCHAR'] = new_list[1]
            elif line.startswith('DESIGN'):
                line = line.split()
                main_dict1['design'] = line[1]

            elif line.startswith('UNITS DISTANCE'):
                line1 = line.split(" ")
                main_dict1['unit_in_micron']=float(line1[3])
                # converting co-oradinate values
                mul_unit = main_dict1['unit_in_micron']*(10**-3)
                
            # getting line containing die area
            elif line.startswith('DIEAREA'):
                line1 = line.split(" ")
                # print(line1)
                if len(line1)<12:
                    main_dict1['diearea'] = {
                                        'x1':float(line1[2])*mul_unit,
                                        'y1':float(line1[3])*mul_unit,
                                        'x2':float(line1[6])*mul_unit,
                                        'y2':float(line1[7])*mul_unit
                                        }
                else:
                    main_dict1['diearea'] = {
                                            'x1':float(line1[2])*mul_unit,
                                            'y1':float(line1[3])*mul_unit,
                                            'x2':float(line1[6])*mul_unit,
                                            'y2':float(line1[7])*mul_unit,
                                            'x3':float(line1[10])*mul_unit,
                                            'y3':float(line1[11])*mul_unit,
                                            'x4':float(line1[14])*mul_unit,
                                            'y4':float(line1[15])*mul_unit
                                            }
                    
            # getting line containg COMPONENTS and getting start and end index
            elif line.startswith('COMPONENTS'):
                line1 = line.split(" ")
                index_start = lines.index(line)
                index_end = lines.index('END COMPONENTS\n')
                main_dict1['number_of_components']=int(line1[1])
            
            # lines containing component part with start and end index
            
            elif lines.index(line)<index_end and lines.index(line)>index_start:
                line3 = line.split()
                
                def parse_components(word):
                    if word in line3:
                        components.append({
                                    'Comp_id':i,
                                    'ref_name':line3[2],
                                    'instance_name':line3[1],
                                    'x':float(line3[line3.index(word)+2])*mul_unit,
                                    'y':float(line3[line3.index(word)+3])*mul_unit,
                                    'direction':line3[line3.index(word)+5]                           
                                    })
                def parse_components1(word):
                    if word in line3:
                        components.append({
                                    'Comp_id':i,
                                    'ref_name':line3[2],
                                    'instance_name':line3[1],
                                    'x':'-',
                                    'y':'-',
                                    'direction':'-'                           
                                    })
                
                
                parse_components('COVER')
                parse_components('FIXED')
                parse_components('PLACED')
                parse_components1('UNPLACED')
                i+=1
    main_dict1['components']=components
    main_json1 = json.dumps(main_dict1, indent=4)
    # print(main_json)
   
    # print('Number of components in DEF file: ',main_dict['number_of_components'])
    # print('Number of components parsed: ',len(components))
    # if len(main_dict)!=main_dict['number_of_components']:
    #     print('There are {} missing components'.format(main_dict['number_of_components']-len(main_dict['components'])))
    return main_json1   


def lef_parser(input):
    with open(input,'r') as input_file:
        input_content=input_file.readlines()
    cell_name=[]
    cell_size=[]
    pins =[]
    unit=[]
    data={}
    #function to seperate the data and store 
    def check_data(input_data,key_word,store_data):
        if input_data.strip().startswith(key_word):
            store_data.append(i.split()[1:])

    #iteration through the text file content       
    for i in input_content:
        if i.strip().startswith('DATABASE MICRON'):
            unit=float(i.split()[2])
        check_data(i,'MACRO',cell_name)
        check_data(i,'SIZE',cell_size)
        check_data(i,'PIN',pins)

    #creating the outfile in json format

    def clean_cell_size(input_data2, index_value):
    # Convert the joined string to a list of float64 numbers
        float_values = list(np.float64(' '.join(input_data2).strip(';').split('BY')))
        # Access the specified index and multiply by the unit
        return float_values[index_value] * unit

    # with open(output, 'w') as outfile:
    data= [
            {'ref_name' : cell_name[i][0], 

                'cellsize' :

                    {'cell size':' '.join(cell_size[i][0:-1]),
                        'width':clean_cell_size(cell_size[i],0),
                        'height':clean_cell_size(cell_size[i],1)}}
                        for i in range(len(cell_name))]
    main_json3 = json.dumps(data,indent =4)
        # print(main_json)
        # print("parsing complete")
        # print("output file is", output)
    return main_json3


def merge_def_lef(x, y,):

    def_dict = json.loads(x)
    # print(def_dict)

    lef_dict = json.loads(y)

    merge_dict = def_dict

    for cell in lef_dict:
        for count, defcell in enumerate(def_dict['components']):
            if cell['ref_name'] == defcell['ref_name']:
                merge_dict['components'][count]['x1'] =cell["cellsize"]["width"]
                merge_dict['components'][count]['y1'] = cell["cellsize"]["height"]
           
    main_json3 = json.dumps(merge_dict, indent=4)

    # return main_json3
    # with open(z,'w') as outfile:  
        # json.dump(merge_dict,outfile,indent=4)
    return main_json3


def parse_def3(input):
    main_dict = {} 
    nets=[]
    pins1 = []
    i = 0
    num = 0
    net_name =[]
    pin_name=[]
    direction =[]
    pp =[]
    x =[]
    y =[]
    nets_num =0
    n = 0
    
    with open(input) as f:
        # print('Reading',input,'file')
        lines = f.read().splitlines() 
        
        for count,line in enumerate(lines): 
            if line.startswith('PINS'):
                # print(line)
                # break
                index_start = count
                main_dict['number_of_pins']=int(line.strip().split()[1])
                # print(line1)
                # print(index_start)
            elif line.startswith('END PINS'):
                index_end =count
                
                for i in range(index_start,index_end):
                    if lines[i].strip().startswith('-'):
                        # print(lines[i].strip().split('+')[0])
                        pin_name.append(lines[i].strip().split('+')[0].split()[1])
                        net_name.append(lines[i].split('+')[1])
                        direction.append(lines[i].split('+')[2].split()[1])

                        if lines[i].split('+')[3].split()[1] == 'SIGNAL':
                            pp.append(0)
                        else:
                            pp.append(1)
                    if lines[i].strip().startswith('+ PLACED'):
                        x.append(float(lines[i].strip(') N ;').split('(')[1].split()[0]))
                        y.append(float(lines[i].strip(') N ;').split('(')[1].split()[1]))
                    
                
            elif line.startswith('NETS'):
                start_index = count
                line1 = line.split(' ')
                nets_num = int(line1[1])
            elif line.startswith('END NETS'):
                end_index = count+1

                # reading start nets to end nets
                # psu =0
                for i in range(start_index, end_index):
                    # print(lines[i])
                    
                    
                    if lines[i].strip().startswith('-'):
                        n = (lines[i].split()[1])
                        # print(n)
                        start = i+1
                    elif lines[i].strip().startswith("+ ROUTED"):
                        end = i
                        # print("end",end)
                    # for route end
                    elif lines[i].strip().startswith("+ USE"):
                        route_end = i
                        route =[]
                        z = 0
                        for i in range(end,route_end+1):
                            
                            # print(lines[i])
                            if lines[i].strip().startswith("+ ROUTED"):
                                l1 = lines[i].split(" ")
                                layer1 = l1[5]
                                line = []
                                for i in l1:
                                    
                                    if i.isdigit() or i == '*':
                                        line.append(i)
                                for i in range(len(line)):        
                                    if '*' in line:
                                        p = line.index('*')
                                        line[p] = line[p-2]
                                  
                                      
                                line = list(map(int,line))
                                if len(line) == 2 :
                                        route.append({
                                                'id':z,
                                                "layer":layer1,
                                                "line":{f'x{0}':line[0],f'y{0}':line[1]}})
                                        # break

                                elif len(line) == 4 :
                                    route.append({
                                            'id':z,
                                            "layer":layer1,
                                            "line":{f'x{0}':line[0],f'y{0}':line[1],f'x{1}':line[2],f'y{1}':line[3]}})
                                    # break
                                
                                # print(route)

                                elif len(line) == 6:  
                                    route.append({
                                            'id':z,
                                            "layer":layer1,
                                            "line":{f'x{0}':line[0],f'y{0}':line[1],f'x{1}':line[2],f'y{1}':line[3]}})
                                    route.append({
                                            'id':z+1,
                                            "layer":layer1,
                                            "line":{f'x{0}':line[2],f'y{0}':line[3],f'x{1}':line[4],f'y{1}':line[5]}})
                                    z = z+1
                                    # break
                                    
                                elif len(line) == 8:  
                                    route.append({
                                            'id':z,
                                            "layer":layer1,
                                            
                                            "line":{f'x{0}':line[0],f'y{0}':line[1],f'x{1}':line[2],f'y{1}':line[3]}})
                                
                                    route.append({
                                            'id':z+1,
                                            "layer":layer1,
                                            "line":{f'x{0}':line[2],f'y{0}':line[3],f'x{1}':line[4],f'y{1}':line[5]}})  
                                    route.append({
                                            'id':z+2,
                                            "layer":layer1,
                                            "line":{f'x{0}':line[4],f'y{0}':line[5],f'x{1}':line[6],f'y{1}':line[7]}})
                                    z = z+2
                            
                            if lines[i].strip().startswith("NEW"):
                                # print(lines[i])
                                l2 = lines[i].strip().split(" ")
                                layer1 = l2[1]
                                # print(l2)
                                line1 = []
                    
                                for i in l2:
                                    if i.isdigit() or i == '*':
                                        line1.append(i)
                                    # print(l2)
                                for i in range(len(line1)):
                                    if line1[i] == '*':
                                        p1 = line1.index('*')
                                        line1[p1] = line1[p1-2]
                                
                                line1 = list(map(int,line1))
                                
                                    
                                if len(line1) == 2 :
                                    route.append({
                                            'id':z,
                                            "layer":layer1,
                                            "line":{f'x{0}':line1[0],f'y{0}':line1[1]}})
                                    # break

                                elif len(line1) == 4 :
                                    route.append({
                                            'id':z,
                                            "layer":layer1,
                                            "line":{f'x{0}':line1[0],f'y{0}':line1[1],f'x{1}':line1[2],f'y{1}':line1[3]}})
                                    # break
                                
                                # print(route)

                                elif len(line1) == 6:  
                                    route.append({
                                            'id':z,
                                            "layer":layer1,
                                            "line":{f'x{0}':line1[0],f'y{0}':line1[1],f'x{1}':line1[2],f'y{1}':line1[3]}})
                                    route.append({
                                            'id':z+1,
                                            "layer":layer1,
                                            "line":{f'x{0}':line1[2],f'y{0}':line1[3],f'x{1}':line1[4],f'y{1}':line1[5]}})
                                    z = z+1
                                    # break
                                    
                                elif len(line1) == 8:  
                                    route.append({
                                            'id':z,
                                            "layer":layer1,
                                            
                                            "line":{f'x{0}':line1[0],f'y{0}':line1[1],f'x{1}':line1[2],f'y{1}':line1[3]}})
                                
                                    route.append({
                                            'id':z+1,
                                            "layer":layer1,
                                            "line":{f'x{0}':line1[2],f'y{0}':line1[3],f'x{1}':line1[4],f'y{1}':line1[5]}})  
                                    route.append({
                                            'id':z+2,
                                            "layer":layer1,
                                            "line":{f'x{0}':line1[4],f'y{0}':line1[5],f'x{1}':line1[6],f'y{1}':line1[7]}})
                                    z = z+2
                                    
                                z = z+1  
                        # print(nets)
                        nets.append({
                            "id": num,
                            "net name":n,
                            "route" : route})
                        num += 1
    
    pins1 = [{
                'id':i+1,
                'pin_name':pin_name[i],
                'net_name':net_name[i],
                'direction':direction[i],
                'is_clk':pp[i],
                'x':x[i],
                'y':y[i]
            }for i in range(len(pin_name))]

    main_dict['ports']=pins1
    main_dict['number_of_nets'] = nets_num
    main_dict['nets']=nets
    main_json4 = json.dumps(main_dict, indent=4)
    return main_json4

def f1(input1,input2):
    
    def_component = json.loads(input1)
        # print(type(def_component))
    def_port = json.loads(input2)
    dict = {}
    dict.update(def_component)
    dict.update(def_port)
    # print(f'Final DEF merged Output file is : {output}')
    main_json = json.dumps(dict, indent=4)
    # print(main_json)
    # print("Output file is ",output)

    return json.loads(main_json)
    
    # with open(output,'w') as output1:
    #     json.dump(dict,output1,indent = 4 )
    # return main_json


# f1(merge_def_lef(parse_def1(a),lef_parser(b)),parse_def3(a),c)



