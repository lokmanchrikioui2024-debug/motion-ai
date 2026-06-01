import requests, uuid
email=f"test+{uuid.uuid4().hex}@example.com"
print('email', email)
resp = requests.post('http://127.0.0.1:8080/api/auth/register', json={'email': email, 'password': 'testpass'})
print('register', resp.status_code, resp.text)
resp2 = requests.post('http://127.0.0.1:8080/api/auth/login', json={'email': email, 'password': 'testpass'})
print('login', resp2.status_code, resp2.text)
