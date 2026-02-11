```javascript
const res = await fetch("/auth/login", {
    method: "POST",
    credentials: "include", // REQUIRED for cookies
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
})

const data = await res.json()
setAccessToken(data.accessToken)
```