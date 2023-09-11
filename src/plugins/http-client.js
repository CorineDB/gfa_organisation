import axios from "axios"
import { API_BASE_URL } from "@/services/configs/environment";
//import store from "@/store";
//const storeToken = store.getters.getToken

/**
 * Axios basic configuration
 * Some general configuration can be added like timeout, headers, params etc. More details can be found on https://github.com/axios/axios
 * */
const config = {
  baseURL: API_BASE_URL + "/api/",
  timeout: 60 * 1000, // Timeout
  //withCredentials: true, // Check cross-site Access-Control,
  headers: {
    common: {
        'Accept': 'application/json',
        'Content-Type': 'application/json,multipart/form-data',
       
    }
  }
};

/**
 * Creating the instance of Axios
 * It is because, in large scale application we may need to consume APIs from more than single server,
 * So, may need to create multiple http client with different config
 * Only this client will be used rather than axios in the application
 **/
const httpClient = axios.create(config);

/**
 * Auth interceptors
 * @description Configuration related to AUTH token can be done in interceptors.
 * Currenlty it is just doing nothing but idea to to show the capability of axios and its interceptors
 * In future, interceptors can be created into separate files and consumed into multiple http clients
 * @param {*} config
 */


/** Adding the request interceptors */
/* 
  httpClient.interceptors.request.use(authInterceptor);
  httpClient.interceptors.request.use(loggerInterceptor); 
*/

/** Adding the request interceptors */
httpClient.interceptors.request.use(config =>{
    /* if(storeToken != '' && storeToken != undefined) {
      config.headers.Authorization = `Bearer ${getToken}`
    } */
   
      const getToken = JSON.parse(localStorage.getItem("bsdInfo"));
      if(getToken !=undefined || getToken !=null) {
        let token = getToken.token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    
    
    return config;
  }
);



export { httpClient };
