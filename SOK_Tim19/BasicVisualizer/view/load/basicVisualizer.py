
import pkg_resources

from d3_primeri.services.visualize import VisualizeData


class BasicVisualizer(VisualizeData):
    def visualize(self):
        return pkg_resources.resource_string(__name__, 'basic_main_view.js')

    def identifier(self):
        return "basic_visualizer"

    def name(self):
        return "plugin_for_basic_visualization"