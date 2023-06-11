from abc import abstractmethod

from Core.Service.base import ServiceBase


class LoadData(ServiceBase):

    @abstractmethod
    def load(self, path):
        pass

    @abstractmethod
    def get_extension(self):
        pass

    @abstractmethod
    def restart_loader(self):
        pass
