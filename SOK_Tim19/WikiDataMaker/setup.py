from setuptools import setup, find_packages

setup(
    name="WikiDataMaker",
    version="0.1",
    packages=find_packages(),
    # requiring Django later than 2.1
    install_requires=['Core>=0.1'],
    # Installing package data related to packge
    # https://docs.python.org/3/distutils/setupscript.html#installing-package-data
    # data_files specify additional files that are not closely related to the
    # source code of the package.
    # https://docs.python.org/3/distutils/setupscript.html#installing-additional-files
    entry_points={
        'data.load':
            ['wikipedia-data-load=WikiDataMaker.data_load_wiki:LoadWikipedia'],
    },
    zip_safe=True
)