import axios from 'axios'

export async function get(path, query) {
    return axios.get(process.env.REACT_APP_API_URL + path, {
        params: {
            ...query
        }
    })
}

export async function post(path, body, configParameter) {
    return axios.post(process.env.REACT_APP_API_URL + path, body, configParameter)
}

export {axios as AxiosInstance} ;

