import axios from 'axios'
import * as humps from 'humps'
import { APIRoutes } from '../shared/enums/APIRoutes'

const JSON_TYPE = 'application/json'
const API_VERSION = 'v1'

// Create axios instance
const httpClient = axios.create({
  baseURL: '/api/' + API_VERSION,
})

// Set the default headers for requests
httpClient.defaults.headers.common['Accept'] = JSON_TYPE
httpClient.defaults.headers.post['Content-Type'] = JSON_TYPE
httpClient.defaults.headers.put['Content-Type'] = JSON_TYPE
httpClient.defaults.headers.patch['Content-Type'] = JSON_TYPE

httpClient.interceptors.request.use(
  (request) => {
    // Add the authorization header if the user is logged in
    const tokenType = localStorage.getItem('token_type')
    const accessToken = localStorage.getItem('access_token')

    if (tokenType && accessToken) {
      request.headers['Authorization'] = tokenType.concat(' ', accessToken)
    }

    // Convert the request data to snake case
    if (!request.url?.startsWith(APIRoutes.CONFIRM_PLEX_SIGN_IN())) {
      if (request.data) {
        request.data = humps.decamelizeKeys(request.data)
      }
    }

    return request
  },
  (error) => {
    console.error(error)
    return Promise.reject(error)
  },
)

httpClient.interceptors.response.use(
  (response) => {
    if (
      !(
        response.config.url?.startsWith(APIRoutes.SIGN_IN) ||
        response.config.url?.startsWith(APIRoutes.CONFIRM_PLEX_SIGN_IN()) ||
        response.config.url?.startsWith(APIRoutes.SIGN_UP)
      )
    ) {
      response.data = humps.camelizeKeys(response.data)
    }

    return response
  },
  (error) => {
    console.error(error)
    return Promise.reject(error)
  },
)

export { httpClient as instance }

export default httpClient
