#!/usr/bin/env python

from setuptools import setup, find_packages
import sys, os

version = '0.01'

setup(name='Bert',
      version=version,
      description="A game editor",
      long_description="""A game editor""",
      author='Oliver Dashiell Bunyan',
      author_email='dashb@me.co.uk',
      url='http://www.blueshed.co.uk/bert',
      packages=find_packages('src',exclude=['*tests*']),
      package_dir = {'':'src'},
      include_package_data = True, 
      exclude_package_data = { '': ['tests/*'] },
      install_requires = [
        'setuptools',
        'tornado>=2.4',
        'sqlalchemy'
      ],
      entry_points = {
      'console_scripts' : [
                           'bert = bert.web:main'
                           ]
      })