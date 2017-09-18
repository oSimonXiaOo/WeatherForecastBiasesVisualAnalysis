import os
from rainfall_detection.models import *

connect('data', host='127.0.0.1', port=27017)

source_dir = 'L:\\Workspace\\fcst_rain_continuous'
for root, sub_dirs, files in os.walk(source_dir):
    for special_file in files:
        spcial_file_dir = os.path.join(root, special_file)
        with open(spcial_file_dir) as source_file:
            name = source_file.name.split('\\')
            mark = name[3].split('.')
            for line in source_file:
                # do something
                info = line.split('\n')
                continuous = Continuous(identity=info[0], mark=int(mark[0]))
                continuous.save()
