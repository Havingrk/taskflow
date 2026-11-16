//email kkontrolu için gerekli
const users = require('../../data/users.json');
const gecerliRoller = [
    'backend-developer',
    'frontend-developer',
    'database-developer',
    'tester',
    'project-assistant'
];

const VerifyUser= (req, res, next) => {
    
    const { name, email, role } = req.body;

    const hatalar=[];
    //hatalar alındıkca bos hatalar dızısıne eklenır.

    //NAME
    if (!name){
        hatalar.push("Name zorunludur.");
    }else if (typeof name !== 'string') {
    hatalar.push("Name metin olmalıdır.");
    }else if (name.length <3){
        hatalar.push("Name en az 3 karakter olmalı");
    }else if (name.length > 50){
        hatalar.push("Name en fazla 50 karakter olmalı");
    }
    //EMAİL
    if (!email) {
        hatalar.push ('E-mail zorunludur.');
    }else if (typeof email !== 'string') {
        hatalar.push('Email metin olmalıdır.');
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        hatalar.push('Geçerli bir email adresi giriniz.');
    }
    else if (
        users.some(user =>
        user.email.toLowerCase() === email.trim().toLowerCase()
    )//toLowerCase() sayesinde MUSA@example.com ile musa@example.com adreslerini de aynı kabul ediyoruz.
    ){
        hatalar.push('Bu email adresi zaten kullanılıyor.');
    }
    // ROLE
    if (!role) {
        hatalar.push('Role zorunludur.');
    }
    else if (typeof role !== 'string') {
        hatalar.push('Role metin olmalıdır.');
    }
    else if (!gecerliRoller.includes(role)) {
        hatalar.push('Geçersiz role seçildi.');
    }
    if (hatalar.length>0){
        return res.status(400).json({
            basarili:false,
            hatalar 
        });
    }
    
    next();
}; 
    // PATCH için kısmi doğrulama
const VerifyUserPart = (req, res,next) => {

    const {name, email } =req.body;

    const hatalar =[];

    
    if (name === undefined && 
        email == undefined ){
        hatalar.push('Güncellenecek en az bir alan gönderin.');
    }

    //NAME 
    if (name !== undefined) {

    if (typeof name !== 'string') {
        hatalar.push('Name metin olmalıdır.');
    }

    else if (name.trim().length < 3 || name.trim().length > 50) {
        hatalar.push('Name 3-50 karakter olmalı.');
    }

    else if (users.some(user =>
        user.name.toLowerCase() === name.trim().toLowerCase() &&
        user.id !== Number(req.params.id)
    )) {
        hatalar.push('Bu name başka bir kullanıcı tarafından kullanılıyor.');
    }
}
    // EMAİL
    if (email !== undefined) {

    if (typeof email !== 'string' || email.trim() === '') {
        hatalar.push('Email metin olmalıdır ve boş bırakılamaz.');
    }

    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        hatalar.push('Geçerli bir email adresi giriniz.');
    }

    else if (users.some(user =>
        user.email.toLowerCase() === email.trim().toLowerCase() &&
        user.id !== Number(req.params.id)
    )) {
        hatalar.push('Bu email adresi başka bir kullanıcı tarafından kullanılıyor.');
    }
    }
    
    if(hatalar.length>0){
        return res.status(400).json({basarili:false,hatalar});
    }
    
    next();
};
module.exports={VerifyUser,VerifyUserPart};
