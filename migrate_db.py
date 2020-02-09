#!/usr/bin/python3

import pandas as pd
import json

df = pd.read_csv('export.csv')
df = df[['tb_id', 'au_email', 'rd_code', 'rc_number', 'tb_kind', 'tb_number', 'rt_quarter', 'rt_year', 'rp_name', 'tb_test_file', 'tb_upload_time', 'tb_verified']]
{c: len(df[c].unique()) for c in df.columns} # count unique elements in each row

doc = []
for i, r in df.iterrows():
  
  kind = {}
  if r['tb_kind'] == 'Q':
    kind['name'] = 'Quiz'
    kind['number'] = r['tb_number']
  elif r['tb_kind'] == 'MT':
    kind['name'] = 'Midterm'
    kind['number'] = r['tb_number']
  elif r['tb_kind'] == 'F':
    kind['name'] = 'Final'
    kind['number'] = None
  
  term = {}
  if r['rt_quarter'] == 'F':
    term['quarter'] = 'Fall'
  elif r['rt_quarter'] == 'W':
    term['quarter'] = 'Winter'
  elif r['rt_quarter'] == 'S':
    term['quarter'] = 'Spring'
  elif r['rt_quarter'] == 'Su':
    term['quarter'] = 'Summer'
  term['year'] = r['rt_year']

  doc.append({
    '_id': r['tb_id'],
    'user_email': r['au_email'] if not pd.isna(r['au_email']) else None,
    'course': {'code': r['rd_code'], 'number': r['rc_number']},
    'kind': kind,
    'term': term,
    'professor': {'email': None, 'name': r['rp_name'] if not pd.isna(r['rp_name']) else None},
    'test_file': r['tb_test_file'],
    'upload_time': r['tb_upload_time'],
    'verified': True if r['tb_verified'] else False
    })

with open('db.json', 'w') as f:
  f.write(json.dumps(doc))
