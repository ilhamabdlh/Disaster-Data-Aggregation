import { db } from '@/db';
import { infrastructureStatus } from '@/db/schema';

async function main() {
    const sampleInfrastructureStatus = [
        // Flood disasters (disaster_report_id 1-10)
        {
            disasterReportId: 1,
            infrastructureType: 'Road',
            status: 'Destroyed',
            description: 'Jalan Raya Jakarta-Bekasi KM 15-18 tergenang banjir setinggi 2 meter, akses terputus total. Jalur alternatif dialihkan melalui Tol Cikampek.',
            createdAt: new Date('2024-01-15T08:30:00Z').toISOString(),
        },
        {
            disasterReportId: 2,
            infrastructureType: 'Power',
            status: 'Damaged',
            description: 'Gardu listrik PLN Kemang terendam banjir, pemadaman listrik terdampak 15.000 pelanggan. Estimasi pemulihan 3-4 hari.',
            createdAt: new Date('2024-01-16T09:15:00Z').toISOString(),
        },
        {
            disasterReportId: 3,
            infrastructureType: 'Water',
            status: 'Destroyed',
            description: 'Instalasi PDAM Cipayung rusak akibat lumpur banjir, 50.000 pelanggan kehilangan akses air bersih. Distribusi air melalui tangki darurat.',
            createdAt: new Date('2024-01-17T10:00:00Z').toISOString(),
        },
        {
            disasterReportId: 4,
            infrastructureType: 'School',
            status: 'Damaged',
            description: 'SDN 12 Kampung Melayu terendam 1.5 meter, ruang kelas lantai 1 rusak, perlu renovasi. Kegiatan belajar dipindahkan ke sekolah terdekat.',
            createdAt: new Date('2024-01-18T07:45:00Z').toISOString(),
        },
        {
            disasterReportId: 5,
            infrastructureType: 'Hospital',
            status: 'Operational',
            description: 'RSUD Tangerang masih beroperasi dengan kapasitas 80%, area parkir terendam namun akses darurat tetap berfungsi.',
            createdAt: new Date('2024-01-19T08:20:00Z').toISOString(),
        },
        {
            disasterReportId: 6,
            infrastructureType: 'Bridge',
            status: 'Damaged',
            description: 'Jembatan Kali Ciliwung retak pada struktur penyangga, ditutup sementara untuk kendaraan berat di atas 10 ton.',
            createdAt: new Date('2024-01-20T09:00:00Z').toISOString(),
        },
        {
            disasterReportId: 7,
            infrastructureType: 'Road',
            status: 'Operational',
            description: 'Jalan Gatot Subroto banjir surut, jalur sudah dibersihkan dan dapat dilalui kendaraan. Monitoring terus dilakukan.',
            createdAt: new Date('2024-01-21T11:30:00Z').toISOString(),
        },
        {
            disasterReportId: 8,
            infrastructureType: 'Power',
            status: 'Operational',
            description: 'Jaringan listrik PLN Cibubur kembali normal setelah perbaikan darurat, seluruh pelanggan sudah teraliri listrik.',
            createdAt: new Date('2024-01-22T08:00:00Z').toISOString(),
        },
        {
            disasterReportId: 9,
            infrastructureType: 'School',
            status: 'Destroyed',
            description: 'SMPN 7 Rawajati rusak total lantai 1, 12 ruang kelas tidak dapat digunakan. Perlu pembangunan ulang.',
            createdAt: new Date('2024-01-23T09:45:00Z').toISOString(),
        },
        {
            disasterReportId: 10,
            infrastructureType: 'Water',
            status: 'Damaged',
            description: 'Pipa distribusi PDAM Depok bocor di 8 titik, tekanan air berkurang 40%. Perbaikan berlangsung bertahap.',
            createdAt: new Date('2024-01-24T10:20:00Z').toISOString(),
        },
        // Earthquake disasters (disaster_report_id 11-16)
        {
            disasterReportId: 11,
            infrastructureType: 'Hospital',
            status: 'Damaged',
            description: 'RSUD Cianjur mengalami kerusakan struktural pada sayap timur, kapasitas berkurang 60%. Pasien dialihkan ke rumah sakit terdekat.',
            createdAt: new Date('2024-02-01T14:30:00Z').toISOString(),
        },
        {
            disasterReportId: 12,
            infrastructureType: 'Bridge',
            status: 'Destroyed',
            description: 'Jembatan Cipanas ambruk total akibat gempa 6.5 SR, akses ke 5 desa terputus. Jembatan darurat sedang dibangun.',
            createdAt: new Date('2024-02-02T15:15:00Z').toISOString(),
        },
        {
            disasterReportId: 13,
            infrastructureType: 'School',
            status: 'Damaged',
            description: 'SMAN 1 Cianjur retak di beberapa bagian dinding, 6 ruang kelas ditutup sementara untuk pemeriksaan struktural.',
            createdAt: new Date('2024-02-03T08:45:00Z').toISOString(),
        },
        {
            disasterReportId: 14,
            infrastructureType: 'Road',
            status: 'Damaged',
            description: 'Jalan Raya Cianjur-Sukabumi retak sepanjang 2 km, hanya bisa dilalui kendaraan kecil dengan kecepatan maksimal 20 km/jam.',
            createdAt: new Date('2024-02-04T09:30:00Z').toISOString(),
        },
        {
            disasterReportId: 15,
            infrastructureType: 'Power',
            status: 'Damaged',
            description: 'Jaringan transmisi PLN Garut rusak pada 3 tiang utama, pemadaman bergilir dilakukan untuk 25.000 pelanggan.',
            createdAt: new Date('2024-02-05T10:00:00Z').toISOString(),
        },
        {
            disasterReportId: 16,
            infrastructureType: 'Hospital',
            status: 'Operational',
            description: 'Puskesmas Sumedang masih beroperasi normal, melakukan pendataan korban luka-luka gempa dari wilayah sekitar.',
            createdAt: new Date('2024-02-06T11:20:00Z').toISOString(),
        },
        // Volcanic disasters (disaster_report_id 17-21)
        {
            disasterReportId: 17,
            infrastructureType: 'Road',
            status: 'Destroyed',
            description: 'Jalan akses Gunung Semeru tertutup material vulkanik dan lahar dingin setinggi 3 meter sepanjang 8 km. Akses evakuasi terhambat total.',
            createdAt: new Date('2024-02-10T16:00:00Z').toISOString(),
        },
        {
            disasterReportId: 18,
            infrastructureType: 'School',
            status: 'Destroyed',
            description: 'SDN 05 Lumajang roboh akibat timbunan abu vulkanik dan material erupsi. Bangunan tidak dapat diselamatkan.',
            createdAt: new Date('2024-02-11T17:30:00Z').toISOString(),
        },
        {
            disasterReportId: 19,
            infrastructureType: 'Power',
            status: 'Damaged',
            description: 'Gardu distribusi PLN Probolinggo rusak tertimpa material vulkanik, 8.000 KK mengalami pemadaman listrik.',
            createdAt: new Date('2024-02-12T18:15:00Z').toISOString(),
        },
        {
            disasterReportId: 20,
            infrastructureType: 'Water',
            status: 'Operational',
            description: 'Instalasi PDAM Malang tetap beroperasi dengan sistem penyaringan tambahan untuk mengatasi abu vulkanik dalam air baku.',
            createdAt: new Date('2024-02-13T09:00:00Z').toISOString(),
        },
        {
            disasterReportId: 21,
            infrastructureType: 'Bridge',
            status: 'Operational',
            description: 'Jembatan Kediri masih dalam kondisi baik, dilakukan pembersihan rutin dari abu vulkanik untuk menjaga keamanan.',
            createdAt: new Date('2024-02-14T10:30:00Z').toISOString(),
        },
        // Landslide disasters (disaster_report_id 22-25)
        {
            disasterReportId: 22,
            infrastructureType: 'Road',
            status: 'Destroyed',
            description: 'Jalan Raya Puncak - Cianjur tertutup material longsor setinggi 5 meter sepanjang 500 meter. Akses terputus total, evakuasi menggunakan jalur alternatif.',
            createdAt: new Date('2024-02-18T13:45:00Z').toISOString(),
        },
        {
            disasterReportId: 23,
            infrastructureType: 'Bridge',
            status: 'Damaged',
            description: 'Jembatan Sei Deli Medan retak pada struktur utama akibat tekanan tanah longsor, ditutup total untuk perbaikan.',
            createdAt: new Date('2024-02-19T14:20:00Z').toISOString(),
        },
        {
            disasterReportId: 24,
            infrastructureType: 'School',
            status: 'Operational',
            description: 'SMPN 3 Bogor aman dari longsor, namun akses jalan menuju sekolah terganggu. Pembelajaran dilanjutkan dengan penjemputan siswa.',
            createdAt: new Date('2024-02-20T08:30:00Z').toISOString(),
        },
        {
            disasterReportId: 25,
            infrastructureType: 'Power',
            status: 'Operational',
            description: 'Jaringan listrik PLN Sukabumi tidak terdampak longsor, pemantauan terus dilakukan pada area rawan.',
            createdAt: new Date('2024-02-21T09:15:00Z').toISOString(),
        },
    ];

    await db.insert(infrastructureStatus).values(sampleInfrastructureStatus);
    
    console.log('✅ Infrastructure status seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});