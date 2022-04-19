from turfpy.measurement import boolean_point_in_polygon
from geojson import Point, Polygon, Feature
import sys

latitide = sys.argv[1]
longitude = sys.argv[2]
polygon_value = sys.argv[3]
point = Feature(geometry=Point((latitude,longitude)))
# 28.45887225411676, 77.07300588538627
huda = Polygon(
    [
        polygon_value
    ]
)
#  [
            # (28.447327654314645, 77.05644636541761),
            # (28.44954199271126, 77.07947048342233),
            # (28.472493577016255, 77.07947048342233),
            # (28.470278082737615, 77.05644636541761)
        # ]

if boolean_point_in_polygon(point, huda) == True:
    print(True)

else :
    print(False)