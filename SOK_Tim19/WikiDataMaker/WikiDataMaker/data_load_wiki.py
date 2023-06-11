import itertools
import requests
from bs4 import BeautifulSoup

from Core.models import Graph, Node, Edge, EdgeType
from Core.Service.load import LoadData


class LoadWikipedia(LoadData):
    def __init__(self):
        self.nodes = []
        self.edges = []
        self.graph = None
        self.id_iter = itertools.count()

    def identifier(self):
        return "wikipedia-data-load"

    def name(self):
        return "Load Wikipedia data"

    def get_extension(self):
        return ".html"

    def restart_loader(self):
        self.nodes = []
        self.edges = []
        self.graph = None
        self.id_iter = itertools.count()

    def load(self, page):
        print("Wikipedia")
        with open(page, "r") as f:
            html_content = f.read()

        root = Node("root", str(next(self.id_iter)))
        self.nodes.append(root)

        soup = BeautifulSoup(html_content, 'html.parser')
        root_node = Node(page, str(next(self.id_iter)))

        for link in soup.find_all("a"):
            href = link.get('href')
            if href and '/wiki/' in href:
                node = Node(href, str(next(self.id_iter)))
                self.nodes.append(node)
                root_node.children.append(node)

        self.nodes.append(root_node)
        self.edges = self.create_edges(root_node)

        self.graph = Graph(self.nodes, self.edges)
        return self.graph

    def create_edges(self, node):
        edges = []
        for child in node.children:
            edge = Edge(node, child, EdgeType.DIRECTED)
            edges.append(edge)
        return edges