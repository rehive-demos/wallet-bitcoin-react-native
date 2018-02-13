import { AsyncStorage, Alert } from 'react-native'
import Auth from './../util/auth'

const baseUrl = 'https://staging.rehive.com/api/3/'

let getHeaders = async () => {
  const token = await AsyncStorage.getItem('token')
  if (token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + token,
    }
  }
  else {
    return {
      'Content-Type': 'application/json',
    }
  }
}

let _apiCallWithData = async (url, method, data) => {
  try {
    let headers = await getHeaders()
    let response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(data),
      credentials: 'omit',
    })
    if (response.status === 403 || response.status === 401) {
      await AsyncStorage.removeItem("token")
      return { status: "error" }
    }
    let responseJson = await response.json()
    return responseJson
  } catch (error) {
    Alert.alert(
      "Error",
      JSON.stringify(error),
      [{ text: 'OK' }]
    )
  }
}

let _apiCallWithoutData = async (url, method) => {
  //console.log(url)
  try {
    let headers = await getHeaders()
    let response = await fetch(url, {
      method,
      headers,
      credentials: 'omit',
    })
    let responseJson = await response.json()
    if (response.status === 403 || response.status === 401) {
      await AsyncStorage.removeItem("token")
      return { status: "error" }
    }
    return responseJson
  } catch (error) {
    Alert.alert(
      "Error",
      JSON.stringify(error),
      [{ text: 'OK' }]
    )
    return {}
  }
}

let _apiCallFileUpload = async (url, method, data) => {
  try {
    const token = await AsyncStorage.getItem('token')
    let headers = {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Token ' + token,
    }
    let response = await fetch(url, {
      method,
      headers,
      body: data,
    })
    let responseJson = await response.json()
    return responseJson
  } catch (error) {
    Alert.alert(
      "Error",
      JSON.stringify(error),
      [{ text: 'OK' }]
    )
  }
}

class baseService {

  constructor(base_url=null) {
    this.baseUrl = baseUrl ? baseUrl : base_url
  }

  get(endPoint) {
    return _apiCallWithoutData(this.baseUrl + endPoint, "GET")
  }

  getWithFullUrl(url){
    return _apiCallWithoutData(url, "GET")
  }

  post(endPoint, data){
    return _apiCallWithData(this.baseUrl + endPoint, "POST", data)
  }

  patch(endPoint, data) {
    return _apiCallWithData(this.baseUrl + endPoint, "PATCH", data)
  }

  put(endPoint, data) {
    return _apiCallWithData(this.baseUrl + endPoint, "PUT", data)
  }

  delete(endPoint) {
    return _apiCallWithoutData(this.baseUrl + endPoint, "DELETE", {})
  }

  fileUpload(endPoint, data) {
    return _apiCallFileUpload(this.baseUrl + endPoint, "PATCH", data)
  }

  documentUpload(endPoint, data) {
    return _apiCallFileUpload(this.baseUrl + endPoint, "POST", data)
  }
}

export default baseService
