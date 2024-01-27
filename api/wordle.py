import json

f = open('api/words.json')

data = json.load(f)
point = list(map(list, data))
#print(point)
""" for i in data:
    print(i)
    for l in i:
        print(l)  """
#print(point[2])
for i in point:
    print(i)
    
f.close()