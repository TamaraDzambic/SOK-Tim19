from abc import abstractmethod

from Core.Service.base import ServiceBase


class VisualizeData(ServiceBase):

    @abstractmethod
    def visualize(self):
        pass
