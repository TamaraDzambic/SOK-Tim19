import os
import itertools

from Core.models import Graph, Node, Edge, EdgeType
from Core.Service.load import LoadData


class LoadFileSystem(LoadData):
    def __init__(self):
        self.nodes = []
        self.edges = []
        self.graph = None
        self.id_iter = itertools.count()

    def identifier(self):
        return "filesystem-data-load"

    def name(self):
        return "Load File System data"

    def get_extension(self):
        return ""

    def restart_loader(self):
        self.nodes = []
        self.edges = []
        self.graph = None
        self.id_iter = itertools.count()

    def load(self, path):
        print("FileSystem")
        root_node = Node(path, str(next(self.id_iter)))
        root_node.children = self.get_children(path, root_node)

        self.nodes.append(root_node)
        self.edges = self.create_edges(root_node)

        self.graph = Graph(self.nodes, self.edges)
        return self.graph

    def get_children(self, path, parent):
        children = []
        try:
            for child in os.listdir(path):
                child_path = os.path.join(path, child)
                node = Node(child, str(next(self.id_iter)))
                if os.path.isdir(child_path):
                    self.nodes.append(node)
                    node.children.extend(self.get_children(child_path, node))
                children.append(node)
        except PermissionError:
            pass  # Ignore directories which you don't have permission to access
        return children

    def create_edges(self, node):
        edges = []
        for child in node.children:
            edge = Edge(node, child, EdgeType.DIRECTED)
            edges.extend(self.create_edges(child))
            edges.append(edge)
        return edges
