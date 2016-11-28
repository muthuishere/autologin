#!/usr/bin/env python3

import os
import json
import sys
from io import open
from shutil import rmtree
from collections import OrderedDict

if len(sys.argv) == 1 or not sys.argv[1]:
    raise SystemExit('Build dir missing.')


def mkdirs(path):
    try:
        os.makedirs(path)
    finally:
        return os.path.exists(path)

pj = os.path.join

build_dir = os.path.abspath(sys.argv[1])
env = sys.argv[2]
env_file = pj(build_dir,'env.json')

with open(env_file) as data_file:    
    env_data = json.load(data_file)
	

# update install.rdf
proj_dir = pj(os.path.split(os.path.abspath(__file__))[0], '..')
chromium_manifest = pj(proj_dir, 'platform', 'chrome', 'manifest.json')

with open(chromium_manifest, encoding='utf-8') as m:
    manifest = json.load(m)


manifest['name'] = 	env_data[env]['name']
manifest['short_name'] = 	env_data[env]['short_name']

# manifest['env'] = 	env
manifest['homepage_url'] = env_data[env]['homepage']
manifest['version'] = 	env_data[env]['version']



manifest_file = pj(build_dir,'manifest.json')

with open(manifest_file, 'wb') as f:
  json.dump(manifest, f, ensure_ascii=False)
  
  
