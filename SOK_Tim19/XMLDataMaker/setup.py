from setuptools import setup, find_packages

setup(
    name="XMLDataMaker",
    version="0.1",
    packages=find_packages(),
    install_requires=['Core>=0.1'],
    entry_points={
        'data.load':
            ['xml_load=XMLDataMaker.data_load_xml:LoadXML']
    },
    zip_safe=True
)