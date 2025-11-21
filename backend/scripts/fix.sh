#!/bin/bash
# Running this file will modify all unformatted python files in this project.
# Run from project root directory: $ bash backend/scripts/fix.sh

poetry run isort .      # run the Python import sorter
poetry run black .      # runs the Python formatter
