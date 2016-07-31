import json
import pandas as pd

data = json.load(open("items.json"))
data_array = []

for item in data:
    try:
        if "," in item["license"]:
            item["license"] = "Multi-licensed"

        data_array.append([
            item["name"],
            item["author"],
            item["downloads"],
            item["license"],
            item["homepage"][0]
        ])
    except TypeError:
        data_array.append([
            item["name"],
            item["author"],
            item["downloads"],
            item["license"],
            item["homepage"]
        ])

df = pd.DataFrame(
    data_array,
    columns=["name", "author", "downloads", "license", "homepage"]
)
