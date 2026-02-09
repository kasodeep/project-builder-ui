import axios from "axios"

const secureApi = axios.create({
    baseURL: "http://localhost:8080/api/v1",
})

secureApi.interceptors.request.use((config) => {
    const creds = localStorage.getItem("basicAuth")
    if (creds) {
        config.headers.Authorization = `Basic ${creds}`
    }
    return config
})

export default secureApi
