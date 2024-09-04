import json
import pathlib
import csv




def str_to_list(s):
    result = s.split()
    return result

def is_buff(a):
    if 'BUFF' in a:
        return True
    else:
        return False

def is_inv(a):
    if 'INV' in a:
        return True
    return False

def isfloat(num):
    try:
        float(num)
        return True
    except ValueError:
        return False

def parse_timing(input):
    input = input.lstrip("/")
    with open(input,'r') as d:
            lines=d.read().splitlines()
            for line in lines:
                if len(line)>0:
                    # print(line)
                    if 'Design' in line.strip().split():
                        a = line.strip().split()[-1]
                        # print("Design of the timing report is",a)

                    if 'Point' in line.strip().split():
                        p = line.strip().split()
            if len(p) ==3:
                return without_switch(input)                   
            else:
                return with_switch(input)


def with_switch(input):
    start_clk=[]
    end_clk=[]
    startpoint =[]
    endpoint =[]
    netdelay =[]
    path_Group=[]
    slack=[]
    lol =[]
    x = []
    i =0
    y =[]
    buf =[]
    inv =[]
    buf_sum =[]
    buff_count =[]
    inv_sum =[]
    buf_inv_delay =[]
    buff_plus_inv =[]
    cell_count =[]
    cell =[]
    point_column =[]
    clk_period =[]
    with open(input,'r') as d:
            print("reading the file",input)
            lines=d.read().splitlines()
            for i, line in enumerate(lines):
                    if 'Startpoint' in line:
                        startpoint.append(line.strip().split()[1])
                        if len(line.strip().split())>2:
                            # print(line)
                            # print(line.strip().split("by"))
                            start_clk.append(line.strip().split("by")[1].replace(')',''))
                        else:
                            if "by" in lines[i+1]:
                                start_clk.append(lines[i+1].strip().split("by")[1].replace(')',''))
                            else:
                                start_clk.append(lines[i+1].strip().split("source")[1].replace(')',''))

                    elif 'Endpoint' in lines[i]:
                        endpoint.append(lines[i].strip().split()[1])
                        if len(lines[i].strip().split())>2:
                            # print(line)
                            end_clk.append(lines[i].strip().split("by")[1].replace(')',''))
                        else:
                            end_clk.append(lines[i+1].strip().split("by")[1].replace(')',''))
                            # print(end_clk)

                    elif 'Path Group' in lines[i]:
                        path_Group.append(lines[i].strip().split()[-1])

                    elif 'Point' in lines[i]:
                        x.append(i)
                        # print(line.strip())
                        point_column.append(lines[i].strip())

                    elif 'slack (' in lines[i]:
                    # print(lines[i])
                    # if lines[i].strip().split()[-1].isdigit():    # print(float(lines[i].strip().split()[-1]))
                        slack.append(float(lines[i].strip().split()[-1]))
                        # print(lines[i].split()[-1])
                        y.append(i)
            
            li_buf = ["BUFF", "NBUFF","NBUF","BUF"]
            list1 = ["(rise edge)", "(fall edge)"]
               # netdelay.append(net)
            for p,q in zip(x,y):
                net_sum =0
                ff =0
                buf_count =0
                inv_count =0
                b_sum =0
                in_sum =0 
                u =0
                cell_count =[" ",]
                cell_name =""
                countr =0
                clk = []
                cell_num =1
                for t in range(p,q):
                    # cell_name =''
                    if len(lines[t].strip().split())> 1:
                        if any([x in lines[t] for x in list1]):
                            a =  float(lines[t].strip().split()[-1])
                            # print(a,t)
                            clk.append(a)
                        if "(net)" in lines[t].strip().split():
                            # print(lines[t].strip().split()
                            cell_num += 1
                            if len(lines[t].strip().split()) >2:
                                net = float(lines[t].strip().split()[-1])
                            else:
                                if isfloat(lines[t+1].strip().split()[-1]):
                                    net = float(lines[t+1].strip().split()[-1])
                            net_sum += net
                        elif any(x in lines[t].strip().split()[1] for x in li_buf):
                            buf_count = buf_count+1
                            if len(lines[t].strip().split()) >2:
                                buffer = float(lines[t].strip().split()[-4])
                            else:
                                buffer = float(lines[t+1].strip().split()[-4])
                                # print(lines[t+1].strip().split(),i)
                            # print(lines[t+1].strip().split())
                            # buffer = float(lines[t+1].strip().split()[-3])
                            b_sum +=  buffer

                        elif "INV" in lines[t].strip().split()[1]:

                            # print(lines[t].strip().split()[1])
                            inv_count = inv_count+1
                            if len(lines[t].strip().split()) >2:
                                inverter = float(lines[t].strip().split()[-4])
                            else:
                                inverter = float(lines[t+1].strip().split()[-4])
                            in_sum += inverter
                        elif "arrival" in lines[t].strip().split():
                           u = abs(float(lines[t].strip().split()[-1]))

                        elif ("/" in lines[t]) and ('(net)' not in lines[t]):
                            countr +=1
                            # print(lines[t])
                            
                            a = lines[t].strip().split("/")[-2]
                            # print(lines[t].strip().split("/"),countr)
                            if cell_count[-1] == a:
                                pass
                            else:
                                cell_count.append(a)
                    # print(clk)
                lol.append(cell_num)
                clk_period.append(round(abs(clk[0]-clk[1]),2))           
                cell.append(cell_count)
                # print(cell)           
                buf_inv_delay.append(u)        
                buf_sum.append(round(b_sum,2))
                inv_sum.append(round(in_sum,2))
                buff_count.append(buf_count//2)
                inv.append(inv_count//2)
                netdelay.append(round(net_sum,2))           
    # for i in cell:
    #     lol.append(len(i))
    # lol = cell
    # print(cell)       
    for i,j,k in zip(buf_sum,inv_sum,buf_inv_delay):
        if k!=0:
            d = ((i+j)/k)*100 
        else:
            d = 0.0
        buff_plus_inv.append(round(d,2))  

    # print(len(buff_plus_inv))
    # print(len(buff_count))
    # print(netdelay)                    
    # print("input file",input)
    # with open(output,"w") as outfile:  

    d =[{'path':i+1,
        "startpoint":startpoint[i],
        "endpoint":endpoint[i],
        "path_group":path_Group[i].strip(" \t"),
        "start_clk": start_clk[i],
        "end_clk":end_clk[i],
        "NetDelay":netdelay[i],
        "CLKPeriod":clk_period[i],
        "Through":"",
        "Buff_Count": buff_count[i],
        "Buff_Delay":buf_sum[i],
        "Inv_Count":inv[i],
        "Inv_delay":inv_sum[i],
        "Buff_plus_Inv_perc_list":buff_plus_inv[i],
        "ApproximateLOL":lol[i],
        "slack":float(slack[i]),
        } for i in range(len(slack))]
        # print(d)
    # main_json = json.dumps(d, indent=4)
        # print("ouput file is", output)
        # json.dump(d,outfile,indent=4)
    return d 
    


def without_switch(input):
    start_clk=[]
    end_clk=[]
    startpoint =[]
    endpoint =[]
    netdelay =[]
    buff_count =[]
    path_Group=[]
    slack=[]
    lol =[]
    x = []
    i =0
    y =[]
    inv =[]
    buf_sum =[]
    inv_sum =[]
    buf_inv_delay =[]
    buff_plus_inv =[]
    point_column =[]
    cell =[]

    with open(input,'r') as d:
            # print("reading the file",input)
        lines=d.readlines()
        print('reading the file',input)
        for i,line in enumerate(lines):
                # print(line)
                if 'Startpoint' in line:
                    startpoint.append(line.strip().split()[1])
                    if len(line.strip().split())>2:
                        # print(line)
                        # print(line.strip().split("by"))
                        start_clk.append(line.strip().split("by")[1].replace(')',''))
                    else:
                        print(lines[i+1].strip().split("by")[1].replace(')',''),i+1)
                        start_clk.append(lines[i+1].strip().split("by")[1].replace(')',''))

                elif 'Endpoint' in line:
                    endpoint.append(line.strip().split()[1])
                    if len(line.strip().split())>2:
                        # print(line)
                        end_clk.append(line.strip().split("by")[1].replace(')',''))
                    else:
                        end_clk.append(lines[i+1].strip().split("by")[1].replace(')',''))
                        # print(end_clk)
            
                elif 'Path Group' in lines[i]:
                        path_Group.append(lines[i].strip().split()[-1])
                
                elif 'Point' in lines[i]:
                        x.append(i)
                        # print(line.strip())
                        point_column.append(lines[i].strip())

                elif 'slack (' in lines[i]:
                    # print(lines[i])
                    # if lines[i].strip().split()[-1].isdigit():    # print(float(lines[i].strip().split()[-1]))
                        slack.append(float(lines[i].strip().split()[-1]))
                        # print(lines[i].split()[-1])
                        y.append(i)
                        # print(y)

    # print(startpoint)
        li_buf = ["BUFF", "NBUFF","NBUF","BUF"]
        
            # netdelay.append(net)
        for i,j in zip(x,y):
            net_sum =0
            buf_count =0
            inv_count =0
            b_sum =0
            in_sum =0 
            u =0
            cell_count =[]
            for t in range(i,j):
                if len(lines[t].strip().split())> 1:
                    # print(lines[t].strip().split())

                    if any(x in lines[t].strip().split()[1] for x in li_buf):
                        buf_count = buf_count+1

                    elif "INV" in lines[t].strip().split()[1]:
                        # print(lines[t].strip().split()[1])
                        inv_count = inv_count+1

                    elif "/" in lines[t]:
                        cell_count.append(lines[t].strip().split("/")[-1])
                        # print(lines[t])
            cell.append(list(cell_count))
                        
            buf_inv_delay.append(u)        
            buff_count.append(buf_count)
            inv.append(inv_count)
            netdelay.append(round(net_sum,2))           
    for i in cell:
        lol.append(len(i))
    # with open(output,"w") as outfile:  

    data =[{'path':i+1,
            "startpoint":startpoint[i],
            "endpoint":endpoint[i],
            "path_group":path_Group[i],
            "start_clk": start_clk[i],
            "end_clk":end_clk[i],
            "NetDelay":"-",
            "CLKPeriod":"",
            "Through":"",
            "Buff_Count": buff_count[i],
            "Buff_Delay":"-",
            "Inv_Count_list":inv[i],
            "Inv_delay_list":"-",
            "Buff_plus_Inv_perc_list":"-",
            "ApproximateLOL":lol[i],
            "slack":slack[i],
            } for i in range(len(startpoint))]
        # print(d)
        # print("ouput file is", output)
        # json.dump(data,outfile,indent=4)
    # main_json= json.dumps(data,indent = 4)
    return data



def parse_timing_1(input,output = 'out.csv'):
    input = input.lstrip("/")
    startpoint= []
    slack=[]
    i =0
    d=[]
    ggg =[]
    gg =[]
    with open(input,'r') as rr:
            print("reading the file",input)
            lines=rr.read().splitlines()
            print(lines)
            
            for y, line in enumerate(lines):
                line= str_to_list(line)
                if len(line)>0:
                    if line[0]=='Startpoint:':
                        startpoint.append(y)
                    elif line[0]=='slack':
                         slack.append(y+1)
            i=0
            for p,q in zip(startpoint,slack):
                gg =[]
                for t in range(p,q):
                    gg.append(lines[t])
                d.append({"path":i+1,"data": gg})
                i += 1
    # with open(output,"w") as outfile:
    #     print("ouput file is", output)
    #     json.dump(d,outfile,indent=4)
    # return d 
    print(d)
    field_names = ["path", "data"]
    with open(output, 'w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames = field_names)
        writer.writeheader()
        writer.writerows(d)
        return output


# parse_timing_1(input='/home/dell/Downloads/Parsers-main/timing_path/timing_path_popup/TESTCASE3_FA_03_02_22_TIMING.rpt.txt')

# a ='timingrpt_without_switch.txt'
# a = 'Testcase2_timing_rpt.txt'
# a = 'setup.txt'
# a = "timingrpt_with_switch.txt"
# b='timing_output.json'

# function to return the file extension
# file_extension = pathlib.Path(a).suffix
# if file_extension == ".txt":

# else:
    # print(a,"file not supported")