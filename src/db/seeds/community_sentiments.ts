import { db } from '@/db';
import { communitySentiments } from '@/db/schema';

async function main() {
    const sampleSentiments = [
        // URGENT SENTIMENTS (12 entries) - Emergency and Critical disasters
        {
            disasterReportId: 1,
            sentiment: 'Urgent',
            comment: 'Kami sangat membutuhkan air bersih dan makanan. Bantuan belum sampai ke desa kami. Sudah 2 hari kami mengungsi tanpa pasokan yang memadai.',
            submittedBy: 'Ibu Sari Wulandari',
            createdAt: new Date('2024-01-15T08:30:00').toISOString(),
        },
        {
            disasterReportId: 2,
            sentiment: 'Urgent',
            comment: 'Mohon segera kirim tim medis, banyak warga terluka dan butuh pertolongan. Puskesmas terdekat juga terdampak gempa.',
            submittedBy: 'Bapak Hendra Gunawan',
            createdAt: new Date('2024-01-16T10:15:00').toISOString(),
        },
        {
            disasterReportId: 5,
            sentiment: 'Urgent',
            comment: 'Akses jalan terputus, kami terisolasi. Persediaan makanan hanya untuk 2 hari. Butuh bantuan helikopter untuk distribusi logistik.',
            submittedBy: 'Ketua RT 05 Desa Cianjur',
            createdAt: new Date('2024-01-18T14:45:00').toISOString(),
        },
        {
            disasterReportId: 3,
            sentiment: 'Urgent',
            comment: 'Situasi semakin parah, air banjir terus naik. Butuh evakuasi segera! Warga lansia dan anak-anak dalam bahaya.',
            submittedBy: 'Ahmad Hidayat',
            createdAt: new Date('2024-01-17T06:20:00').toISOString(),
        },
        {
            disasterReportId: 7,
            sentiment: 'Urgent',
            comment: 'Api menjalar cepat, sudah 50 rumah terbakar. Mobil pemadam tidak cukup, butuh bantuan dari daerah lain segera!',
            submittedBy: 'Ketua RW 03 Kelurahan Tanjung',
            createdAt: new Date('2024-01-20T16:30:00').toISOString(),
        },
        {
            disasterReportId: 9,
            sentiment: 'Urgent',
            comment: 'Longsor menutup jalan utama, ambulans tidak bisa masuk. Ada korban tertimbun yang membutuhkan penanganan cepat.',
            submittedBy: 'Pak Lurah Desa Sukamaju',
            createdAt: new Date('2024-01-22T07:50:00').toISOString(),
        },
        {
            disasterReportId: 12,
            sentiment: 'Urgent',
            comment: 'Awan panas turun ke permukiman, warga panik dan berlarian. Butuh koordinasi evakuasi massal sekarang juga!',
            submittedBy: 'Relawan PMI Merapi',
            createdAt: new Date('2024-01-25T11:20:00').toISOString(),
        },
        {
            disasterReportId: 15,
            sentiment: 'Urgent',
            comment: 'Tsunami warning belum dicabut, warga masih di pengungsian. Air bersih dan selimut sangat kurang untuk semua pengungsi.',
            submittedBy: 'Koordinator Posko Pengungsian',
            createdAt: new Date('2024-01-28T09:40:00').toISOString(),
        },
        {
            disasterReportId: 4,
            sentiment: 'Urgent',
            comment: 'Listrik padam total, komunikasi terputus. Kami butuh genset dan BBM untuk operasional posko darurat.',
            submittedBy: 'Eko Wijaya',
            createdAt: new Date('2024-01-17T19:15:00').toISOString(),
        },
        {
            disasterReportId: 6,
            sentiment: 'Urgent',
            comment: 'Banyak balita dan ibu hamil yang sakit karena kondisi pengungsian. Obat-obatan dan vitamin habis.',
            submittedBy: 'Ibu Dewi Kusuma',
            createdAt: new Date('2024-01-19T13:30:00').toISOString(),
        },
        {
            disasterReportId: 8,
            sentiment: 'Urgent',
            comment: 'Angin kencang merusak atap rumah, hujan deras masuk ke dalam. Kami butuh terpal dan tenda darurat secepatnya.',
            submittedBy: 'Bapak Joko Santoso',
            createdAt: new Date('2024-01-21T17:45:00').toISOString(),
        },
        {
            disasterReportId: 11,
            sentiment: 'Urgent',
            comment: 'Material longsor masih bergerak, ancaman longsor susulan sangat tinggi. Butuh evakuasi lanjutan untuk zona merah.',
            submittedBy: 'Tim SAR Puncak',
            createdAt: new Date('2024-01-24T08:10:00').toISOString(),
        },

        // CONCERNED SENTIMENTS (13 entries) - Critical and Alert situations
        {
            disasterReportId: 1,
            sentiment: 'Concerned',
            comment: 'Cuaca masih buruk, khawatir banjir akan bertambah tinggi. Prakiraan BMKG menyebutkan hujan masih akan berlanjut 3 hari ke depan.',
            submittedBy: 'Siti Nurhaliza',
            createdAt: new Date('2024-01-15T15:20:00').toISOString(),
        },
        {
            disasterReportId: 3,
            sentiment: 'Concerned',
            comment: 'Perlu tenda darurat lebih banyak, pengungsian sudah penuh. Masih ada 100 KK yang belum mendapat tempat berlindung.',
            submittedBy: 'Koordinator Logistik Banjir',
            createdAt: new Date('2024-01-17T11:40:00').toISOString(),
        },
        {
            disasterReportId: 2,
            sentiment: 'Concerned',
            comment: 'Gempa susulan masih terasa, warga takut untuk kembali ke rumah. Sudah 5 kali gempa susulan dalam 24 jam terakhir.',
            submittedBy: 'Ketua RT 08 Cianjur Kota',
            createdAt: new Date('2024-01-16T16:25:00').toISOString(),
        },
        {
            disasterReportId: 12,
            sentiment: 'Concerned',
            comment: 'Aktivitas gunung meningkat, kami khawatir akan ada erupsi lebih besar. Getaran dan gemburan terus terjadi.',
            submittedBy: 'Warga Desa Selo',
            createdAt: new Date('2024-01-25T14:50:00').toISOString(),
        },
        {
            disasterReportId: 5,
            sentiment: 'Concerned',
            comment: 'Tanah masih labil, khawatir terjadi longsor susulan. Retakan baru muncul di lereng atas kampung kami.',
            submittedBy: 'Bapak Agus Setiawan',
            createdAt: new Date('2024-01-18T18:30:00').toISOString(),
        },
        {
            disasterReportId: 7,
            sentiment: 'Concerned',
            comment: 'Angin masih kencang, api bisa menjalar lagi. Butuh pemantauan ketat dan pos pemadam siaga 24 jam.',
            submittedBy: 'Relawan Damkar Kelurahan',
            createdAt: new Date('2024-01-20T20:15:00').toISOString(),
        },
        {
            disasterReportId: 10,
            sentiment: 'Concerned',
            comment: 'Kondisi jembatan retak, khawatir tidak aman untuk dilalui. Perlu inspeksi teknis segera sebelum digunakan.',
            submittedBy: 'Ibu Rina Anggraini',
            createdAt: new Date('2024-01-23T10:45:00').toISOString(),
        },
        {
            disasterReportId: 13,
            sentiment: 'Concerned',
            comment: 'Ombak masih tinggi, nelayan belum berani melaut. Khawatir akan ketersediaan ikan dan mata pencaharian.',
            submittedBy: 'Ketua Nelayan Pantai Selatan',
            createdAt: new Date('2024-01-26T07:20:00').toISOString(),
        },
        {
            disasterReportId: 4,
            sentiment: 'Concerned',
            comment: 'Banyak anak-anak yang trauma, butuh pendampingan psikologis. Mereka takut tidur dan sering menangis.',
            submittedBy: 'Guru SD Negeri 3',
            createdAt: new Date('2024-01-17T14:30:00').toISOString(),
        },
        {
            disasterReportId: 14,
            sentiment: 'Concerned',
            comment: 'Air PAM keruh dan berbau, khawatir tidak layak diminum. Perlu pengujian kualitas air dan distribusi air bersih.',
            submittedBy: 'Ketua PKK Kelurahan',
            createdAt: new Date('2024-01-27T12:50:00').toISOString(),
        },
        {
            disasterReportId: 16,
            sentiment: 'Concerned',
            comment: 'Persediaan bahan bakar menipis, PLN belum bisa nyalakan listrik. Genset akan mati jika tidak ada pasokan solar.',
            submittedBy: 'Operator Posko Induk',
            createdAt: new Date('2024-01-29T09:15:00').toISOString(),
        },
        {
            disasterReportId: 6,
            sentiment: 'Concerned',
            comment: 'Wabah penyakit kulit mulai muncul di pengungsian. Kondisi sanitasi perlu diperbaiki untuk mencegah penyebaran.',
            submittedBy: 'Relawan Kesehatan',
            createdAt: new Date('2024-01-19T16:40:00').toISOString(),
        },
        {
            disasterReportId: 9,
            sentiment: 'Concerned',
            comment: 'Masih ada warga yang belum dievakuasi dari zona merah. Akses sulit dan cuaca tidak mendukung operasi penyelamatan.',
            submittedBy: 'Tim Basarnas',
            createdAt: new Date('2024-01-22T13:25:00').toISOString(),
        },

        // STABLE SENTIMENTS (8 entries) - Managed disasters
        {
            disasterReportId: 17,
            sentiment: 'Stable',
            comment: 'Bantuan sudah mulai berdatangan, situasi terkendali dengan baik. Terima kasih untuk semua pihak yang membantu.',
            submittedBy: 'Pak Lurah Kelurahan Baru',
            createdAt: new Date('2024-01-30T10:30:00').toISOString(),
        },
        {
            disasterReportId: 18,
            sentiment: 'Stable',
            comment: 'Tim SAR bekerja maksimal, warga merasa aman di pengungsian. Koordinasi antar lembaga berjalan lancar.',
            submittedBy: 'Ketua RT 12',
            createdAt: new Date('2024-01-31T14:20:00').toISOString(),
        },
        {
            disasterReportId: 19,
            sentiment: 'Stable',
            comment: 'Distribusi logistik lancar, kebutuhan pokok tercukupi. Dapur umum beroperasi dengan baik melayani 500 porsi per hari.',
            submittedBy: 'Relawan Dapur Umum',
            createdAt: new Date('2024-02-01T11:45:00').toISOString(),
        },
        {
            disasterReportId: 20,
            sentiment: 'Stable',
            comment: 'Alhamdulillah bantuan pemerintah sudah sampai, kami sangat berterima kasih. Semua kebutuhan mendesak sudah terpenuhi.',
            submittedBy: 'Ibu Fatimah Zahra',
            createdAt: new Date('2024-02-02T09:15:00').toISOString(),
        },
        {
            disasterReportId: 21,
            sentiment: 'Stable',
            comment: 'Posko kesehatan berfungsi baik, tenaga medis cukup. Pelayanan kesehatan gratis untuk semua pengungsi.',
            submittedBy: 'Dokter Posko Medis',
            createdAt: new Date('2024-02-03T13:50:00').toISOString(),
        },
        {
            disasterReportId: 22,
            sentiment: 'Stable',
            comment: 'Anak-anak sudah bisa belajar di tenda darurat. Guru sukarelawan mengajar dan memberikan trauma healing.',
            submittedBy: 'Koordinator Pendidikan Darurat',
            createdAt: new Date('2024-02-04T10:25:00').toISOString(),
        },
        {
            disasterReportId: 23,
            sentiment: 'Stable',
            comment: 'Toilet dan MCK darurat sudah dibangun, kondisi sanitasi membaik. Tidak ada lagi keluhan penyakit diare.',
            submittedBy: 'Tim Sanitasi Lingkungan',
            createdAt: new Date('2024-02-05T15:40:00').toISOString(),
        },
        {
            disasterReportId: 24,
            sentiment: 'Stable',
            comment: 'Sistem komunikasi sudah pulih, warga bisa menghubungi keluarga. Sinyal provider sudah normal kembali.',
            submittedBy: 'Bapak Rudi Hartono',
            createdAt: new Date('2024-02-06T12:10:00').toISOString(),
        },

        // RECOVERING SENTIMENTS (7 entries) - Recovery phase
        {
            disasterReportId: 25,
            sentiment: 'Recovering',
            comment: 'Pembersihan sudah dimulai, warga bergotong royong membersihkan lumpur. Semangat gotong royong sangat terasa di sini.',
            submittedBy: 'Ketua Karang Taruna',
            createdAt: new Date('2024-02-07T08:30:00').toISOString(),
        },
        {
            disasterReportId: 26,
            sentiment: 'Recovering',
            comment: 'Listrik sudah mulai menyala, kehidupan mulai normal kembali. PLN bekerja cepat memperbaiki jaringan yang rusak.',
            submittedBy: 'Ibu Endang Lestari',
            createdAt: new Date('2024-02-08T16:20:00').toISOString(),
        },
        {
            disasterReportId: 27,
            sentiment: 'Recovering',
            comment: 'Kondisi semakin membaik, beberapa warga sudah kembali ke rumah. Proses rehabilitasi rumah ringan sudah dimulai.',
            submittedBy: 'Pak RT 06 Desa Maju',
            createdAt: new Date('2024-02-09T11:45:00').toISOString(),
        },
        {
            disasterReportId: 28,
            sentiment: 'Recovering',
            comment: 'Terima kasih untuk semua bantuan, kami mulai membangun kembali. Bantuan material bangunan sangat membantu pemulihan.',
            submittedBy: 'Bapak Wahyu Prasetyo',
            createdAt: new Date('2024-02-10T14:30:00').toISOString(),
        },
        {
            disasterReportId: 29,
            sentiment: 'Recovering',
            comment: 'Pasar darurat sudah dibuka, aktivitas ekonomi mulai berjalan. Warga sudah bisa berdagang dan mencari nafkah lagi.',
            submittedBy: 'Ketua Pedagang Pasar',
            createdAt: new Date('2024-02-11T09:50:00').toISOString(),
        },
        {
            disasterReportId: 30,
            sentiment: 'Recovering',
            comment: 'Sekolah mulai beroperasi normal, anak-anak senang bisa belajar lagi. Gedung sekolah sudah selesai diperbaiki.',
            submittedBy: 'Kepala Sekolah SD Harapan',
            createdAt: new Date('2024-02-12T10:15:00').toISOString(),
        },
        {
            disasterReportId: 25,
            sentiment: 'Recovering',
            comment: 'Air bersih sudah mengalir lancar, PDAM berhasil perbaiki pipa. Kualitas air sudah dinyatakan layak konsumsi.',
            submittedBy: 'Petugas PDAM Wilayah',
            createdAt: new Date('2024-02-13T13:40:00').toISOString(),
        },
    ];

    await db.insert(communitySentiments).values(sampleSentiments);
    
    console.log('✅ Community sentiments seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});