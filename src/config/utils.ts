import { http } from "../shared/Http"

export const removeLocal = () => {
  localStorage.clear()
}

type InfoObj = {
  stuId: number
  name: string
  email: string
}
export const isHaveAuth = async() => {
  const info = JSON.parse(localStorage.getItem('info') as string)
  const Auth = await http.get<any>('/user/president/auth', info)
  return Auth.data.data
}

export const getHref = () => {
  return window.location.href
}