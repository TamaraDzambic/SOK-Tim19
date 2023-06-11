from setuptools import setup, find_packages

setup(
    name="detailed_visualizer",
    version="0.1",
    packages=find_packages(),
    install_requires=['Core >= 0.1'],
    namespace_packages=['view.load'],
    package_data={'view.load': ['detailed_main_view.js']},
    entry_points={
        'view.load':
            ['detailed_visualizer=view.load.detailedVisualizer:DetailedVisualizer'],
    },
    zip_safe=False
)