import json
from Core.Core.models import Graph, Node, Edge, EdgeType
import itertools
from Core.Core.Service.load import LoadData


class LoadJSON(LoadData):
    def __init__(self):
        self.nodes = []
        self.edges = []
        self.graph = None
        self.id_iter = itertools.count()

    def name(self):
        return "Load JSON data"

    def identifier(self):
        return "json-data-load"

    def get_extension(self):
        return ".json"

    def restart_loader(self):
        self.nodes = []
        self.edges = []
        self.graph = None
        self.id_iter = itertools.count()

    def load(self, path):
        with open(path, "r") as f:
            data = json.load(f)
            root = Node("root", str(next(self.id_iter)))
            self.nodes.append(root)
            if isinstance(data, dict):
                for key in data.keys():
                    self.recursive(root, key, data[key])
            else:
                for d in data:
                    self.recursive(root, "root_child_list", d)

        self.edges = self.create_edges(root)

        self.create_additional_edges()
        print(self.edges)
        self.graph = Graph(self.nodes, self.edges)

        return self.graph

    def recursive(self, parent, node_name, rest):
        if isinstance(rest, dict):
            new_node = Node(node_name, str(next(self.id_iter)))
            self.nodes.append(new_node)
            parent.addChild(new_node)
            for key in rest.keys():
                self.recursive(new_node, key, rest[key])
        elif isinstance(rest, list):
            new_node = Node(node_name, str(next(self.id_iter)))
            self.nodes.append(new_node)
            parent.addChild(new_node)
            for ost in rest:
                self.recursive(new_node, "list_child", ost)
        else:
            parent.addAttr(node_name, rest)

    def create_edges(self, node):
        edges = []
        for child in node.children:
            edge = Edge(node, child, EdgeType.DIRECTED)
            edges.extend(self.create_edges(child))
            edges.append(edge)
        return edges

    def create_additional_edges(self):
        for node in self.nodes:
            for key in node.attributes.keys():
                if (key.lower() == "references" or key.lower() == "reference" or
                        key.lower() == "link" or key.lower() == "href"):

                    destination_name = node.attributes[key]
                    print("DESTINATION NAME = "+destination_name)
                    referenced_node = self.get_node_by_name(destination_name)
                    self.edges.append(Edge(node, referenced_node, EdgeType.DIRECTED))

    def get_node_by_name(self, ref_name):
        for node in self.nodes:
            if node.name == ref_name:
                return node
