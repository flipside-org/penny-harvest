#!/bin/bash --posix

# Script to process Common Cents data

# INSTRUCTIONS
# $ bash process_ph-processor.sh -i [file-name]
# Example: bash ph-processor.sh -i Map_data.xls

# OUTPUT
# A de-normalized CSV file with totals of the indicator per administrative
# area.

# TODO
# review //TEMP
# Add check for XLS or XLSX
# Line-breaks and _x000D_ should be cleaned up
# Check format of date last updated
# Check if geocode.py is available

set -u

typeset -r start_time=$SECONDS

error()
{
	echo >&2 $*
	exit 1
}

usage()
{
	cat >&2 <<-EOF
		Usage : $0 -i map_data.xls
			-i input file
			-h help
	EOF
}

typeset var_input=""

while getopts "i:o:h" option
do
	case $option in
	i)
		var_input="$OPTARG"
		;;
	h)
		usage
		exit 0
		;;
	*)
		usage
		exit 1
		;;
	esac
done

# check that args not empty
# //TEMP we could make better checks
[[ $var_input != "" ]] || { usage; exit 1;}

# The folder should not contain the final file already
#[[ ! -f $var_output ]] || error "It seems you already have a $var_output in this folder. Remove it and run this script again."

#The sheets in the Excel that need to be processed
typeset -r sheets=(SCHOOLS GRANTS ORGS)

#The years the data is about
typeset -r years=(5yrs 2013 2012 2011 2010 2009)

#The MapQuest API key
typeset -r mq_api=Fmjtd%7Cluur290y2h%2Cr5%3Do5-90zl54

#Change Internal Field Separator to new line. Otherwise, it will think spaces in filenames are field separators
typeset -r IFS=$'\n'

#Checking if the dependencies are met.

# check that geocode.py is available
typeset -r cmd_geocode="geocode.py"
[[ -f $cmd_geocode ]] || error "This script needs $cmd_geocode"

#Some of the tools used are part of csvkit, like in2csv, csvjoin, csvstack, etc
#Based on: http://www.snabelb.net/content/bash_support_function_check_dependencies
# for portability and just in case which is not available
typeset -r cmd_which="/usr/bin/which"
[[ -x $cmd_which ]] || error "$cmd_which command not found"

# check that every command is available and executable
for command in in2csv csvcut csvjoin python wget unzip sed
do
	if [[ $command == "in2csv" ]]
	then
		typeset -r cmd_in2csv=$($cmd_which in2csv)
		if [[ ! -x $cmd_in2csv ]]
		then
			# but keep initial echo
			echo -e "\nThis script requires a couple of tools that are provided by csvkit."
			echo -e "You might be able to install csvkit by using:"
			echo -e "\t$ sudo pip install csvkit"
			echo -e "More info: http://csvkit.readthedocs.org/en/latest/index.html#installation"
			exit 1
		fi
	else
		typeset -r cmd_$command=$($cmd_which $command)
		[[ -x $(eval echo \$cmd_$command) ]] || error "$cmd_$command command not found"
	fi
done

# Check if the input file is actually present
[[ -f $var_input ]] || error "It seems the input file is not present."

#Convert each relevant sheet in the Excel file to its own CSV file + some other
#cleaning up.
# //TEMP add multiprocessing 
for sheet in ${sheets[*]}
do
	echo "Start processing data on $sheet"
	#Xls -> csv on the sheet that matters
	$cmd_in2csv --sheet $sheet $var_input > $sheet.csv
	#Remove line breaks
	$cmd_sed -i -e "s/_x000D_/ /" $sheet.csv
	elapsed_time=$(($SECONDS - $start_time))
	echo "$elapsed_time seconds. done"
done


#Clean up the school sheet

#First line doesn't contain the actual headers
$cmd_sed -i -e "1D" SCHOOLS.csv

#Clean up the column headers of the schools and add an indication of the year.
for year in ${years[*]}
do
	$cmd_sed -i "0,/# of Grants/{s/# of Grants/number_grants_$year/}" SCHOOLS.csv
	$cmd_sed -i "0,/# of Service Projects/{s/# of Service Projects/number_service_projects_$year/}" SCHOOLS.csv
	$cmd_sed -i "0,/$ Grants/{s/$ Grants/amount_grants_$year/}" SCHOOLS.csv
	$cmd_sed -i "0,/PH (Held Collection)/{s/PH (Held Collection)/ph_held_collection_$year/}" SCHOOLS.csv
	$cmd_sed -i "0,/RT (Held Roundtable)/{s/RT (Held Roundtable)/rt_held_roundtable_$year/}" SCHOOLS.csv
done

#Clean up of the Grant sheet

#Remove all the organization related information that is available on the other
#sheets as well.
$cmd_csvcut -C 12,13,14,15,16,17,18,19 GRANTS.csv > GRANTS-tmp.csv
rm GRANTS.csv
mv GRANTS-tmp.csv GRANTS.csv

elapsed_time=$(($SECONDS - $start_time))
echo "$elapsed_time seconds. Initial conversion and some housekeeping taken care of."

#Geocode the organisations
touch latlng_orgs.csv
$cmd_python $cmd_geocode latlng_orgs.csv ORGS.csv
#Merge the files
$cmd_csvjoin ORGS.csv latlng_orgs.csv -c 1,1 > ORGS-tmp.csv
rm ORGS.csv
rm latlng_orgs.csv
mv ORGS-tmp.csv ORGS.csv

#Geocode the organisations
touch latlng_schools.csv
$cmd_python $cmd_geocode latlng_schools.csv SCHOOLS.csv
$cmd_csvjoin SCHOOLS.csv latlng_schools.csv --left -c 2,1 > SCHOOLS-tmp.csv
rm SCHOOLS.csv
rm latlng_schools.csv
mv SCHOOLS-tmp.csv SCHOOLS.csv

elapsed_time=$(($SECONDS - $start_time))
echo "$elapsed_time seconds. Geocoding done."

exit 0

# EOF