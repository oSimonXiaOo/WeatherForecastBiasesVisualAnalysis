import os
from rainfall_detection.models import *

connect('data', host='127.0.0.1', port=27017)

source_dir = 'L:\\Workspace\\fcst_rain_similar'
for root, sub_dirs, files in os.walk(source_dir):
    for special_file in files:
        spcial_file_dir = os.path.join(root, special_file)
        with open(spcial_file_dir) as source_file:
            i = 1
            identity = ""
            for line in source_file:
                # do something
                info = line.split(' ')
                if i == 1:
                    identity = info[0]
                else:
                    similar = Similar(identity=identity, simIdentity=info[0], similarity=float(info[1]))
                    similar.save()
                i += 1
