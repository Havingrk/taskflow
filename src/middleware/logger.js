//logger middleware'inin amacı, API'ye gelen bütün HTTP isteklerini kayıt altına almaktır.
//Projeyi kullanan biri hangi endpoint'e, ne zaman ve hangi HTTP metoduyla istek göndermiş, bunu takip etmeni sağlar.

const logger = (req,res,next) =>{
    const method = req.method;
    const url = req.url;
    const ip= req.ip || req.connection.remoteAddress;

    console.log(`[${new Date().toISOString()}] ${method} ${url} -${ip}`);

    next();
};

module.exports=logger;
