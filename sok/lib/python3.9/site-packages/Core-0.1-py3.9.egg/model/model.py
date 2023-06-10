from abc import ABC, abstractmethod
from uuid import uuid4
import jsonpickle


class Node(ABC):

    @abstractmethod
    def __init__(self, **kwargs):
        super(Node, self).__init__()
        self._id = uuid4()
        self._name = kwargs.get("nodeName", None)
        self._terminal = kwargs.get("isTerminal", True)

    @property
    def id(self):
        return self._id

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, value: str):
        self._name = value

    @property
    def terminal(self):
        return self._terminal

    @terminal.setter
    def terminal(self, value: bool):
        self._terminal = value


    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "data": self.get_data()
        }

    @abstractmethod
    def get_data(self):
        pass

    def __str__(self):
        return self.name

    def __eq__(self, other):
        if isinstance(other, Node):
            return self._id == other.id
        return False


class Edge(ABC):

    @abstractmethod
    def __init__(self, **kwargs):
        super(Edge, self).__init__()
        self._id = uuid4()
        self._weight = kwargs.get("weight", None)
        self._node1 = kwargs.get("node1", None)
        self._node2 = kwargs.get("node2", None)

    @property
    def id(self):
        return self._id

    @property
    def weight(self):
        return self._weight

    @weight.setter
    def weight(self, value: float):
        self._weight = value

    @property
    def node1(self):
        return self._node1

    @node1.setter
    def node1(self, value: Node):
        self._node1 = value

    @property
    def node2(self):
        return self._node2

    @node2.setter
    def node2(self, value: Node):
        self._node2 = value

    def to_json(self):
        return{
            "id": self.id,
            "node1": self.node1.id,
            "node2": self.node2.id
        }

    def __str__(self):
        return "EDGE: " + str(self.node1) + " - " + str(self.node2)

    def __hash__(self):
        return hash(self._id)

    def __eq__(self, other):
        if isinstance(other, Edge):
            return self._id == other.id
        return False


class Graph:

    def __init__(self):
        super(Graph, self).__init__()
        self._nodes = {}
        self._edges = {}

    @property
    def nodes(self):
        return self._nodes

    @nodes.setter
    def nodes(self, value: dict):
        self._nodes = value

    @property
    def edges(self):
        return self._edges

    @edges.setter
    def edges(self, value: dict):
        self._edges = value

    def add_nodes(self, value: list):
        for node in value:
            self.add_node(node)

    def add_node(self, value: Node):
        node_type = value.__class__.__name__
        if node_type in self._nodes.keys():
            self._nodes.get(node_type).append(value)
        else:
            self._nodes[node_type] = []
            self._nodes.get(node_type).append(value)

    def add_edges(self, value: list):
        for edge in value:
            self.add_edge(edge)

    def add_edge(self, value: Edge):
        edge_type = value.__class__.__name__
        if edge_type in self._edges.keys():
            self._edges.get(edge_type).append(value)
        else:
            self._edges[edge_type] = []
            self._edges.get(edge_type).append(value)

    def filter_nodes(self, *args):
        return [self._nodes.get(arg) for arg in args if arg in self._nodes]

    def filter_edges(self, *args):
        return [self._edges.get(arg) for arg in args if arg in self._edges]

    def to_json(self):
        node_dict = {}
        edge_dict = {}

        for key, value in self.nodes.items():
            new_list = []
            for item in value:
                new_list.append(item.to_json())
            node_dict[key] = new_list

        for key, value in self.edges.items():
            new_list = []
            for item in value:
                new_list.append(item.to_json())
            edge_dict[key] = new_list
        return {"nodes": node_dict, "edges": edge_dict}


def serialize(graph: Graph):
    graph_json = jsonpickle.encode(graph)
    return graph_json


def deserialize(graph_json: str):
    graph = jsonpickle.decode(graph_json)
    return graph
