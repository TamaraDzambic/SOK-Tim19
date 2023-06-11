#!/bin/bash

# This script is used to build all necessary python components
# and runt django website.

lay_egs() {
  # The directory path is sent as the first argument
  cd $1
  pwd
  python setup.py install
  cd ..
}

run_server() {
  # The Django website path is sent as the first argument
  cd $1
  python manage.py makemigrations
  python manage.py migrate
  python manage.py runserver
}

# clean
source clean.sh

# build components
lay_egs Core
lay_egs JsonDataMaker
lay_egs WikiDataMaker
lay_egs XMLDataMaker
lay_egs FileSystemDataMaker
lay_egs BasicVisualizer
lay_egs DetailedVisualizer
run_server Expressiveness
