//Sunucuyu başlatır

const app = require('./app');

const port = 3000;

//sunucuyu dinle
//portu dinle
app.listen(port, () => {
    console.log(`Tasks API: http://localhost:${port}`);
});