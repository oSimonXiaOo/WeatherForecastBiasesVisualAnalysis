# -*- coding: utf-8 -*-
from __future__ import unicode_literals
# Create your models here.
from mongoengine import *


class Forecast(Document):
    identity = StringField(unique=True, required=True)
    centerX = FloatField(required=True)
    centerY = FloatField(required=True)
    longitude = FloatField(required=True)
    latitude = FloatField(required=True)
    longAxis = FloatField(required=True)
    shortAxis = FloatField(required=True)
    angle = FloatField(required=True)
    area = FloatField(required=True)
    minRainfall = FloatField(required=True)
    rainfall = FloatField(required=True)
    maxRainfall = FloatField(required=True)
    date = StringField(required=True)


class Observed(Document):
    identity = StringField(unique=True, required=True)
    centerX = FloatField(required=True)
    centerY = FloatField(required=True)
    longitude = FloatField(required=True)
    latitude = FloatField(required=True)
    longAxis = FloatField(required=True)
    shortAxis = FloatField(required=True)
    angle = FloatField(required=True)
    area = FloatField(required=True)
    minRainfall = FloatField(required=True)
    rainfall = FloatField(required=True)
    maxRainfall = FloatField(required=True)
    date = StringField(required=True)


class Similar(Document):
    identity = StringField(required=True)
    simIdentity = StringField(required=True)
    similarity = FloatField(required=True)


class Continuous(Document):
    identity = StringField(unique=True, required=True)
    mark = IntField(required=True)


class Heat(Document):
    longitude = FloatField(required=True)
    latitude = FloatField(required=True)
    value = FloatField(required=True)


class Sequence(Document):
    identity = StringField(unique=True, required=True)
    count = IntField(required=True)
    date = StringField(required=True)
