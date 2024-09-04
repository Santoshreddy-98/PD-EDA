import json
import os
a ='fulladder_feb21.def'
b = 'fulladder_V0.1.lef.txt'
c ='final_output.json'
def parse_def(input):
    main_def = {}
    index_end = 0 
    components = []
    # print('opening file in read mode')
    with open(input) as f:
        lines = f.readlines()
        # print('iterating over each line')
        i=0 
        for line in lines:
            if line.startswith('DESIGN'):
                line = line.split()
                main_def['design'] = line[1]

            elif line.startswith('UNITS DISTANCE'):
                line1 = line.split(" ")
                main_def['unit_in_micron']=float(line1[3])
                # converting co-oradinate values
                mul_unit = main_def['unit_in_micron']*(10**-3)
                
            # getting line containing die area
            elif line.startswith('DIEAREA'):
                line1 = line.split(" ")
                # print(line1)
                if len(line1)<12:
                    main_def['diearea'] = {
                                        'x1':float(line1[2])*mul_unit,
                                        'y1':float(line1[3])*mul_unit,
                                        'x2':float(line1[6])*mul_unit,
                                        'y2':float(line1[7])*mul_unit
                                        }
                else:
                    main_def['diearea'] = {
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
                main_def['number_of_components']=int(line1[1])
            
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
    main_def['components']=components
    main_json1 = json.dumps(main_def, indent=4)
    return main_json1


def parse_lef(input):
    main_lef = {}
    index_end = 0 
    cells =[]
    x = 0
    # print('opened file in read mode')
    with open(input) as f:
        lines = f.readlines()
        # iterating over each line
        for line in lines:
                    
            # getting line containg COMPONENTS and getting start and end index
            if line.startswith('MACRO'):
                line1 = line.split(" ")
                index_start = lines.index(line)
                cell_name= line1[1]
                # print(index_start)
                index_end = lines.index(f'END {cell_name}')
                # print(index_end)
                # print(f'END {cell_name}',index_end)
                pin =[]
            
                size ={}
                class_1 =''
                foreign =''
                site = ''
                sym = ''
                f =0
                pin_name = ""
                for a in range(index_start, index_end):
                    # print(lines[a])
                    if lines[a].strip().startswith('CLASS'):
                            # print(lines[a])
                        d = lines[a].strip().split()[1]
                        class_1=str(d)
                    elif lines[a].strip().startswith('FOREIGN'):
                            # print(lines[a])
                        d = lines[a].strip().split()[1]
                        foreign = str(d)
                        # print(d)
                    elif lines[a].strip().startswith('SIZE'):
                            # print(lines[a])
                        d = lines[a].strip().split()
                        
                        size.update({
                            'x':float(d[1])*1000,'y':float(d[3])*1000

                        })
                    elif lines[a].strip().startswith('SITE'):
                            # print(lines[a])
                        d = lines[a].strip().split()[1]
                        site=str(d)
                    elif lines[a].strip().startswith('SYMMETRY'):
                            # print(lines[a])
                        d = lines[a].strip().split()[1:3]
                        c = ' '.join(d)
                        sym=str(c)

                    elif lines[a].strip().startswith('PIN') and not (lines[a].strip().startswith('PIN VSS') or lines[a].strip().startswith('PIN VDD')) :
                        index_pinstart = a
                        pin_name = str(lines[a].strip().split()[1])
                        # print(pin_name)

                    elif lines[a].strip().startswith(f'END {pin_name}'):
                        endin = a
                        # print(endin,pin_name)
                        x_list = []
                        x_final =[]
                        
                        for o in range(index_pinstart,endin):
                            
                            if lines[o].strip().startswith('DIRECTION'):
                                # print(lines[o])
                                x3 = lines[o].split(' ')[-2]
                                # print(x3[-2])
                    
                            elif lines[o].strip().startswith('USE'):
                                x4= lines[o].split(' ')

                            elif lines[o].strip().startswith('LAYER'):
                                x6 = lines[o].strip().split(" ")[1]

                            elif lines[o].strip().startswith('RECT'):
                                x5 = lines[o].strip().split(" ")
                        
                                x5.remove("")
                                x5.remove('RECT')
                                x5.pop()
                                x_list1 = [float(i) for i in x5]
                                x_list.append(x_list1)
                            
                        # print(x_list)   
                        a =0
                        
                        for i in x_list:
                            x0 = i[0]*1000
                            x1 = i[2]*1000
                            y0  = i[1]*1000
                            y1  = i[3]*1000
                            
                            a+= 1
                        # print(x,y)                        
                            x_final.append({'x0':x0,
                                        'y0':y0,
                                        'x1':x1,
                                        'y1':y1
                                        })
                        # print(x_final)
                        pin.append({
                            "id": f,
                            "pin_name":pin_name,
                            "direction" : x3,
                            "use" : x4[-2],
                            'layer':x6,
                            'Route':x_final,
                        }) 
                        f +=1
                                                
                cells.append({
                'ref_Name':cell_name.strip(),
                'CLASS':class_1,
                'FOREIGN': foreign,
                'SIZE':size,
                'SYMMETRY': sym,
                'SITE': site,
                'Pins': pin})                 
    # print('Parsing done')    
    main_lef['cells']= cells
    main_json2 = json.dumps(main_lef, indent=4)
    return main_json2

def merge_def_lef(x, y):
    
    def_dict = json.loads(x)
    # print(def_dict)
    lef_dict = json.loads(y)
    # print(lef_dict)

    merge_dict = def_dict
    # print(lef_dict.values())

    for cell in lef_dict.values():
        for i in range(len(cell)):
            # print(cell[i]['ref_Name'])
            for count, defcell in enumerate(def_dict['components']):
                # print(merge_dict['components'][count]['x'])
                if cell[i]['ref_Name'] == defcell['ref_name']:
                    merge_dict['components'][count]['x1'] = merge_dict['components'][count]['x']+cell[i]["SIZE"]["x"]
                    merge_dict['components'][count]['y1'] = merge_dict['components'][count]['y']+cell[i]["SIZE"]["y"]
    # print(merge_dict)
    main_json3 = json.dumps(merge_dict, indent=4)    
    return main_json3

def merge_def_lef1(p, q):
    def_dict = json.loads(p)
    # print(def_dict)
    lef_dict = json.loads(q)

    merge_dict = def_dict
    for cell in lef_dict['cells']:
        for count, defcell in enumerate(def_dict['components']):
            print(defcell['ref_name'],cell['ref_Name'])
            if defcell['ref_name'] == cell['ref_Name']:
                merge_dict['components'][count]['pins'] = cell['Pins']
    merged_out = json.dumps(merge_dict, indent=4)
    
    data = json.loads(merged_out)
    for i in data['components']:
            # print(i)
    #     for i in data['components']:
            # print(i)
        y1 = i['x']
        y2 = i['y']
        for c,j in enumerate(i['pins']):
            route = j['Route']
            # print(route)
            for f in range(len(route)):
                # print(route[f]['x0'])
                route[f]['x1'] = route[f]['x1'] -route[f]['x0'] 
                route[f]['y1'] = route[f]['y1'] -route[f]['y0'] 
                route[f]['x0'] = route[f]['x0']+ y1
                route[f]['y0'] = route[f]['y0']+ y2
                # print(route[f]['x0'])
                # print(route)
    main_json5 = json.dumps(data,indent =4)
    # print("parsing complete")  
    # print(merge_dict)         
    # with open(output, 'w') as outfile:
    #     json.dump(data, outfile, indent=4)

    return json.loads(main_json5)
# print(merge_def_lef1(merge_def_lef(parse_def(a), parse_lef(b)),parse_lef(b)))
