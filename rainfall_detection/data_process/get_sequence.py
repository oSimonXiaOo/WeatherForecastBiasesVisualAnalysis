import os
from rainfall_detection.models import *

connect('data', host='127.0.0.1', port=27017)

source_dir = 'L:\\Workspace\\fcst_rain_continuous'
for root, sub_dirs, files in os.walk(source_dir):
    for special_file in files:
        spcial_file_dir = os.path.join(root, special_file)
        with open(spcial_file_dir) as source_file:
            i = 0
            identity = ""
            date = ""
            for line in source_file:
                # do something
                info = line.split('\n')
                if i == 0:
                    identity = info[0]
                    forecast = Forecast.objects(identity=identity)
                    for e in forecast:
                        date = e.date
                i += 1
            sequence = Sequence(identity=identity, count=i, date=date)
            sequence.save()
