const sqlite3 = require('sqlite3').verbose();

// Opret forbindelse til SQLite-databasen
const db1 = new sqlite3.Database('tøjPræferencerDB.sqlite');

// Opret tabellen og indsæt testdata
db1.serialize(() => {
    // Opret medarbejdere tabel
    db1.run(`CREATE TABLE IF NOT EXISTS tøjPræferencer (
        id INTEGER PRIMARY KEY,
        navn TEXT,
        sko INTEGER,
        jakke TEXT,
        tshirt TEXT,
        bukser TEXT,
        shorts TEXT,
        vest TEXT,
        heldragt TEXT
    )`);

    // Indsæt testdata
    const testData = [
        { navn: 'Anders Andreasen', sko: 43, jakke: 'M', tshirt: 'M', bukser: 'M', shorts: 'M', vest: 'M', heldragt: 'M' },
        { navn: 'Bjarne Bornedal', sko: 47, jakke: 'XL', tshirt: 'XL', bukser: 'XL', shorts: 'XL', vest: 'XL', heldragt: 'XL' },
        { navn: 'Carl Christiansen', sko: 41, jakke: 'S', tshirt: 'S', bukser: 'S', shorts: 'S', vest: 'S', heldragt: 'S' },
        { navn: 'Dorthe Dalsgaard', sko: 37, jakke: 'L', tshirt: 'L', bukser: 'M', shorts: 'L', vest: 'L', heldragt: 'M' },
        { navn: 'Emil Eriksen', sko: null, jakke: null, tshirt: null, bukser: null, shorts: null, vest: null, heldragt: null }
    ];

    const stmt = db1.prepare(`INSERT INTO tøjPræferencer (navn, sko, jakke, tshirt, bukser, shorts, vest, heldragt) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

    testData.forEach(medarbejder => {
        stmt.run(
            medarbejder.navn,
            medarbejder.sko,
            medarbejder.jakke,
            medarbejder.tshirt,
            medarbejder.bukser,
            medarbejder.shorts,
            medarbejder.vest,
            medarbejder.heldragt
        );
    });
    stmt.finalize();

    console.log('Database oprettet med testdata.');
});

// Luk forbindelsen til databasen
db1.close();

// Opret forbindelse til forespørgslerDB.
const db2 = new sqlite3.Database('anmodningerDB.sqlite');

db2.serialize(() => {
    // Opret forespørgsler tabel i forespørgslerDB.sqlite
    db2.run(`CREATE TABLE IF NOT EXISTS anmodninger (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        oprettetAf INTEGER,
        sko_str INTEGER,
        sko_antal INTEGER,
        jakke_str INTEGER,
        jakke_antal INTEGER,
        tshirt_str INTEGER,
        tshirt_antal INTEGER,
        bukser_str INTEGER,
        bukser_antal INTEGER,
        shorts_str INTEGER,
        shorts_antal INTEGER,
        vest_str INTEGER,
        vest_antal INTEGER,
        heldragt_str INTEGER,
        heldragt_antal INTEGER
    )`);
});

db2.close();