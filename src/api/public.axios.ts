import axios from "axios"

const publicApi = axios.create({
    baseURL: "http://localhost:8080/api/v1",
})

export default publicApi
