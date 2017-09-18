# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import os
import math
import numpy as np
import scipy.cluster.hierarchy as sch
import matplotlib.pylab as plt

from sklearn import manifold, ensemble, decomposition
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE

from models import *
from mongoengine import *
from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
connect('data', host='127.0.0.1', port=27017)  # 指明要连接的数据库


def index(request):
    return render(request, 'index.html')


def ajax_init(request):
    heat = []
    scatter = []
    properties = []
    identities = []
    if request.method == 'GET':
        mode = request.GET['mode']
        value = Heat.objects()
        for v in value:
            item = [v.longitude, v.latitude, v.value]
            heat.append(item)
        for line in open('L:\\Workspace\\properties.txt', "r"):
            temp = []
            temp.extend(line.strip().split(' '))
            temp = map(float, temp)
            properties.append(temp)
        for line in open('L:\\Workspace\\identities.txt', "r"):
            identities.extend(line.strip().split(' '))
        identities = map(float, identities)
        pos = analyse_mode(properties, mode)
        for i, p in enumerate(properties):
            p.append(identities[i])
        for i, p in enumerate(pos):
            scatter.append([p[0], p[1], identities[i]])
        data = [heat, scatter, properties]
        # print time.strftime('%H:%M:%S', time.localtime(time.time()))
    return JsonResponse(data, safe=False)


def ajax_rain(request):
    data = []
    if request.method == 'GET':
        date = request.GET['date']
        if date == '':
            return JsonResponse(data, safe=False)
        source_dir = 'L:\\Workspace\\filter_fcst_rain_paths'
        for root, sub_dirs, files in os.walk(source_dir):
            for special_file in files:
                spcial_file_dir = os.path.join(root, special_file)
                with open(spcial_file_dir) as source_file:
                    file_name = spcial_file_dir.split('\\')
                    file_date = file_name[3].split('.')[0]
                    if file_date == date:
                        item = []
                        for line in source_file:
                            info = line.split(' ')
                            item.append([float(info[0]), float(info[1])])
                        data.append({"identity": file_name[3], "data": item})
    return JsonResponse(data, safe=False)


def ajax_con_day(request):
    if request.method == 'GET':
        identities = request.GET['identities']
        identity = identities.split(" ")
        temporal = analyse_month(identity)
    return JsonResponse(temporal, safe=False)


def ajax_con_rain(request):
    fcst = []
    anal = []
    if request.method == 'GET':
        identity = request.GET['identity']
        continuou = Continuous.objects(identity=identity)
        for con in continuou:
            continuous = Continuous.objects(mark=con.mark).order_by("identity")
            for c in continuous:
                id = 0
                source_dir = 'L:\\Workspace\\filter_fcst_rain_paths'
                spcial_file_dir = os.path.join(source_dir, c.identity)
                with open(spcial_file_dir) as source_file:
                    item = []
                    for line in source_file:
                        info = line.split(' ')
                        item.append([float(info[0]), float(info[1])])
                    fcst.append({"identity": c.identity, "data": item})
                forecast = Forecast.objects(identity=c.identity)
                for f in forecast:
                    observed = Observed.objects(date=f.date)
                    distant = 10
                    for o in observed:
                        d = math.hypot(math.fabs(f.centerX - o.centerX), math.fabs(f.centerY - o.centerY))
                        if d < distant:
                            distant = d
                            id = o.identity
                    if id != 0:
                        source_dir = 'L:\\Workspace\\filter_anal_rain_paths'
                        spcial_file_dir = os.path.join(source_dir, id)
                        with open(spcial_file_dir) as source_file:
                            item = []
                            for line in source_file:
                                info = line.split(' ')
                                item.append([float(info[0]), float(info[1])])
                            anal.append({"identity": c.identity, "data": item})
        data = [fcst, anal]
    return JsonResponse(data, safe=False)


