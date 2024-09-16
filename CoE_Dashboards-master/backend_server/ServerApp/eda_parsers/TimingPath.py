import json
import pathlib


def str_to_list(s):
    result = s.split()
    return result


def isfloat(num):
    try:
        float(num)
        return True
    except ValueError:
        return False


def remove_duplicates(pth):
    b = []
    for item in pth:
        if len(b):
            if b[-1] != item:
                b.append(item)
        else:
            b.append(item)
    return b


def parse_timing(input):
    with open(input, 'r') as d:
        lines = d.read().splitlines()
        for line in lines:
            if len(line) > 0:
                # print(line)
                if 'Design' in line.strip().split():
                    a = line.strip().split()[-1]
        if a == 'fulladder':
            return fulladder(input)
        else:
            return with_without_switch(input)


def fulladder(input):
    # data={}
    x = []
    i = 0
    y = []
    slack = []
    paths = []
    d = {}
    with open(input, 'r') as d:
        print("reading the file", input)
        lines = d.read().splitlines()
        for i, line in enumerate(lines):
            line = str_to_list(line)
            if len(line) > 0:

                if line[0] == 'slack':
                    slack.append(line[-1])
                    y.append(i)
                    # print(y)

                elif line[0] == 'Point':
                    x.append(i)

        e = 1
        d = []
        for i, j in zip(x, y):
            paths = []
            a = 0
            for t in range(i, j):
                if len(lines[t].strip().split()) > 1:
                    if '(net)' not in lines[t]:
                        out = isfloat(lines[t].strip().split()[0])
                        if lines[t].strip().split()[0] not in ['clock', 'data', 'Point', 'library', "statistical"] and out == False:
                            a = lines[t].strip().split('/')[0]
                            # print(lines[t].strip().split('/')[0])
                            paths.append(a)

            d.append({f'path_{e}': remove_duplicates(paths)})
            e += 1

    # print(d)

    main_json = json.dumps(d, indent=4)
    return json.loads(main_json)


def with_without_switch(input):
    # data={}
    x = []
    i = 0
    y = []
    slack = []
    paths = []
    d = {}
    with open(input, 'r') as d:
        # print("reading the file", input)
        lines = d.read().splitlines()
        for i, line in enumerate(lines):
            line = str_to_list(line)
            if len(line) > 0:

                if line[0] == 'slack':
                    slack.append(line[-1])
                    y.append(i)
                    # print(y)

                elif line[0] == 'Point':
                    x.append(i)

        e = 1
        d = []
        for i, j in zip(x, y):
            paths = []
            a = ""
            for t in range(i, j):
                if len(lines[t].strip().split()) > 1:
                    if '(net)' not in lines[t]:
                        out = isfloat(lines[t].strip().split()[0])
                        if lines[t].strip().split()[0] not in ['clock', 'data', 'Point', 'library', "statistical", 'output'] and out == False:
                            a = lines[t].strip().split()[0]
                            # print(a)
                            paths.append(a)
            # paths.pop(0)
            # print(paths)
            # paths.pop(-1)

            d.append({f'path_{e}': remove_duplicates(paths)})
            e += 1

    # print(d)

    main_json = json.dumps(d, indent=4)
    return json.loads(main_json)
