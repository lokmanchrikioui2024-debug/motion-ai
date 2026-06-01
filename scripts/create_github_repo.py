import os
import sys
import requests

TOKEN = os.getenv('GITHUB_TOKEN')
if not TOKEN:
    print('NO_TOKEN')
    sys.exit(2)

name = sys.argv[1] if len(sys.argv) > 1 else 'motionwear-ai'
private = os.environ.get('GITHUB_PRIVATE', 'true').lower() in ('1','true','yes')
desc = os.environ.get('GITHUB_DESC','Auto-created repo for MotionWear AI')

headers = {'Authorization': f'token {TOKEN}', 'Accept': 'application/vnd.github.v3+json'}
# get authenticated user
r = requests.get('https://api.github.com/user', headers=headers)
if r.status_code != 200:
    print('AUTH_FAIL', r.status_code, r.text)
    sys.exit(3)
user = r.json().get('login')

# check if repo exists
repo_url = f'https://api.github.com/repos/{user}/{name}'
r = requests.get(repo_url, headers=headers)
if r.status_code == 200:
    print('EXISTS', user, name)
    print('CLONE_URL', f'https://github.com/{user}/{name}.git')
    sys.exit(0)

payload = {'name': name, 'description': desc, 'private': private}
create = requests.post('https://api.github.com/user/repos', headers=headers, json=payload)
if create.status_code in (201, 200):
    data = create.json()
    print('CREATED', data.get('full_name'))
    print('CLONE_URL', data.get('clone_url'))
    sys.exit(0)
else:
    print('CREATE_FAIL', create.status_code, create.text)
    sys.exit(4)
