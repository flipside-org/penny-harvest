#!/usr/bin/python
# -*- coding: UTF-8 -*-

# Script to generate Penny Harvest organisation profiles in Markdown format
# The data should be provided in CSV format and the script outputs one md file
# per organization.
#
# @param string folder_out
# The name of the output folder
#
# @param string file_in
# The csv file containing the data

# TODO
# Checks on the output folder  // If not empty, ask user if we should continue anyway
# Replace spaces for hyphens in the title (just in case)
# Indent all paragraphs of the mission statement

import csv
import sys
import arrow

folder_out = sys.argv[1] 
file_in = sys.argv[2]


def indent(n = 1):
	base_indentation = '  '
	return base_indentation * n


with open(file_in, 'rb') as ifile:

	# Fetch the index of each relevant column. This allows for some flexibility
	# in column position and does a check if all mandatory columns are present
	reader = csv.reader(ifile)
	header = reader.next()

	# Dict with the variable names (key) and the relevant column names (value)
	cols = { 'oid' : 'ORG ID', 'name' : 'Organization_name', 'add' : 'Address', 'cit' : 'City', 'st' : 'State', 'zip' : 'Zip', 'locs' : 'Location_of_services', 'loco' : 'Location_of_offices', 'web': 'Website', 'keyw' : 'Keywords', 'imp' : 'Impact Area', 'miss' : 'Org Mission', 'descr' : 'Organization_overview', 'cash' : 'Cash_grants', 'cash1' : 'Description_of_cash_grants_1', 'cash2' : 'Description_of_cash_grants_2', 'serv' : 'Service_opportunities', 'serv1' : 'Description_of_service_opportunity_1', 'serv2' : 'Description_of_service_opportunity_2', 'learn' : 'How_can_you_help_students_learn_more_about_you', 'cont' : 'How_can_you_continue_the_relationship_afterwards', 'sal' : 'Salutation', 'first' : 'First_Name', 'last' : 'Last_Name', 'title' : 'Title', 'intro' : 'Introduction', 'ph' : 'Phone', 'ext' : 'Extension', 'fax' : 'Fax', 'email' : 'Email', 'meth' : 'Preferred_Method_of_Contact', 'time' : 'Best_Time_to_Contact', 'lat' : 'lat', 'lng' : 'lng' }
	fields = { }
	error = False

	# Loop over key & value of the 'cols' dict and build the 'fields' dict with 
	# convenient variable name (key) and the position of the column in the CSV 
	# (value)

	for key,value in cols.iteritems():	
		try:
			fields[key] = header.index(value)
		except ValueError:
			print "A column '" + value + "' was not found."
			error = True
	
	if error == True:
		print "Please check your CSV and try again."
		sys.exit(0)

	utc = arrow.utcnow()
	timestamp = utc.format('YYYY-MM-DD')

	# Generate a markdown file for each row in the CSV
	for row in reader:

		# Replace any colon in the title for a hyphen
		row[fields['name']] = row[fields['name']].replace(':', '-')

		# Replace any carriage return (_x000D_) with a newline (\n)
		row[fields['descr']] = row[fields['descr']].replace('_x000D_', '\n')

		# To be able to include the mission as a YAML variable, we need to indent all the paragraphs of the mission statement.

		# Create file with proper file-name. Jekyll requires every file to start
		# with a date
		file_out = folder_out + '/' + timestamp + '-' + row[fields['oid']] + '.md'

		f = open(file_out, 'w')

		f.write('---\n')
		f.write('layout: organization\n')
		f.write('category: organization\n')
		f.write('\n')
		f.write('title: ' + row[fields['name']] + '\n')
		f.write('impact_area: ' + row[fields['imp']] + '\n')
		f.write('keywords: ' + row[fields['keyw']] + '\n')
		f.write('coordinates: ' + row[fields['lat']] + ',' + row[fields['lng']] + '\n')
		#f.write('mission: |\n')
		#f.write(indent() + row[fields['miss']] + '\n')
		f.write('address: |\n')
		f.write(indent() + row[fields['add']] + '\n')
		f.write(indent() + row[fields['cit']] + ' ' + row[fields['st']] + ' ' + row[fields['zip']]+ '\n')
		f.write('---\n')
		f.write('Organization\'s overview\n')
		f.write(row[fields['descr']])
		
		# Done. Close the file.
		f.close()