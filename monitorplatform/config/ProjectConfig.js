const config = {
  APIRoot: process.env.NODE_ENV === 'production' ? 'http://127.0.0.1:8090': '/api', //浏览器浏览打开后端的链接, //浏览器浏览打开后端的链接
}

export default config
