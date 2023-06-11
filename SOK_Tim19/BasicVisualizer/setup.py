from setuptools import setup, find_packages


setup(
    name="basic_visualizer",
    version="0.1",
    packages=find_packages(),
    install_requires=['Core >= 0.1'],
    namespace_packages=['view.load'],
    package_data={'view.load': ['basic_main_view.js']},
    entry_points={
        'view.load':
            ['basic_visualizer=view.load.basicVisualizer:BasicVisualizer'],
    },
    zip_safe=False
)