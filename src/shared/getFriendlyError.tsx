//这里来处理英文错误转中文
const map:Record<string,string> = {
  'is invalid' : '格式不正确'
}
export const getFriendlyError = (error: string) => {
  return map[error] || error
}