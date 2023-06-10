from abc import abstractmethod, ABC


class ServiceBase(ABC):
    @abstractmethod
    def identifier(self):
        pass

    @abstractmethod
    def name(self):
        pass
