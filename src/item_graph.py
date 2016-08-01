import json
import networkx as nx
import matplotlib.pyplot as plt
import pandas as pd

def to_sigmajs_graph(Graph, layout):
    edge_counter = 0
    node_counter = 0
    json_object = dict()
    node_map = dict()
    json_object["nodes"] = []
    json_object["edges"] = []

    for name, data in Graph.nodes_iter(data=True):
        o = {}
        node_map[name] = "n{}".format(node_counter)
        o["id"] = "n{}".format(node_counter)
        o["label"] = name
        o["size"] = data.get("downloads") if data.get("downloads") else 1
        o["x"], o["y"] = layout[name]

        json_object["nodes"].append(o)
        node_counter += 1

    for source, target, data in Graph.edges_iter(data=True):
        o = {}
        o["id"] = "e{}".format(edge_counter)
        o["source"] = node_map[source]
        o["target"] = node_map[target]

        json_object["edges"].append(o)
        edge_counter += 1

    json.dump(json_object, open("../data/dependency.json", "wb"))

data = json.load(open("items.json"))
weight = 1
data_array = []
G = nx.DiGraph()

for item in data:
    G.add_node(
        item["name"],
        {"author": item["author"], "downloads": item["downloads"]}
    )

    for dep in item["dependencies"]:
        G.add_edge(item["name"], dep, {"weight": weight})
        weight += 0.1

    for dep in item["dependents"]:
        G.add_edge(dep, item["name"], {"weight": weight})
        weight += 0.1

for edge in G.edges_iter(data=True):
    data_array.append([
        edge[0], edge[1], edge[2]["weight"]
    ])

pd.DataFrame(G.nodes(), columns=["id"]).to_csv("nodes.csv")
pd.DataFrame(map(list, G.edges()), columns=["Source", "Target"]).to_csv("edges.csv")
