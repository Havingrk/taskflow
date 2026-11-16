# TASKFLOW – Kurulum ve Çalıştırma Rehberi (README)

## 1. Proje Hakkında

TASKFLOW, Node.js ve Express.js kullanılarak geliştirilmiş bir görev ve kullanıcı yönetim REST API projesidir.

Proje; kullanıcı oluşturma, güncelleme, silme ve listeleme işlemlerinin yanı sıra görev oluşturma, görevlere kullanıcı atama ve görev durumlarını takip etme özelliklerini içerir.

## 2. Kullanılan Teknolojiler

- Node.js
- Express.js
- JavaScript
- JSON
- FS (File System) Modülü
- Postman

## 3. Gereksinimler

Projeyi çalıştırmadan önce bilgisayarınızda aşağıdaki programların kurulu olması gerekir:

- **Node.js:** JavaScript çalışma ortamı.
- **npm:** Node.js ile birlikte gelen paket yöneticisi.
- **Visual Studio Code:** Proje dosyalarını düzenlemek için.
- **Postman:** API isteklerini test etmek için.

Node.js ve npm kurulumunu kontrol etmek için terminali açarak aşağıdaki komutları çalıştırın:

```bash
node -v
npm -v
```

Komutlar sürüm numaralarını gösteriyorsa kurulum başarılıdır.

Node.js indirme adresi: https://nodejs.org/

## 4. Projenin İndirilmesi

Proje GitHub üzerinden indirilebilir veya proje klasörü bilgisayara kopyalanabilir.

GitHub üzerinden indirilecekse terminalde:

```bash
git clone PROJE_GITHUB_ADRESI
```

Ardından proje klasörüne girin:

```bash
cd taskflow
```

**Not:** `PROJE_GITHUB_ADRESI` kısmına projenin GitHub bağlantısı yazılmalıdır.

## 5. Bağımlılıkların ve Gerekli Araçların Kurulması

Proje ana klasöründe terminal açılır.

**1. Proje bağımlılıklarının kurulması**

```bash
npm install
```

Bu komut, `package.json` dosyasında belirtilen bağımlılıkları yükler ve `node_modules` klasörünü oluşturur.

**2. Nodemon kurulumu**

```bash
npm install -g nodemon
```

Nodemon, kodlarda değişiklik yapıldığında sunucuyu otomatik olarak yeniden başlatır. Global (`-g`) kurulum sayesinde terminalden farklı projelerde de kullanılabilir.

**Not:** Nodemon kurulumu isteğe bağlıdır. Normal çalıştırma için zorunlu değildir.

**Eğer projede henüz `package.json` dosyası bulunmuyorsa:**

Önce aşağıdaki komut çalıştırılır:

```bash
npm init -y
```

Ardından Express.js yüklenir:

```bash
npm install express
```

Express.js, HTTP isteklerini yönetmek ve API endpointlerini oluşturmak için kullanılmaktadır.

## 6. Proje Klasör Yapısı

Proje dosyaları aşağıdaki şekilde düzenlenmiştir:

```text
taskflow/
│
├── data/
│   ├── users.json
│   └── tasks.json
│
├── node_modules/
│
├── src/
│   ├── middleware/
│   │   ├── logger.js
│   │   ├── user_dogrula.js
│   │   └── task_dogrula.js
│   │
│   ├── routes/
│   │   ├── users.js
│   │   └── tasks.js
│   │
│   ├── utils/
│   │   ├── ApiHatasi.js
│   │   └── dosya.js
│   │
│   ├── app.js
│   └── server.js
│
├── package.json
├── package-lock.json
└── README.md
```

**Klasör ve dosyaların görevleri:**

- `data/`: Kullanıcı ve görev verilerinin JSON formatında saklandığı klasördür.
- `middleware/`: İstekleri loglama ve gelen verileri doğrulama işlemlerini içerir.
- `routes/`: Kullanıcı ve görev API endpointlerini içerir.
- `utils/`: Dosya okuma-yazma fonksiyonları ve özel hata sınıfını içerir.
- `app.js`: Express uygulamasını, middleware yapılarını, route bağlantılarını ve hata yönetimini düzenler.
- `server.js`: Sunucuyu başlatır ve belirlenen port üzerinden dinlemeye başlar.
- `dosya.js`: `fs` modülünü kullanarak JSON dosyalarından veri okur ve dosyalara veri kaydeder.

## 7. Sunucunun Çalıştırılması

Proje ana klasöründe terminal açılır. Sunucuyu çalıştırmak için aşağıdaki yöntemlerden biri kullanılabilir.

