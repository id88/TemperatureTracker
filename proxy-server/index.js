const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// 启用 CORS
app.use(cors());

// 代理配置
app.use('/api', createProxyMiddleware({
  target: 'https://tianqi.2345.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': ''
  },
  headers: {
    'Referer': 'https://tianqi.2345.com',
    'Origin': 'https://tianqi.2345.com'
  }
}));

app.listen(3000, () => {
  console.log('Proxy server is running on port 3000');
}); 