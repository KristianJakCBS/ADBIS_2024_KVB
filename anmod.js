const sqlite3 = require('sqlite3').verbose();
const readline = require('readline');

// Opret forbindelse til medarbejderStørrelser.sqlite.
const db1 = new sqlite3.Database('tøjPræferencerDB.sqlite');

// Opret forbindelse til forespørgslerDB.
const db2 = new sqlite3.Database('anmodningerDB.sqlite');

// Opret readline. Læser input fra terminalen.
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let tøjtyper = ['sko', 'jakke', 'tshirt', 'bukser', 'shorts', 'vest', 'heldragt'];
let anmodning = {
    oprettetAf: '',
    sko_str: null,
    sko_antal: 0,
    jakke_str: null,
    jakke_antal: 0,
    tshirt_str: null,
    tshirt_antal: 0,
    bukser_str: null,
    bukser_antal: 0,
    shorts_str: null,
    shorts_antal: 0,
    vest_str: null,
    vest_antal: 0,
    heldragt_str: null,
    heldragt_antal: 0
}

let orderMore = true;

function willUserOrderMore() {
    rl.question('Vil du bestille mere tøj? (y/n): ', (answer) => {
        if (answer.toLowerCase() === 'n'){
            orderMore = false
            db2.run(`INSERT INTO anmodninger (
                oprettetAf,
                sko_str,
                sko_antal,
                jakke_str,
                jakke_antal,
                tshirt_str,
                tshirt_antal,
                bukser_str,
                bukser_antal,
                shorts_str,
                shorts_antal,
                vest_str,
                vest_antal,
                heldragt_str,
                heldragt_antal
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                    anmodning.oprettetAf,
                    anmodning.sko_antal === 0 ? null : anmodning.sko_str,
                    anmodning.sko_antal === 0 ? null : anmodning.sko_antal,
                    anmodning.jakke_antal === 0 ? null : anmodning.jakke_str,
                    anmodning.jakke_antal === 0 ? null : anmodning.jakke_antal,
                    anmodning.tshirt_antal === 0 ? null : anmodning.tshirt_str,
                    anmodning.tshirt_antal === 0 ? null : anmodning.tshirt_antal,
                    anmodning.bukser_antal === 0 ? null : anmodning.bukser_str,
                    anmodning.bukser_antal === 0 ? null : anmodning.bukser_antal,
                    anmodning.shorts_antal === 0 ? null : anmodning.shorts_str,
                    anmodning.shorts_antal === 0 ? null : anmodning.shorts_antal,
                    anmodning.vest_antal === 0 ? null : anmodning.vest_str,
                    anmodning.vest_antal === 0 ? null : anmodning.vest_antal,
                    anmodning.heldragt_antal === 0 ? null : anmodning.heldragt_str,
                    anmodning.heldragt_antal === 0 ? null : anmodning.heldragt_antal
                ], function(err) {
                    if (err) {
                        console.log(err.message);
                    } else {
                        console.log('Anmodning oprettet');
                    }
                    rl.close();
                }
            );
            rl.close()
        } else {
            promptTypeTøj();
        }
    })
}

function promptTypeTøj() {
    if (orderMore === true) {
        rl.question('Hvilken tøjtype vil du anmode om? ', (tøjtypeInput) => {
            if (tøjtyper.includes(tøjtypeInput)){
                switch (tøjtypeInput) {
                    case 'sko': anmodning.sko_antal++; break;
                    case 'jakke': anmodning.jakke_antal++; break;
                    case 'tshirt': anmodning.tshirt_antal++; break;
                    case 'bukser': anmodning.bukser_antal++; break;
                    case 'shorts': anmodning.bukser_antal++; break;
                    case 'vest': anmodning.vest_antal++; break;
                    case 'heldragt': anmodning.heldragt_antal++; break
                }
            } else {
                console.log('Forkert input, prøv igen');
                promptTypeTøj();
            }
            willUserOrderMore();
        })
    }
}

function opretAnmodning() {
    rl.question('Indtast medarbejder ID: ', (medarbejderIdInput) => {
        db1.get(`SELECT * FROM tøjPræferencer WHERE id = ?`, [medarbejderIdInput], (err, medarbejder) => {
            if (err) {
                console.log(err.message);
                rl.close()
            } else {
                anmodning.oprettetAf = medarbejder.id
                anmodning.sko_str = medarbejder.sko
                anmodning.jakke_str = medarbejder.jakke
                anmodning.tshirt_str = medarbejder.tshirt
                anmodning.bukser_str = medarbejder.bukser
                anmodning.shorts_str = medarbejder.shorts
                anmodning.vest_str = medarbejder.vest
                anmodning.heldragt_str = medarbejder.heldragt
            };
        });
        promptTypeTøj();
    });
}

opretAnmodning()