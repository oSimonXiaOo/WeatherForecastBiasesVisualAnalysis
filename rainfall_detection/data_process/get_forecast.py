import os
import math
from rainfall_detection.models import *

connect('data', host='127.0.0.1', port=27017)

longitude = []
latitude = []

for line in open('L:\\Workspace\\longitude.txt', "r"):
    longitude.extend(line.strip().split(' '))
longitude = map(float, longitude)
for line in open('L:\\Workspace\\latitude.txt', "r"):
    latitude.extend(line.strip().split(' '))
latitude = map(float, latitude)

source_dir = 'L:\\Workspace\\fcst_rain_cell'
for root, sub_dirs, files in os.walk(source_dir):
    for special_file in files:
        spcial_file_dir = os.path.join(root, special_file)
        with open(spcial_file_dir) as source_file:
            for line in source_file:
                # do something
                info = line.split(' ')
                angle = 90 - math.degrees(float(info[5]))  # y_axis->x_axis
                end = int(info[12])
                date = info[10] + '-' + info[11] + '-' + str(end)
                x = int(round(float(info[2])))
                y = int(round(float(info[1])))
                lon = longitude[y * 128 + x]
                lat = latitude[y * 128 + x]
                forecast = Forecast(identity=info[0],
                                    centerX=float(info[2]),
                                    centerY=float(info[1]),
                                    longitude=lon,
                                    latitude=lat,
                                    longAxis=float(info[3]),
                                    shortAxis=float(info[4]),
                                    angle=angle,
                                    area=int(float(info[6])),
                                    rainfall=float(info[8]),
                                    minRainfall=float(info[7]),
                                    maxRainfall=float(info[9]),
                                    date=date)
                forecast.save()
