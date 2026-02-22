import axios from "axios"

const secureApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

secureApi.interceptors.request.use((config) => {
    const creds = localStorage.getItem("basicAuth")
    if (creds) {
        config.headers.Authorization = `Basic ${creds}`
    }
    return config
})

export default secureApi
