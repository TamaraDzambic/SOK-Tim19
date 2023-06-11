from setuptools import setup, find_packages

setup(
    name="JsonDataMaker",
    version="0.1",
    packages=find_packages(),
    install_requires=['Core>=0.1'],
    entry_points={
        'data.load':
            ['json_load=JsonDataMaker.data_load_json:LoadJSON']
    },
    zip_safe=True
)