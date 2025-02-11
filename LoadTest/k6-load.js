import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    vus: 50,               // Aynı anda 50 kullanıcı
    duration: '600s',      // 10 dakika boyunca test
};

export default function () {
    const url = 'http://127.0.0.1';
    
    // HTTP isteği için başlıkları (headers) belirliyoruz
    const params = {
        headers: {
            'Host': 'www.sevgin.com',   // İstekte www.sevgin.com host başlığını ekliyoruz.
        },
    };

    // GET isteği gönderiyoruz
    http.get(url, params);

    // 1 saniye bekliyoruz
    sleep(1);
}


