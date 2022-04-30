from turfpy.measurement import boolean_point_in_polygon
from geojson import Point, Polygon, Feature
import sys

latitude = float(sys.argv[1])
longitude = float(sys.argv[2])

polygon_value = sys.argv[3]
arr = []

# polygon_value = "[[28.447327654314645, 77.05644636541761], [28.44954199271126, 77.07947048342233], [28.472493577016255, 77.07947048342233], [28.470278082737615, 77.05644636541761]]"

polygon_value = polygon_value[1:-1]

# print(polygon_value)
arr = polygon_value.split(",")
arr2 = []
count = 0
# print(arr)
for i in arr:
    s = i.strip()

    if(count % 2 == 0):

        arr2.append(float(s[1:]))
    else:

        arr2.append(float(s[:-1]))
    count += 1

print(arr2)

result = []

j = 0

while j < len(arr2):
    current = []
    current.append(arr2[j])
    current.append(arr2[j+1])
    result.append(current)
    j += 2


point = Feature(geometry=Point((28.5521611, 77.3204418)))
huda = Polygon(
    [
        [28.447327654314645, 77.05644636541761, 28.44954199271126, 77.07947048342233,
            28.472493577016255, 77.07947048342233, 28.470278082737615, 77.05644636541761]
    ]
)
#  [
#             (28.447327654314645, 77.05644636541761),
#             (28.44954199271126, 77.07947048342233),
#             (28.472493577016255, 77.07947048342233),
#             (28.470278082737615, 77.05644636541761)
#         ]

if boolean_point_in_polygon(point, huda) == True:
    print(True)

else:
    print(False)