**Yöntem 1: Node.js ile normal çalıştırma**

```bash
node src/server.js
```

Sunucuyu başlatır. Kodda değişiklik yapıldığında sunucunun yeniden başlatılması gerekir.

**Yöntem 2: Nodemon ile çalıştırma**

```bash
nodemon src/server.js
```

Sunucuyu başlatır. Dosyalarda değişiklik yapıldığında sunucuyu otomatik olarak yeniden başlatır.

**Yöntem 3: Node.js Watch özelliği ile çalıştırma**

```bash
node --watch src/server.js
```

Node.js'in yerleşik izleme özelliğini kullanır. Dosyalarda değişiklik olduğunda sunucuyu otomatik olarak yeniden başlatır. Bu yöntem için ayrıca Nodemon kurulması gerekmez.

**Sunucu başarıyla başladığında terminalde:**

```text
Tasks API: http://localhost:3000
```

mesajı görüntülenir.

**Sunucuyu durdurmak için:**

```text
CTRL + C
```

tuşlarına basılır.

## 8. API Endpointlerinin Test Edilmesi

Sunucu çalışırken Postman açılır ve aşağıdaki adresler üzerinden istek gönderilir.

**Kullanıcı Endpointleri**

| HTTP Metodu | URL | Açıklama |
|---|---|---|
| GET | `http://localhost:3000/users` | Kullanıcıları listeleme |
| GET | `http://localhost:3000/users/2` | ID ile kullanıcı getirme |
| GET | `http://localhost:3000/users?role=backend-developer` | Role göre filtreleme |
| POST | `http://localhost:3000/users` | Yeni kullanıcı oluşturma |
| PUT | `http://localhost:3000/users/2` | Kullanıcıyı tamamen güncelleme |
| PATCH | `http://localhost:3000/users/2` | Kullanıcıyı kısmi güncelleme |
| DELETE | `http://localhost:3000/users/2` | Kullanıcı silme |

**Görev Endpointleri**

| HTTP Metodu | URL | Açıklama |
|---|---|---|
| GET | `http://localhost:3000/tasks` | Görevleri listeleme |
| GET | `http://localhost:3000/tasks/1` | ID ile görev getirme |
| POST | `http://localhost:3000/tasks` | Yeni görev oluşturma |
| PUT | `http://localhost:3000/tasks/1` | Görevi tamamen güncelleme |
| PATCH | `http://localhost:3000/tasks/1` | Görevi kısmi güncelleme |
| DELETE | `http://localhost:3000/tasks/1` | Görev silme |

GET isteklerinde filtreleme, arama, sıralama ve sayfalama için query parametreleri de kullanılabilir.

**Örnek istekler:**

```text
http://localhost:3000/tasks?status=pending
http://localhost:3000/tasks?priority=high
http://localhost:3000/tasks?sort=createdAt
http://localhost:3000/users?role=tester
http://localhost:3000/users?ara=ahmet
```

## 9. Veri Saklama

Projede kullanıcı ve görev verileri sırasıyla `users.json` ve `tasks.json` dosyalarında saklanmaktadır.

`dosya.js` içerisinde bulunan `ReadUsers()`, `ReadTasks()`, `SaveUsers()` ve `SaveTasks()` fonksiyonları ile dosya okuma ve yazma işlemleri gerçekleştirilir.

Yeni kayıt oluşturma, güncelleme veya silme işlemlerinden sonra ilgili JSON dosyası güncellenir. Böylece sunucu kapatılıp tekrar açıldığında kaydedilen veriler korunur.

## 10. Önemli Notlar

- Sunucuyu başlatmadan önce terminalin proje ana klasöründe olduğundan emin olun.
- `npm install` komutu ile gerekli bağımlılıklar yüklenmelidir.
- `users.json` ve `tasks.json` dosyalarının `data` klasöründe bulunduğundan emin olun.
- API istekleri gönderilmeden önce sunucu çalıştırılmalıdır.
- POST, PUT ve PATCH isteklerinde Postman üzerinden Body → raw → JSON seçilmelidir.
- Sunucu 3000 portunu kullanmaktadır. Port doluysa farklı bir port belirlenmelidir.
- `node --watch` özelliğini kullanabilmek için Node.js'in bu özelliği destekleyen bir sürümü kurulu olmalıdır.

---

**Proje Adı:** TASKFLOW – Görev ve Proje Yönetim Sistemi

**Sunucu Adresi:** http://localhost:3000

**Geliştirme Teknolojisi:** Node.js ve Express.js