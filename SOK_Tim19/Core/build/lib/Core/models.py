import itertools

from django.db import models
from enum import Enum


class EdgeType(Enum):
    DIRECTED = 0
    UNDIRECTED = 1


class Node:
    def __init__(self, name, node_id):
        self.attributes = {}
        self.children = []
        self.name = name
        self.node_id = node_id
        self.init_node_id = node_id

    def addAttr(self, key, value):
        self.attributes[key] = value

    def addChild(self, child):
        self.children.append(child)

    def __str__(self):
        string = self.node_id+", "+self.name
        return string


class Edge:
    def __init__(self, source, destination, edge_type):
        self.source = source
        self.destination = destination
        self.edge_type = edge_type

    def __str__(self):
        return self.source.name + " - " + self.destination.name

class Graph:
    def __init__(self, nodes, edges):
        self.nodes = nodes
        self.edges = edges

    def search(self, searchVal):
        id_iter = itertools.count()
        print("Pretraga ", searchVal)
        searchedNodes = []
        for node in self.nodes:
            if node.name.lower().find(searchVal.lower()) > -1:
                node.node_id = str(next(id_iter))
                searchedNodes.append(node)
                continue
            for key, value in node.attributes.items():
                if value.lower().find(searchVal.lower()) > -1:
                    node.node_id = str(next(id_iter))
                    searchedNodes.append(node)
                    break
        searchedEdges = []
        for edge in self.edges:
            if edge.source in searchedNodes and edge.destination in searchedNodes:
                searchedEdges.append(edge)
        return Graph(searchedNodes, searchedEdges)

    def filter(self, filterVal):
        operators = ["==", "!=", "<=", ">=", "<", ">"]
        operator = None
        id_iter = itertools.count()

        for op in operators:
            if op in filterVal:
                operator = op
                break
        attr, valueInput = filterVal.split(operator)
        attr = attr.strip()
        valueInput = valueInput.strip()
        filterNodes = []
        for node in self.nodes:
            for key, valueNode in node.attributes.items():
                if key == attr:
                    if self.compare(operator, valueInput.lower(), valueNode.lower()):
                        node.node_id = str(next(id_iter))
                        filterNodes.append(node)
                        break
        filterEdges = []
        for edge in self.edges:
            if edge.source in filterNodes and edge.destination in filterNodes:
                filterEdges.append(edge)

        return Graph(filterNodes, filterEdges)

    def compare(self, op, valueInput, valueNode):
        if valueInput.isnumeric() and valueNode.isnumeric():
            valueInput = float(valueInput)
            valueNode = float(valueNode)
        if op == "==":
            return valueInput == valueNode
        elif op == "!=":
            return valueInput != valueNode
        elif op == "<=":
            return valueNode <= valueInput
        elif op == ">=":
            return valueNode >= valueInput
        elif op == "<":
            return valueNode < valueInput
        elif op == ">":
            return valueNode > valueInput
