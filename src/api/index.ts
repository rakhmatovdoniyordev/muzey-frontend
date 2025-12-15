import axios from "axios";

const request = axios.create({
    baseURL: "http://localhost:3000/api/v1"
})

request.interceptors.request.use((config)=>{
    let token = localStorage.getItem("accessToken")
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export {request}