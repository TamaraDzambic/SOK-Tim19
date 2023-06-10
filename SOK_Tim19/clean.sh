#!/bin/bash

# This script is used to clean unnecessary generated files/folders.

remove_eggs() {
  # The directory path is sent as the first argument
  cd $1
  rm -rf build
  rm -rf *.egg-info
  rm -rf dist
  cd ..
}

# remove build files from components
remove_eggs Core
remove_eggs JsonDataMaker
remove_eggs WikiDataMaker
# remove db
cd Expressiveness
rm *.sqlite3
cd ..
