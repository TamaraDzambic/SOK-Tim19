import copy

import pkg_resources
from django.apps.registry import apps
from django.shortcuts import render, redirect
import os
from django.http import JsonResponse, HttpResponse
import jsonpickle
from django.views.decorators.csrf import csrf_exempt

def index(request):
    load_plugins = apps.get_app_config('Core').plugins_load
    view_plugins = apps.get_app_config('Core').plugins_visualize
    print("-------------------------------------------------load ", load_plugins , " view ", view_plugins)
    return render(request, "index.html", {"title": "Index", "load_plugins": load_plugins, "view_plugins": view_plugins})

def ucitavanje_plugin(request, id):
    request.session['izabran_plugin_ucitavanje'] = id
    plugini = apps.get_app_config('Core').plugins_load

    for i in plugini:
        if i.identifier() == id:
            i.load()
    return redirect('index')

@csrf_exempt
def load_graph(request):
    text = request.POST.get('fileText')
    reader_id = request.POST.get('sourceId')
    source_plugins = apps.get_app_config('Core').plugins_load
    chosen_source = None

    for r in source_plugins:
        if r.identifier() == reader_id:
            chosen_source = r

    if(chosen_source is None):
        return HttpResponse(status=200)

    file_path = "file" + chosen_source.get_extension()
    f = open(file_path, "w")
    f.write(text)
    f.close()

    graph = chosen_source.load(os.path.abspath(file_path))
    chosen_source.restart_loader()

    apps.get_app_config('Core').graph = graph
    apps.get_app_config('Core').searchedGraph = copy.deepcopy(graph)
    graph_json = jsonpickle.encode(graph, unpicklable=False)
    return JsonResponse(graph_json, safe=False)


def tree_view(request):
    html_graph_script = pkg_resources.resource_string(__name__, 'static/tree_view.js')

    return render(request, "tree_view.html",{
                    "tree_script" : html_graph_script.decode("utf-8"),
                    "graph" : apps.get_app_config('Core').searchedGraph
                    })


def bird_view(request):

    html_graph_script = pkg_resources.resource_string(__name__, 'static/bird_view.js')

    return render(request, "bird_view.html", {
        "script": html_graph_script.decode("utf-8"),
        "graph": apps.get_app_config('Core').searchedGraph
    })


def main_view(request, id):
    view_plugins = apps.get_app_config('Core').plugins_visualize

    if apps.get_app_config('Core').graph is not None:
        tree_view(request)
        view_id = "complex_visualizer"
        if id == "basic":
            view_id = "basic_visualizer"
        chosen_visualizer = None

        for r in view_plugins:
            if r.identifier() == view_id:
                chosen_visualizer = r

        html_graph_script = chosen_visualizer.visualize()
        html_tree_script = pkg_resources.resource_string(__name__, 'static/tree_view.js')
        html_bird_script = pkg_resources.resource_string(__name__, 'static/bird_view.js')
        return render(request, "tree_view.html", {
            "main_script": html_graph_script.decode("utf-8"),
            "tree_script": html_tree_script.decode("utf-8"),
            "bird_script": html_bird_script.decode("utf-8"),
            "graph": apps.get_app_config('Core').searchedGraph,
            "loadedGraph": apps.get_app_config('Core').graph
        })
    else:
        return redirect('index')


def get_children(request):
    node_id =  request.GET["node_id"]
    children = []
    for edge in apps.get_app_config('Core').graph.edges:
        if node_id == edge.source.node_id:
            children.append(edge.destination)
    children_json = jsonpickle.encode(children, unpicklable=False)
    return JsonResponse(children_json, safe=False)

