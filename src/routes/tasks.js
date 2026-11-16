//Görev endpointleri

const express = require('express');
const router = express.Router();

const {VerifyTask,VerifyTaskPart} = require('../middleware/task_dogrula');
const ApiHatasi= require('../utils/ApiHatasi');

//dosya işlemleri
const { ReadTasks, SaveTasks, ReadUsers} = require('../utils/dosya');
let tasks = ReadTasks();

//Kullanıcı bazlı görev listeleme için gerekli
//const { ReadUsers } = require('../utils/dosya');

// JSON dosyasından görevleri al
//const tasks = require('../../data/tasks.json');
//status , priority
router.get('/', (req,res)=> {
    const {
        sayfa=1,
        limit=5,
        status,
        priority,
        ara,
        sort = 'createdAt'
    }=req.query
    //Number neden var string olarak alındığı için number veri tipine çevrilmeli
    const sayfaNo= Math.max(1,Number(sayfa)); //min 1
    const limitNo = Math.min(20,Math.max(1,Number(limit)));//1-20
    
    //1.filtrele
    let sonuc= status
    //Foreach dongusudur. Dizi içeriisnde hareketi sağladığı için
    ? tasks.filter(n=> n.status ===status)
    :[...tasks]; //orjinalini bozma!


    // 2. Priority filtreleme
    if (priority) {
        sonuc = sonuc.filter(
            n => n.priority.toLowerCase() === priority.toLowerCase()
        );
    }

    //1b. Ara (başlık veya içerikte, büyük/küçük harf fark etmez.
    if (ara) {
        const kucuk =ara.toLowerCase();
        sonuc=sonuc.filter(n=>
            n.title.toLowerCase().includes(kucuk)||
            n.description.toLowerCase().includes(kucuk) ||
            n.priority.toLowerCase().includes(kucuk)||
            String(n.assigneeId).includes(kucuk)

        );
    }


    // 2. Sıralama

    if (sort === 'title') {
        // Başlığa göre A-Z sıralama
        sonuc.sort((a, b) =>
            a.title.localeCompare(b.title, 'tr')
        );
    } else if (sort === 'createdAt') {

        // Oluşturulma tarihine göre yeniden eskiye
        sonuc.sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );
    } else {
        return res.status(400).json({
            basarili: false,
            mesaj: 'Geçersiz sıralama. createdAt veya title kullanın.'
        });
    }

    //3.Toplam (sayfalama öncesi)
    const toplam=sonuc.length;
    const toplamSayfa =Math.max (1,Math.ceil(toplam/limitNo));

    //4.Dilimle
    const baslangic = (sayfaNo-1) * limitNo;
    const data = sonuc.slice(baslangic,baslangic + limitNo);


//kullanılan tüm datalar eksiksiz şekilde çagrılır.
    res.json({
        basarili:true,
        sayfa:sayfaNo,
        limit:limitNo,
        toplam,
        toplamSayfa,
        oncekiSayfa: sayfaNo > 1 ? sayfaNo - 1 :null,
        sonrakiSayfa : sayfaNo< toplamSayfa ? sayfaNo + 1: null,
        data
    });
});


//ÖZEL ROUTE : /tasks/status/:status -/:id'denn önce tanımlanmalı! (Sayfa 22 uyarısı)
//etiket sayfasına gidilir belirli etikete erişim sağlanır.
router.get('/status/:status',(req,res) => {
    const {status} =req.params;
//küçük büyük harf methodu tolowercase
    const sonuc= tasks.filter(
        n => n.status.toLowerCase() === status.toLowerCase()
    );

    res.json({
        basarili:true,
        status,
        adet:sonuc.length,
        data:sonuc
    });
});
// GET /tasks/search?keyword=backend
// Görev başlığı ve açıklamasına göre arama

router.get('/search', (req, res) => {

    const { keyword } = req.query;

    // Keyword zorunlu olsun
    if (!keyword || keyword.trim() === '') {
        return res.status(400).json({
            basarili: false,
            mesaj: 'Arama kelimesi zorunludur.'
        });
    }

    const aranan = keyword.trim().toLowerCase();

    const sonuc = tasks.filter(task =>
        task.title.toLowerCase().includes(aranan) ||
        task.description.toLowerCase().includes(aranan)
    );

    res.json({
        basarili: true,
        keyword,
        adet: sonuc.length,
        data: sonuc
    });
});


