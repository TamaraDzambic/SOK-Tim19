import itertools

from Core.models import Graph, Node, Edge, EdgeType
from Core.Service.load import LoadData
import xml.etree.ElementTree as ET


class LoadXML(LoadData):
    def __init__(self):
        self.nodes = []
        self.edges = []
        self.graph = None
        self.id_iter = itertools.count()

    def identifier(self):
        return "xml-data-load"

    def name(self):
        return "Load XML data"

    def get_extension(self):
        return ".xml"

    def restart_loader(self):
        self.nodes = []
        self.edges = []
        self.graph = None
        self.id_iter = itertools.count()

    def load(self, path):
        print("XML")
        tree = ET.parse(path)
        root = tree.getroot()
        root_node = Node(root.tag, str(next(self.id_iter)))
        if len(root.attrib.keys()) > 0:
            root_node.attributes = root.attrib
        if root.text is not None and root.text.strip() != "":
            root_node.attributes["text"] = root.text
        root_node.children = self.get_children(root, root_node)


        self.nodes.append(root_node)
        self.edges = self.create_edges(root_node)
        self.create_additional_edges()

        self.graph = Graph(self.nodes, self.edges)
        return self.graph

    def get_children(self, element, parent):
        children = []
        if len(element) == 0 and len(element.attrib) == 0:
            parent.attributes[element.tag] = element.text
        else:
            for child in element:
                if len(child) == 0 and len(child.attrib) == 0:
                    parent.attributes[child.tag] = child.text
                    continue
                node = Node(child.tag, str(next(self.id_iter)))
                if len(child.attrib.keys()) > 0:
                    node.attributes = child.attrib
                if child.text is not None and child.text.strip() != "":
                    node.attributes["text"] = child.text.strip()
                self.nodes.append(node)
                node.children.extend(self.get_children(child, node))
                children.append(node)
        return children

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
                    referenced_node = self.get_node_by_name(destination_name)
                    self.edges.append(Edge(node, referenced_node, EdgeType.DIRECTED))

    def get_node_by_name(self, destination_name):
        for node in self.nodes:
            if node.name == destination_name:
                return node