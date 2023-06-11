from abc import abstractmethod

from Core.Core.Service.base import ServiceBase


class VisualizeData(ServiceBase):

    @abstractmethod
    def visualize(self):
        pass
