#!/usr/bin/python
# -*- coding: UTF-8 -*-

# This script is used to process Penny Harvest data on schools & organisations
# Uses mapq (https://pypi.python.org/pypi/mapq) to access Mapquest API
# More info on Mapquest API: http://open.mapquestapi.com/geocoding/

# Todo, ignore first row, which contains headers

import csv
import sys
import mapq

file_out = sys.argv[1] 
file_in = sys.argv[2]

# Mapquest API key
mapq.key('Fmjtd%7Cluur290y2h%2Cr5%3Do5-90zl54')

# Open the CSV file we're going to write
f = open(file_out, 'a')

# Write the header
f.write('id,lat,lng\n')

# This function loops over all the rows in the file and fetches the coordinates
# for the specified address from Mapquest.
# i = column containing unique ID
# a = address (street) column
# c = city column
# s = state column
# z = zip column
def geocode(id,a,c,s,z):
	with open(file_in, 'rb') as ifile:
		reader = csv.reader(ifile)
		i = 0
		print 'Starting to fetch the coordinates...'
		for row in reader:
			address = (row[a] + ',' + row[c] + ',' + row[s] + ',' + row[z])
			
			#mapq.latlng returns lat lng in a dict
			latlng = mapq.latlng(address)
			lat = latlng.get('lat','-')
			lng = latlng.get('lng','-')
			f.write(row[id] + ',' + str(lat) + ',' + str(lng) + '\n')
			i += 1
			if (i%10) == 0:
				print (str(i) + ' locations fetched...')

if file_in == 'SCHOOLS.csv': 
	geocode(1,35,36,37,38)
elif file_in == 'ORGS.csv':
	geocode(0,2,3,4,5)

# Done. Close the file.
f.close()