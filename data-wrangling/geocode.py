#!/usr/bin/python
# -*- coding: UTF-8 -*-

# This script is used to process Penny Harvest data on schools & organisations
# Uses mapq (https://pypi.python.org/pypi/mapq) to access Mapquest API
# More info on Mapquest API: http://open.mapquestapi.com/geocoding/

# @param string file_out
# The name of the output file
#
# @param string file_in
# The csv file containing the data
#
# @param string api_key
# The MapQuest API key

import csv
import sys
import mapq

file_out = sys.argv[1] 
file_in = sys.argv[2]
api_key = sys.argv[3]

# Mapquest API key
mapq.key(api_key)

# This function loops over all the rows in the file and fetches the coordinates
# for the specified address from Mapquest.
# uid = column containing unique ID
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
			f.write(row[uid] + ',' + str(lat) + ',' + str(lng) + '\n')
			i += 1
			if (i%10) == 0:
				print (str(i) + ' locations fetched...')

# Open the CSV file we're going to write
f = open(file_out, 'a')

# Write the header
f.write('id,lat,lng\n')

# Check where the ID and Address columns are located in the csv
with open(file_in, 'rb') as ifile:
	reader = csv.reader(ifile)
	header = list(reader)[0]
	if file_in == 'SCHOOLS.csv':
		uid = header.index("School ID")
	elif file_in == 'ORGS.csv':
		uid = header.index("ORG ID")
	a = header.index("Address")
	c = header.index("City")
	s = header.index("State")
	z = header.index("Zip")

geocode(uid,a,c,s,z)
		
# Done. Close the file.
f.close()