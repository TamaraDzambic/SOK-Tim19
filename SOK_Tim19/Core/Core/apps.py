import pkg_resources
from django.apps import AppConfig


class CoreConfig(AppConfig):
    name = 'Core'
    plugins_load = []
    plugins_visualize = []
    graph = None
    searchedGraph = None

    def ready(self):
        self.plugins_load = load_plugins("data.load")
        self.plugins_visualize = load_plugins("view.load")


def load_plugins(mark):
    plugins = []
    for ep in pkg_resources.iter_entry_points(group=mark):
        p = ep.load()
        print("{} {}".format(ep.name, p))
        plugin = p()
        plugins.append(plugin)
    return plugins
