const http = require('http');
const os = require('os');
const cluster = require('cluster');

const numCPUs = os.cpus().length; // Retrieve the number of CPU cores
const PORT = 3000;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`); 

    // Fork workers.
    // วนลูปตามจำนวนของ CPU cores ที่มีอยู่ และสร้าง worker process แต่ละตัวโดยใช้ cluster.fork()
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    } 

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork(); // Start a new worker when one dies
    });

} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    const server = http.createServer((req, res) => {
        if (req.url === '/greet' && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            const response = {
                message: 'Hello, welcome to our server <br> My Name is Mos Amontep'
            };
            res.end(JSON.stringify(response));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    });

    server.listen(PORT, () => {
        console.log(`Worker ${process.pid} started server on port ${PORT}`);
    });
}
