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

import csv
import sys
import arrow

folder_out = sys.argv[1] 
file_in = sys.argv[2]


def indent(n = 1):
	base_indentation = '  '
	return base_indentation * n

def sanitize_br(text):
	"Replace the _x000D_ for proper line-breaks and returns. First we remove the line-breaks, any remaining _x000D_ is assumed to be an actual return."
	return text.replace(' _x000D_\n', ' ').replace('_x000D_\n','\n\n').replace('_x000D_','')

def yaml_array(text, separator = ','):
	"Splits a string by a separator and stores the result as a YAML array"
	if text.strip(' \n'):
		array = ''
		for keyword in text.split(separator):
			array += '\n' + indent() + '- ' + keyword
		return array
	else:
		# If empty, we return nothing
		return ''

def yaml_multiline_string(text, is_array = False):
	"Turns a string into a properly formatted multiline string to be used as a YAML variable. If is_array is set to true, the multiline string will be formatted as a YAML array"
	if text.strip(' \n'):
		# Add pipe and indent first paragraph
		# 1. replace line-breaks, 2. replace return + indent paragraph, 
		# 3. clean up remaining -_x000D_."	
		prepend = ''
		indentation = 1
		# The syntax for multiline string array, is slightly different and requires
		# a hyphen before the pipe and extra indentation
		if is_array:
			prepend = '\n' + indent(indentation) + '- '
			indentation = 2
		text = prepend + '|\n' + indent(indentation) + text.replace(' _x000D_\n', ' ').replace('_x000D_\n','\n\n' + indent(indentation)).replace('_x000D_','')
		return text
	else:
		# If empty, we return nothing
		return ''

md_linebreak = '  '


with open(file_in, 'rb') as ifile:

	# Fetch the index of each relevant column. This allows for some flexibility
	# in column position and does a check if all mandatory columns are present
	reader = csv.reader(ifile)
	header = reader.next()

	# Dict with the variable names (key) and the relevant column names (value)
	cols = { 'oid' : 'ORG ID', 'name' : 'Organization_name', 'add' : 'Address', 'cit' : 'City', 'st' : 'State', 'zip' : 'Zip', 'nat' : 'National', 'locs' : 'Location_of_services', 'loco' : 'Location_of_offices', 'web': 'Website', 'keyw' : 'Keywords', 'imp' : 'Impact Area', 'miss' : 'Org Mission', 'descr' : 'Organization_overview', 'cash' : 'Cash_grants', 'cash1' : 'Description_of_cash_grants_1', 'cash2' : 'Description_of_cash_grants_2', 'serv' : 'Service_opportunities', 'serv1' : 'Description_of_service_opportunity_1', 'serv2' : 'Description_of_service_opportunity_2', 'learn' : 'How_can_you_help_students_learn_more_about_you', 'cont' : 'How_can_you_continue_the_relationship_afterwards', 'sal' : 'Salutation', 'first' : 'First_Name', 'last' : 'Last_Name', 'title' : 'Title', 'intro' : 'Introduction', 'ph' : 'Phone', 'ext' : 'Extension', 'fax' : 'Fax', 'email' : 'Email', 'meth' : 'Preferred_Method_of_Contact', 'time' : 'Best_Time_to_Contact', 'lat' : 'lat', 'lng' : 'lng' }
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

		# Define the note category
		if row[fields['nat']]:
			category = "national_org"
		else:
			category = "local_org"

		# Sanitize the prefered contact method. We have to account for multiple
		# contact methods.
		dirty_method = row[fields['meth']]
		sane_method = [ ]
		if dirty_method.find('mail') != -1 or dirty_method.find('@') != -1:
			sane_method.append('email')
		if dirty_method.find('phone') != -1:
			sane_method.append('phone')
		sane_method = ",".join(sane_method)

		# Create file with proper file-name. Jekyll requires every file to start
		# with a date
		file_out = folder_out + '/' + timestamp + '-' + row[fields['oid']] + '.md'

		f = open(file_out, 'w')

		f.write('---\n')
		f.write('layout: organization\n')
		f.write('category: ' + category + '\n')
		f.write('\n')
		f.write('title: ' + row[fields['name']] + '\n')
		f.write('impact_area: ' + row[fields['imp']] + '\n')
		f.write('keywords: ' + yaml_array(row[fields['keyw']]) + '\n')
		f.write('location_services: ' + row[fields['locs']] + '\n')
		f.write('location_offices: ' + row[fields['loco']] + '\n')
		f.write('website: ' + row[fields['web']] + '\n')
		f.write('\n')
		f.write('mission: ' + yaml_multiline_string(row[fields['miss']]) + '\n')
		f.write('\n')
		f.write('cash_grants: ' + row[fields['cash']] + '\n')
		f.write('grants: ' + yaml_multiline_string(row[fields['cash1']], True) + yaml_multiline_string(row[fields['cash2']], True) + '\n')
		f.write('service_opp: ' + row[fields['serv']] + '\n')
		f.write('services: ' + yaml_multiline_string(row[fields['serv1']], True) + yaml_multiline_string(row[fields['serv2']], True) + '\n')
		f.write('\n')
		f.write('learn: ' + yaml_multiline_string(row[fields['learn']]) + '\n')
		f.write('cont_relationship: ' + yaml_multiline_string(row[fields['cont']]) + '\n')
		f.write('\n')
		f.write('salutation: ' + row[fields['sal']] + '\n')
		f.write('first_name: ' + row[fields['first']] + '\n')
		f.write('last_name: ' + row[fields['last']] + '\n')
		f.write('title_contact_person: ' + row[fields['title']] + '\n')
		f.write('\n')
		f.write('address: |\n')
		f.write(indent() + row[fields['add']] + md_linebreak  + '\n')
		f.write(indent() + row[fields['cit']] + ' ' + row[fields['st']] + ' ' + row[fields['zip']] + '\n')
		f.write('lat: ' + row[fields['lat']] + '\n')
		f.write('lng: ' + row[fields['lng']] + '\n')
		f.write('phone: ' + row[fields['ph']] + '\n')
		f.write('ext: ' + row[fields['ext']] + '\n')
		f.write('fax: ' + row[fields['fax']] + '\n')
		f.write('email: ' + row[fields['email']] + '\n')		
		f.write('preferred_contact: ' + str(sane_method) + '\n')
		f.write('contact_person_intro: ' + yaml_multiline_string(row[fields['intro']]) + '\n')
		f.write('---\n')
		f.write(sanitize_br(row[fields['descr']]))
		
		# Done. Close the file.
		f.close()