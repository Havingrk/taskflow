//Express uygulaması

const express = require ('express');
const logger = require('./middleware/logger');
const tasksRouter =require('./routes/tasks');
const usersRouter =require('./routes/users');

const app= express();

//Middleware ler SIRA ÖNEMLİ
app.use(express.json());
app.use(logger);


//Route lar 
app.use('/tasks',tasksRouter);
app.use('/users',usersRouter);
//404 hata kodu yazılır
app.use((req,res) =>{
    res.status(404).json({
        hata:'Endpoint Bulunamadı',
        url:req.url
    });
});

//merkezi hata yakalayıcı 
app.use((err,req,res,next)=>{
    const durum = err.durum || 500;
    const mesaj = err.message || 'Sunucu hatası';

    console.error(`[${durum}] ${mesaj}`);

    res.status(durum).json({
        basarili:false,
        hata:mesaj
    });
});

module.exports = app;