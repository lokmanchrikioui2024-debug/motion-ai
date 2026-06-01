import requests, uuid
email=f"test+{uuid.uuid4().hex}@example.com"
resp = requests.post('http://127.0.0.1:8080/api/auth/register', json={'email': email, 'password': 'testpass'})
print('STATUS', resp.status_code)
print('TEXT', resp.text)
