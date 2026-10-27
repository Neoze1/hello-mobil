
import { useState } from 'react'
import './App.css'

function App() {
  const [sayfa, setSayfa] = useState('Dashboard')

  
const [ilanlar, setIlanlar] = useState([
  { id: 1001, marka: 'BMW', model: '320i', yil: 2022, fiyat: '2.150.000 TL', durum: 'Aktif' },
  { id: 1002, marka: 'Mercedes', model: 'C200', yil: 2021, fiyat: '2.300.000 TL', durum: 'Onay Bekliyor' },
  { id: 1003, marka: 'Audi', model: 'A4', yil: 2020, fiyat: '1.850.000 TL', durum: 'Aktif' }
])

function durumDegistir(id, yeniDurum) {
  setIlanlar(ilanlar.map(ilan =>
    ilan.id === id ? { ...ilan, durum: yeniDurum } : ilan
  ))
}

  const [kullanicilar, setKullanicilar] = useState([
    { id: 1, ad: 'Ahmet Yılmaz', email: 'ahmet@example.com', rol: 'member' },
    { id: 2, ad: 'Ayşe Demir', email: 'ayse@example.com', rol: 'moderator' },
    { id: 3, ad: 'Mehmet Kaya', email: 'mehmet@example.com', rol: 'viewer' }
  ])

  function rolDegistir(id, yeniRol) {
    setKullanicilar(kullanicilar.map(kullanici =>
      kullanici.id === id
        ? { ...kullanici, rol: yeniRol }
        : kullanici
    ))
  }



  return (
    <div className="panel">
      <h1>OTOİZ Yönetim Paneli</h1>

      <div className="menu">
        <button onClick={() => setSayfa('Dashboard')}>Dashboard</button>
        <button onClick={() => setSayfa('İlanlar')}>İlanlar</button>
        <button onClick={() => setSayfa('Kullanıcılar')}>Kullanıcılar</button>
        <button onClick={() => setSayfa('Moderasyon')}>Moderasyon</button>
      </div>

      <div className="icerik">
        <h2>{sayfa}</h2>


{sayfa === 'Dashboard' && (
  <div>
    <h3>Genel İstatistikler</h3>

    <p>Toplam İlan: {ilanlar.length}</p>

    <p>
      Aktif İlan: {ilanlar.filter(ilan => ilan.durum === 'Aktif').length}
    </p>

    <p>
      Onay Bekleyen: {ilanlar.filter(ilan => ilan.durum === 'Onay Bekliyor').length}
    </p>

    <p>Toplam Kullanıcı: {kullanicilar.length}</p>
  </div>
)}


{sayfa === 'İlanlar' && (
  <div>
    <h3>Araç İlanları</h3>
    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>İlan No</th>
          <th>Marka</th>
          <th>Model</th>
          <th>Yıl</th>
          <th>Fiyat</th>
          <th>Durum</th>
          <th>İşlemler</th>
        </tr>
      </thead>
      <tbody>
        {ilanlar.map(ilan => (
          <tr key={ilan.id}>
            <td>{ilan.id}</td>
            <td>{ilan.marka}</td>
            <td>{ilan.model}</td>
            <td>{ilan.yil}</td>
            <td>{ilan.fiyat}</td>
            <td>{ilan.durum}</td>
            <td>
              <button onClick={() => durumDegistir(ilan.id, 'Aktif')}>
                Onayla
              </button>
              <button onClick={() => durumDegistir(ilan.id, 'Reddedildi')}>
                Reddet
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}





{sayfa === 'Kullanıcılar' && (
  <div>
    <h3>Kullanıcı Yönetimi</h3>

    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>ID</th>
          <th>Ad Soyad</th>
          <th>E-posta</th>
          <th>Rol</th>
          <th>İşlem</th>
        </tr>
      </thead>
      <tbody>
        {kullanicilar.map(kullanici => (
          <tr key={kullanici.id}>
            <td>{kullanici.id}</td>
            <td>{kullanici.ad}</td>
            <td>{kullanici.email}</td>
            <td>{kullanici.rol}</td>
            <td>
              <select
                value={kullanici.rol}
                onChange={e => rolDegistir(kullanici.id, e.target.value)}
              >
                <option value="admin">admin</option>
                <option value="moderator">moderator</option>
                <option value="catalog_editor">catalog_editor</option>
                <option value="support">support</option>
                <option value="content">content</option>
                <option value="viewer">viewer</option>
                <option value="member">member</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}



{sayfa === 'Moderasyon' && (
  <div>
    <h3>Şikayet Yönetimi</h3>
    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>Şikayet No</th>
          <th>İlan</th>
          <th>Şikayet Sebebi</th>
          <th>Durum</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>BMW 320i</td>
          <td>Yanlış fiyat bilgisi</td>
          <td>İncelenecek</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Audi A4</td>
          <td>Yanıltıcı açıklama</td>
          <td>İncelenecek</td>
        </tr>
      </tbody>
    </table>
  </div>
)}

  
      </div>
    </div>
  )
}

export default App
