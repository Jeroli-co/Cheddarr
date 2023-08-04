import axios from 'axios'
import * as humps from 'humps'
import { APIRoutes } from './shared/enums/APIRoutes'

const JSON_TYPE = 'application/json'
const FORM_URL_ENCODED_TYPE = 'application/x-www-form-urlencoded'
const API_VERSION = 'v1'

const httpClient = axios.create({
  baseURL: '/api/' + API_VERSION,
})

httpClient.defaults.headers.common['Accept'] = JSON_TYPE
httpClient.defaults.headers.post['Content-Type'] = JSON_TYPE
httpClient.defaults.headers.put['Content-Type'] = JSON_TYPE
httpClient.defaults.headers.patch['Content-Type'] = JSON_TYPE

httpClient.interceptors.request.use(
  (request) => {
    const tokenType = localStorage.getItem('token_type')
    const accessToken = localStorage.getItem('access_token')

    if (tokenType && accessToken) {
      request.headers['Authorization'] = tokenType.concat(' ', accessToken)
    }

    if (request.url?.startsWith(APIRoutes.SIGN_IN)) {
      request.headers['Content-Type'] = FORM_URL_ENCODED_TYPE
    } else if (!request.url?.startsWith(APIRoutes.CONFIRM_PLEX_SIGN_IN())) {
      if (request.data) {
        request.data = humps.decamelizeKeys(request.data)
      }
    }

    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)

httpClient.interceptors.response.use(
  (response) => {
    if (
      !response.config.url?.startsWith(APIRoutes.SIGN_IN) &&
      !response.config.url?.startsWith(APIRoutes.CONFIRM_PLEX_SIGN_IN()) &&
      !response.config.url?.startsWith(APIRoutes.SIGN_UP) &&
      response.data
    ) {
      response.data = humps.camelizeKeys(response.data)
    }

    return response
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)

export { httpClient as instance }

export default httpClient
