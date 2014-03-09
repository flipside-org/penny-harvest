#!/bin/bash --posix

# The bit below was used to generate a GeoJSON based on the map data.
# Obsolete since Jekyll will generate the GeoJSON itself.

##############################################################################
# Generate a Geojson using ogr2ogr

# We don't need all the information in the geojson. Cut out obsolete info
$cmd_csvcut -c 1,2,11,38,39 ORGS.csv > orgs-map.csv
$cmd_csvcut -c 2,3,51,52 SCHOOLS.csv > schools-map.csv

for entity in schools orgs
do
	# Remove existing geojson, otherwise ogr2ogr won't behave well
	rm $entity-map.geojson

	# We need to create a .VRT to let ogr2ogr know how it can extract the 
	# spatial information
	# http://gis-lab.info/docs/gdal/gdal_ogr_user_docs.html#csv
	echo "<OGRVRTDataSource>
		<OGRVRTLayer name=\"$entity-map\">
			<SrcDataSource>$entity-map.csv</SrcDataSource>
	    	<GeometryType>wkbPoint</GeometryType>
	    	<LayerSRS>EPSG:4326</LayerSRS>
	    	<GeometryField encoding=\"PointFromColumns\" x=\"lng\" y=\"lat\"/>
		</OGRVRTLayer>
	</OGRVRTDataSource>" > $entity-map.vrt

	ogr2ogr -f GeoJSON -gt 65536 -nlt POINT $entity-map.geojson $entity-map.vrt
done