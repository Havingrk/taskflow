
const express = require('express');
const router = express.Router();
const ApiHatasi= require('../utils/ApiHatasi');
//const users = require('../../data/users.json');
const {
    VerifyUser,
    VerifyUserPart
} = require('../middleware/user_dogrula');

// Dosya okuma ve yazma işlemleri
const {
    ReadUsers,
    SaveUsers
} = require('../utils/dosya');

// JSON dosyasından kullanıcıları oku
let users = ReadUsers();

// GET /users - Kullanıcıları listele
// Filtreleme + arama + sıralama + sayfalama

router.get('/', (req, res) => {

    const {
        sayfa = 1,
        limit = 5,
        role,
        ara,
        siralama = 'tarih'
    } = req.query;

    // Sayfa ve limit değerlerini Number'a çevir
    const sayfaNo = Math.max(1, Number(sayfa));
    const limitNo = Math.min(10, Math.max(1, Number(limit)));

    // 1. Role filtreleme
    let sonuc = role
        ? users.filter(n =>
            n.role.toLowerCase() === role.toLowerCase()
        )
        : [...users];

    // 2. Arama
    if (ara) {
        const kucuk = ara.toLowerCase();

        sonuc = sonuc.filter(n =>
            n.name.toLowerCase().includes(kucuk) ||
            n.email.toLowerCase().includes(kucuk)
        );
    }

    // 3. Sıralama
    if (siralama === 'name') {
        sonuc.sort((a, b) =>
            a.name.localeCompare(b.name, 'tr')
        );
    } else {
        sonuc.sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );
    }

    // 4. Toplam ve sayfa sayısı
    const toplam = sonuc.length;

    const toplamSayfa = Math.max(
        1,
        Math.ceil(toplam / limitNo)
    );

    // 5. Sayfalama
    const baslangic = (sayfaNo - 1) * limitNo;

    const data = sonuc.slice(
        baslangic,
        baslangic + limitNo
    );

    res.json({
        basarili: true,
        sayfa: sayfaNo,
        limit: limitNo,
        toplam,
        toplamSayfa,
        oncekiSayfa: sayfaNo > 1 ? sayfaNo - 1 : null,
        sonrakiSayfa: sayfaNo < toplamSayfa
            ? sayfaNo + 1
            : null,
        data
    });
});


// GET /users/role/:role - Role göre kullanıcıları getir

router.get('/role/:role', (req, res) => {

    const { role } = req.params;

    const sonuc = users.filter(
        n => n.role.toLowerCase() === role.toLowerCase()
    );

    res.json({
        basarili: true,
        role,
        adet: sonuc.length,
        data: sonuc
    });
});


// GET /users/:id - ID ile kullanıcı getir

router.get('/:id', (req, res, next) => {

    try {
        const id = Number(req.params.id);

        // ID sayı değilse
        if (isNaN(id)) {
            throw new ApiHatasi('ID sayı olmalıdır', 400);
        }

        // Kullanıcıyı bul
        const user = users.find(user => user.id === id);

        // Kullanıcı bulunamazsa
        if (!user) {
            throw new ApiHatasi(
                `${id} ID'li kullanıcı bulunamadı`,
                404
            );
        }

        res.status(200).json({
            basarili: true,
            data: user
        });

    } catch (err) {
        next(err);
    }
});


// POST /users - Yeni kullanıcı oluştur

router.post('/', VerifyUser, (req, res) => {

    const {
        name,
        email,
        role
    } = req.body;

    const simdikiZaman = new Date().toISOString();

    const newUser = {

        id: users.length > 0
            ? Math.max(...users.map(user => user.id)) + 1
            : 1,

        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        createdAt: simdikiZaman,
        updatedAt: simdikiZaman
    };

    users.push(newUser);

    // JSON dosyasına kaydet
    SaveUsers(users);

    res.status(201).json({
        basarili: true,
        mesaj: 'Kişi başarıyla oluşturuldu',
        data: newUser
    });
});


// PUT /users/:id - Kullanıcıyı tamamen güncelle

router.put('/:id', VerifyUser, (req, res) => {

    const id = Number(req.params.id);

    const index = users.findIndex(user => user.id === id);

    if (index === -1) {
        return res.status(404).json({
            hata: 'Kişi bulunamadı'
        });
    }

    users[index] = {

        ...users[index],
        ...req.body,

        id: users[index].id,
        createdAt: users[index].createdAt,
        updatedAt: new Date().toISOString()

    };

    // JSON dosyasına kaydet
    SaveUsers(users);

    res.json({
        basarili: true,
        mesaj: 'Kişi başarıyla güncellendi',
        data: users[index]
    });
});


// PATCH /users/:id - Kullanıcıyı kısmi güncelle

router.patch('/:id', VerifyUserPart, (req, res) => {

    const id = Number(req.params.id);

    const user = users.find(user => user.id === id);

    if (!user) {
        return res.status(404).json({
            hata: 'Kişi bulunamadı'
        });
    }

    const {
        name,
        email,
        role
    } = req.body;

    if (name !== undefined) {
        user.name = name.trim();
    }

    if (email !== undefined) {
        user.email = email.trim().toLowerCase();
    }

    if (role !== undefined) {
        user.role = role;
    }

    user.updatedAt = new Date().toISOString();

    // JSON dosyasına kaydet
    SaveUsers(users);

    res.json({
        basarili: true,
        mesaj: 'Kişi başarıyla güncellendi',
        data: user
    });
});


// DELETE /users/:id - Kullanıcı sil

router.delete('/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = users.findIndex(user => user.id === id);

    if (index === -1) {
        return res.status(404).json({
            hata: 'Kişi bulunamadı'
        });
    }

    const silinen = users.splice(index, 1)[0];

    // JSON dosyasına kaydet
    SaveUsers(users);

    res.json({
        basarili: true,
        mesaj: 'Kişi başarıyla silindi',
        data: silinen
    });
});


module.exports = router;