def ajax_analyse(request):
    data = []
    mark = []
    heat = []
    scatter = []
    identities = []
    properties = []
    if request.method == 'GET':
        if request.GET['identity'] == '0':
            north = float(request.GET['north'])
            south = float(request.GET['south'])
            west = float(request.GET['west'])
            east = float(request.GET['east'])
            mode = float(request.GET['mode'])
            all_heat = Heat.objects()
            for ah in all_heat:
                if north <= ah.latitude <= south and west <= ah.longitude <= east:
                    item = [ah.longitude, ah.latitude, ah.value]
                    heat.append(item)
            forecasts = Forecast.objects()
            for f in forecasts:
                if north <= f.latitude <= south and west <= f.longitude <= east:
                    continuou = Continuous.objects(identity=f.identity)
                    for con in continuou:
                        if con.mark not in mark:
                            mark.append(con.mark)
            mark.sort()
            analyse_data(mark, heat, identities, properties)

            disMat = sch.distance.pdist(properties, 'euclidean')
            Z = sch.linkage(disMat, method='average')
            sch.set_link_color_palette(['c'])
            P = sch.dendrogram(Z)
            plt.savefig('L:\\Workspace\\rdw\\rainfall_detection\\static\\data\\plot_new.png')
            cluster = sch.fcluster(Z, t=1)
            #print "Original cluster by hierarchy clustering:\n", cluster

            pos = analyse_mode(properties, mode)
            temporal = analyse_month(identities)
            for i, p in enumerate(properties):
                p.append(identities[i])
            for i, p in enumerate(pos):
                scatter.append([p[0], p[1], identities[i]])
            data = [heat, scatter, properties, temporal]
        else:
            identity = request.GET['identity']
            mode = request.GET['mode']
            similar = Similar.objects(identity=identity).order_by("simIdentity")
            for s in similar:
                forecast = Forecast.objects(identity=s.simIdentity)
                for f in forecast:
                    continuou = Continuous.objects(identity=f.identity)
                    for con in continuou:
                        if con.mark not in mark:
                            mark.append(con.mark)
            mark.sort()
            analyse_data(mark, [], identities, properties)
            pos = analyse_mode(properties, mode)
            temporal = analyse_month(identities)
            for i, p in enumerate(properties):
                p.append(identities[i])
            for i, p in enumerate(pos):
                scatter.append([p[0], p[1], identities[i]])
            data = [scatter, properties, temporal]
    return JsonResponse(data, safe=False)


def analyse_mode(properties, mode):
    mode = float(mode)
    if mode == 0:
        pca = PCA(n_components=2)
        pos = pca.fit_transform(properties)
    elif mode == 1:
        model = TSNE(n_components=2, random_state=0)
        np.set_printoptions(suppress=True)
        pos = model.fit_transform(properties)
    elif mode == 2:
        clf = manifold.Isomap(n_components=2)
        pos = clf.fit_transform(properties)
    elif mode == 3:
        hasher = ensemble.RandomTreesEmbedding(n_estimators=200, random_state=0, max_depth=5)
        x_transformed = hasher.fit_transform(properties)
        pca = decomposition.TruncatedSVD(n_components=2)
        pos = pca.fit_transform(x_transformed)
    else:
        clf = manifold.SpectralEmbedding(n_components=2, random_state=0, eigen_solver="arpack")
        pos = clf.fit_transform(properties)
    return pos


def analyse_month(identities):
    count_1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    count_2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    count_3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for i in identities:
        sequence = Sequence.objects(identity=i)
        for s in sequence:
            date = s.date
            month = date.split('-')[1]
            if s.count == 1:
                count_1[int(month) - 1] += 1
            elif s.count == 2:
                count_2[int(month) - 1] += 1
            else:
                count_3[int(month) - 1] += 1
    temporal = [count_1, count_2, count_3]
    return temporal


def analyse_data(mark, heat, identities, properties):
    for m in mark:
        continuous = Continuous.objects(mark=m).order_by("identity")
        for c in continuous:
            identity = 0
            forecast = Forecast.objects(identity=c.identity)
            for f in forecast:
                value = Heat.objects(longitude=f.longitude, latitude=f.latitude)
                for v in value:
                    item = [v.longitude, v.latitude, v.value]
                    heat.append(item)
                observed = Observed.objects(date=f.date)
                distant = 10
                for o in observed:
                    d = math.hypot(math.fabs(f.centerX - o.centerX), math.fabs(f.centerY - o.centerY))
                    if d < distant:
                        distant = d
                        identity = o.identity
                if identity != 0:
                    identities.append(c.identity)
                    observed = Observed.objects(identity=identity)
                    for o in observed:
                        properties.append([f.rainfall, f.area, f.longitude, f.latitude,
                                           f.rainfall - o.rainfall,
                                           f.area - o.area,
                                           f.longitude - o.longitude,
                                           f.latitude - o.latitude
                                           ])

