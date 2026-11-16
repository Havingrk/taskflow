//assigneeId dogrulaması için gerekli
const users = require('../../data/users.json');

const gecerliOncelikler = ['low', 'medium', 'high'];

const gecerliDurumlar = ['pending', 'in-progress', 'completed'];

const gecerliAlanlar = [
    'title',
    'description',
    'status',
    'priority',
    'assigneeId'
];
// POST için tam doğrulama
const VerifyTask= (req, res, next) => {
    const { 
        title, 
        description, 
        status = 'pending',
        priority, 
        assigneeId
     } = req.body;

    const hatalar=[];//hatalar alındıkca bos hatalar dızısıne eklenır.
 
    // İzin verilmeyen alanlar
    Object.keys(req.body).forEach(alan => {
        if (!gecerliAlanlar.includes(alan)) {
            hatalar.push(`${alan} alanı gönderilemez.`);
        }
    });
    
    // TITLE
    if (typeof title !== 'string' || title.trim() === '') {
        hatalar.push('Title zorunludur ve metin olmalıdır.');
    }
    else if (title.trim().length < 3 || title.trim().length > 100) {
        hatalar.push('Title 3-100 karakter olmalıdır.');
    }


    // DESCRIPTION
    if (typeof description !== 'string' || description.trim() === '') {
        hatalar.push('Description zorunludur ve metin olmalıdır.');
    }
    else if (description.trim().length < 10 || description.trim().length > 500) {
        hatalar.push('Description 10-500 karakter olmalıdır.');
    }
    
    // STATUS
    if (!gecerliDurumlar.includes(status)) {
        hatalar.push('Status pending, in-progress veya completed olmalıdır.');
    }

    // PRIORITY
    if (!gecerliOncelikler.includes(priority)) {
    hatalar.push('Priority low, medium veya high olabilir.');
    }
    
    // ASSIGNEE ID
    //ID yok ise hata ver
    if (assigneeId === undefined || assigneeId === null) {
        hatalar.push('AssigneeId zorunludur.');
    }//Tamsayı mı ?
    else if (!Number.isInteger(assigneeId) || assigneeId <= 0) {
        hatalar.push('AssigneeId pozitif bir tam sayı olmalıdır.');
    }//some() dizinin içerisindeki elemanlardan en az biri koşulu sağlıyor mu diye kontrol eder.
    else if (!users.some(user => user.id === assigneeId)) {
        hatalar.push('Bu ID ile kullanıcı bulunamadı.');
    }

    if (hatalar.length>0){
        return res.status(400).json({
            basarili:false,
            hatalar 
        });
    }
    
    //next(), Express.js içerisinde bir middleware fonksiyonundan sonraki middleware'e veya route işlemine geçmek için kullanılır.
    next();
}; 
    // PATCH için kısmi doğrulama
    // sadece gönderilen alanlar doğrulanır, en az bir alan zorunludur.
const VerifyTaskPart = (req, res,next) => {

    const {
        title,
        description,
        status,
        priority,
        assigneeId
    } = req.body;

    const hatalar =[];
 
    // İzin verilmeyen alanlar
    Object.keys(req.body).forEach(alan => {
        if (!gecerliAlanlar.includes(alan)) {
            hatalar.push(`${alan} alanı güncellenemez.`);
        }
    });

    // En az bir alan gönderilmeli
    if (title === undefined && 
        description == undefined && 
        priority ===undefined &&
        assigneeId === undefined &&
        status== undefined
    ){
        hatalar.push('Güncellenecek en az bir alan gönderin.');
    }

    //TITLE
    if (title !== undefined) {
        if (typeof title !== 'string') {
            hatalar.push('Title metin olmalıdır.');
        }
        else if (title.trim().length < 3 || title.trim().length > 100) {
            hatalar.push('Title 3-100 karakter olmalıdır.');
        }
    }

    // DESCRIPTION
    if (description !== undefined) {
        if (typeof description !== 'string') {
            hatalar.push('Description metin olmalıdır.');
        }
        else if (description.trim().length < 10 || description.trim().length > 500) {
            hatalar.push('Description 10-500 karakter olmalıdır.');
        }
    }
    
    // STATUS
    if (status !== undefined && !gecerliDurumlar.includes(status)) {
        hatalar.push('Status pending, in-progress veya completed olmalıdır.');
    }

    // PRIORITY
    if (priority !== undefined && !gecerliOncelikler.includes(priority)) {
        hatalar.push('Priority low, medium veya high olmalıdır.');
    }
    
    //assigneeId
    if (assigneeId !== undefined) {

    if (assigneeId === null) {
        hatalar.push('AssigneeId zorunludur.');
    }
    else if (!Number.isInteger(assigneeId) || assigneeId <= 0) {
        hatalar.push('AssigneeId pozitif bir tam sayı olmalıdır.');
    }
    else if (!users.some(user => user.id === assigneeId)) {
        hatalar.push('Bu ID ile kullanıcı bulunamadı.');
    }

    }


    if(hatalar.length>0){
        return res.status(400).json({basarili:false,hatalar});
    }
    
    next();
};
module.exports={VerifyTask,VerifyTaskPart};
