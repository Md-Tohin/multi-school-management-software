import axios from "axios";
import { baseURL } from "../common/SummaryApi.js";

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true
})

Axios.interceptors.request.use((request) => {
    if(localStorage.getItem("token")){
        request.headers.Authorization = `Bearer ${localStorage.getItem("token")}`
    }
    console.log(localStorage.getItem("token"));
    
    return request;
})

export default Axios