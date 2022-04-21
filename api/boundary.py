from s2 import s2
import sys

latitide = sys.argv[1]
longitude = sys.argv[2]

lat, lon, res = 28.459841396316087, 77.07269457671096, 12

s2_address = s2.geo_to_s2(lat, lon, res)
print(s2.s2_to_geo_boundary(s2_address))

