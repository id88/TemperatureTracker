addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // 修改请求 URL
  const url = new URL(request.url)
  const targetUrl = 'https://tianqi.2345.com' + url.pathname + url.search

  // 创建新的请求
  const modifiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: {
      'Referer': 'https://tianqi.2345.com',
      'Origin': 'https://tianqi.2345.com',
      'Accept': 'application/json',
    }
  })

  // 发送请求并返回响应
  const response = await fetch(modifiedRequest)
  
  // 添加 CORS 头
  const modifiedResponse = new Response(response.body, response)
  modifiedResponse.headers.set('Access-Control-Allow-Origin', '*')
  
  return modifiedResponse
} 