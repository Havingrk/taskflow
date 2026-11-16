//JSON okuma ve yazma,

//fs yerleşik bir modul installa gerek yok

const fs = require('fs');
const path= require('path');
// Dosya yolları
const KAYIT = path.join(__dirname, '..', '..', 'data', 'users.json');
const GOREV = path.join(__dirname, '..', '..', 'data', 'tasks.json');

//OKUMA
function ReadUsers(){
    try{
        
        if(!fs.existsSync(KAYIT)){
            return[];
        }
        
        const icerik =fs.readFileSync(KAYIT,'utf-8');
        return JSON.parse(icerik);
    }
    catch(error){
        console.error('Kullanıcı okuma hatası:', error);
        return[];
    }
}

function ReadTasks(){
    try{
        
        if(!fs.existsSync(GOREV)){
            return[];
        }
        //dosya içeriğini oku ve stringi json a cevir(parse ile)
        const icerik =fs.readFileSync(GOREV,'utf-8');
        return JSON.parse(icerik);
    }
    catch(error){
        console.error('Görev okuma hatası:', error);
        return[];
    }
}

//YAZMA
function SaveUsers(users){
    try{
        //utf-8 turkce karakter olmasınn dıye kullanılır.
        const json =JSON.stringify(users,null,2);
        fs.writeFileSync(KAYIT, json, 'utf-8' );
        return true;
    } catch (error) {
        console.error('Kullanıcı yazma hatası:', error);
        return false;
    }
}
function SaveTasks(tasks) {
    try {
        const json = JSON.stringify(tasks, null, 2);
        fs.writeFileSync(GOREV, json, 'utf-8');
        return true;

    } catch (error) {
        console.error('Görev yazma hatası:', error);
        return false;
    }
}
// EXPORT
module.exports={
    ReadUsers,
    ReadTasks,
    SaveUsers,
    SaveTasks
};

//KONTROL 
//BU KOŞUL KODUN ÇALIŞIP ÇALIŞMADIĞINI GÖSTERİR.
// KONTROL (TEST)
if (require.main === module) {

    // Kullanıcıları kontrol et
    const users = ReadUsers();
    console.log('Mevcut kullanıcılar:', users);

    // Görevleri kontrol et
    const tasks = ReadTasks();
    console.log('Mevcut görevler:', tasks);

    console.log('Kullanıcı ve görev dosyaları başarıyla okundu.');
}