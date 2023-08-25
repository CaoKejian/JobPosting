export const removeLocal = () => {
  localStorage.clear()
}

type InfoObj = {
  stuId: number
  name: string
  email: string
}
export const isHaveAuth = () => {
  const info = JSON.parse(localStorage.getItem('info') as string)
  console.log(info)
  return
  const resData = info.map((item: InfoObj) => {
    return { stuId: item.stuId, name: item.name, email: item.email, }
  })
}