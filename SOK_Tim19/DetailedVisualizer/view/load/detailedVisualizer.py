import pkg_resources

from Core.Service.visualize import VisualizeData


class DetailedVisualizer(VisualizeData):
    def visualize(self):
        return pkg_resources.resource_string(__name__, 'detailed_main_view.js')

    def identifier(self):
        return "detailed_visualizer"

    def name(self):
        return "plugin_for_detailed_visualization"