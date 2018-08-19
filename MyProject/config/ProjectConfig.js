function URLRoot () {
  /*
  let url = window.location.href
  let colonIndex = url.lastIndexOf(':')
  let endIndex = url.indexOf('/', colonIndex)
  return url.substring(0, endIndex + 1)*/
  return "/";
}
const config = {
  APIRoot: process.env.NODE_ENV === 'production' ? URLRoot() + 'TYH' : '/TYH', //浏览器浏览打开后端的链接
}
export default config