// GET /tasks/:id - ID ile kullanıcı getir
router.get('/:id', (req, res, next) => {
    try {
        const id = Number(req.params.id);

        // ID sayı değilse
        if (isNaN(id)) {
            throw new ApiHatasi('ID sayı olmalıdır', 400);
        }

        
        const task = tasks.find(task => task.id === id);

       
        if (!task) {
            throw new ApiHatasi(`${id} ID'li görev bulunamadı`, 404);
        }

        
        res.status(200).json({
            basarili: true,
            data: task
        });

    } catch (err) {
        next(err);
    }
});
// GET /tasks/assignee/:name
// Kullanıcı adına göre görevleri listele

router.get('/assignee/:name', (req, res) => {

    const { name } = req.params;

    // Kullanıcıları JSON dosyasından oku
    const users = ReadUsers();

    // Kullanıcıyı adına göre bul
    const user = users.find(
        u => u.name.toLowerCase() === name.toLowerCase()
    );

    if (!user) {
        return res.status(404).json({
            basarili: false,
            mesaj: 'Kullanıcı bulunamadı.'
        });
    }

    // Kullanıcının ID değerine ait görevleri bul
    const sonuc = tasks.filter(
        task => task.assigneeId === user.id
    );

    res.json({
        basarili: true,
        kullanici: user.name,
        assigneeId: user.id,
        adet: sonuc.length,
        data: sonuc
    });
});


//POST
router.post('/',VerifyTask,(req,res) =>{
    //ZORUNLU INPUT
    const { 
        title, 
        description,
        status = 'pending',
        priority,
        assigneeId
    } = req.body;

    const simdikiZaman = new Date().toISOString();

    const newTask = {
        id: tasks.length > 0
            ? Math.max(...tasks.map(task => task.id)) + 1
            : 1,
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        assigneeId,
        createdAt: simdikiZaman,
        updatedAt: simdikiZaman
    };

    tasks.push(newTask);

    // JSON dosyasına kaydet
    SaveTasks(tasks);
    res.status(201).json({
        basarili: true,
        mesaj: 'Görev başarıyla oluşturuldu',
        data: newTask
    });
});

// PUT /tasks/:id - Görevi tamamen güncelle
router.put('/:id', VerifyTask, (req, res) => {

    const id = Number(req.params.id);

    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {
        return res.status(404).json({
            hata: 'Görev bulunamadı'
        });
    }

    tasks[index] = {

        ...tasks[index],
        ...req.body,

        id: tasks[index].id,

        createdAt: tasks[index].createdAt,

        updatedAt: new Date().toISOString()

    };
    // JSON dosyasına kaydet
    SaveTasks(tasks);

    res.json({
        basarili: true,
        mesaj: 'Görev başarıyla güncellendi',
        data: tasks[index]
    });

});


// PATCH /tasks/:id - Görevi kısmi güncelle
router.patch('/:id', VerifyTaskPart, (req, res) => {

    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            hata: 'Görev bulunamadı'
        });
    }

    const {
        title,
        description,
        status,
        priority,
        assigneeId
    } = req.body;

    if (title !== undefined) {
        task.title = title.trim();
    }

    if (description !== undefined) {
        task.description = description.trim();
    }

    if (status !== undefined) {
        task.status = status;
    }

    if (priority !== undefined) {
        task.priority = priority;
    }

    if (assigneeId !== undefined) {
        task.assigneeId = assigneeId;
    }

    task.updatedAt = new Date().toISOString();
 
    // JSON dosyasına kaydet
    SaveTasks(tasks);
    
    res.json({
        basarili: true,
        mesaj: 'Görev başarıyla güncellendi',
        data: task
    });

});


// DELETE /tasks/:id - Görev sil
router.delete('/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {
        return res.status(404).json({
            hata: 'Görev bulunamadı'
        });
    }

    const silinenTask = tasks.splice(index, 1)[0];

    // JSON dosyasına kaydet
    SaveTasks(tasks);
    
    res.json({
        basarili: true,
        mesaj: 'Görev başarıyla silindi',
        data: silinenTask
    });

});

module.exports = router;

