'use server'
import axios from 'axios'

const API_URL = process.env.SOAR_API_URL

type Response = {
  msg: string
  status: number
  data: any
}

const request = {
  get(path: string, params?: object, token?: string): Promise<Response> {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await axios({
          method: 'get',
          url: path,
          params: params,
          headers: {
            token: token
          }
          // withCredentials: true,
        })
        resolve(response.data)
      } catch (error) {
        reject(error)
      }
    })
  },
  post(path: string, params?: object): Promise<Response> {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await axios({
          method: 'post',
          url: path,
          data: params
          // withCredentials: true,
        })
        resolve(response.data)
      } catch (error) {
        reject(error)
      }
    })
  },
  patch(path: string, params: object): Promise<Response> {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await axios({
          method: 'patch',
          url: path,
          data: params
          // withCredentials: true,
        })
        resolve(response.data)
      } catch (error) {
        reject(error)
      }
    })
  },
  delete(path: string, token: string, params: object): Promise<Response> {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await axios({
          method: 'delete',
          url: path,
          data: params,
          headers: {
            token: token
          }
          // withCredentials: true,
        })
        resolve(response.data)
      } catch (error) {
        reject(error)
      }
    })
  }
}

export async function getUserByToken(token: string) {
  const res = await request.get(`${API_URL}/user`, undefined, token)
  if (res.status === 200) {
    return res.data
  } else {
    return null
  }
}

export async function login(mobile: string, password: string) {
  const res = await request.post(`${API_URL}/account/loginByPassword`, {
    mobileArea: '+86',
    mobile,
    password,
    appHigh: 1
  })
  if (res.status === 200) {
    return res.data
  } else {
    return null
  }
}
