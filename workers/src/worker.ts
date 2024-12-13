interface Env {
  TARGET_URL: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        },
      })
    }

    try {
      // 获取请求 URL 和路径
      const url = new URL(request.url)
      const targetUrl = `${env.TARGET_URL}${url.pathname}${url.search}`

      // 创建新的请求
      const modifiedRequest = new Request(targetUrl, {
        method: request.method,
        headers: {
          'Accept': 'application/json',
          'Referer': env.TARGET_URL,
          'Origin': env.TARGET_URL,
        },
        body: request.body,
      })

      // 发送请求
      const response = await fetch(modifiedRequest)
      
      // 创建新的响应并添加 CORS 头
      const modifiedResponse = new Response(response.body, response)
      modifiedResponse.headers.set('Access-Control-Allow-Origin', '*')
      
      return modifiedResponse
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Proxy Error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }
  },
} 