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

forecast = Forecast.objects()
for i in range(128):
    for j in range(61):
        value = 0
        for e in forecast:
            angle = math.radians(e.angle)
            d = pow(((i - e.centerX) * math.cos(angle) + (j - e.centerY) * math.sin(angle)), 2) \
                / pow(e.longAxis, 2) + \
                pow(((j - e.centerY) * math.cos(angle) - (i - e.centerX) * math.sin(angle)), 2) \
                / pow(e.shortAxis, 2)
            v = pow(math.e, -0.7 * d)
            if v > 0.5:
                value += v
        heat = Heat(longitude=longitude[j * 128 + i], latitude=latitude[j * 128 + i],
                    value=value)
        heat.save()
