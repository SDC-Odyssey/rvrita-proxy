require('newrelic');
const express = require('express');
const path = require('path');
const proxy = require('express-http-proxy');
const cors = require('cors');

// clusters
// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;

// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`);
  
//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
  
//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//   });
//   return;
// }

const app = express();
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});

app.use(cors());
app.use(express.static(__dirname + '/../client'));


app.use('/proxy', proxy('www.google.com', {
  filter: function(req, res) {
    return req.method == 'GET';
 }
}));

app.use('/header', proxy('http://localhost:3010', {
  proxyReqPathResolver: function (req) {
    return `/`;
  }
}));

app.use('/rooms', proxy('http://localhost:3002', {
  proxyReqPathResolver: function (req) {
    let parts = req.url.split('?');
    let pathname = req.url.split('/')[1];
    let queryString = parts[1];
    console.log('🏓 home', parts, queryString, '🪀', pathname)
    return !pathname ? '/' : `/rooms/${pathname}`;
  }
}));

app.use('/hostInfo', proxy('http://localhost:3006', {
  parseReqBody: false,
  proxyReqPathResolver: function (req) {
    let parts = req.url.split('?');
    let queryString = parts[1];
    let pathname = req.url.split('/')[1];
    // console.log('🏓 host', parts, queryString, '🪀', pathname)
    return !pathname ? '/' : `/hostInfo/${pathname}`;
  }
}));

app.use('/images', proxy('http://localhost:3001', {
  proxyReqPathResolver: function (req) {
    let parts = req.url.split('?');
    let queryString = parts[1];
    let pathname = req.url.split('/')[1];
    console.log('🏓 images', parts, queryString, '🪀', pathname)
    return !pathname ? '/' : `/${pathname}`;
  }
}));

app.use('/pricing', proxy('http://54.187.6.96:3003/', {
  proxyReqPathResolver: function (req) {
    let parts = req.url.split('?');
    let queryString = parts[1];
    let pathname = req.url.split('/')[1];
    console.log('🏓 pricing', parts, queryString, '🪀', pathname)
    return !pathname ? '/' : `/pricing${pathname}`;
  }
}));

app.use('/reviews', proxy('http://localhost:3004', {
  proxyReqPathResolver: function (req) {
    let parts = req.url.split('?');
    let queryString = parts[1];
    return !queryString ? '/' : `/hostInfo/${queryString}`;
  }
}));

app.use('/location', proxy('http://localhost:3005', {
  proxyReqPathResolver: function (req) {
    let parts = req.url.split('?');
    let queryString = parts[1];
    return !queryString ? '/' : `/hostInfo/${queryString}`;
  }
}));


