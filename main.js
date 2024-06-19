import CoinKey from 'coinkey';
import fs from 'fs';
import chalk from 'chalk'
import crypto from 'crypto';
import ranges from './ranges.js'
import walletsArray from './wallets.js';


const filePath = './keys.txt';
if (!fs.existsSync(filePath)) {
    try {
        fs.writeFileSync(filePath, 'Chaves encontradas:\n', 'utf8');
    } catch (err) {
        console.error('Erro ao escrever no arquivo:', err);
    }
}

const carteiraInit = 66; // deve se rum numero entre 1 e 160
const carteiraStop = 68;

const targetPublicKeys = walletsArray.slice(carteiraInit - 1, carteiraStop);

const walletsSet = new Set(targetPublicKeys);

const keyStart = ranges[carteiraInit - 1].min;
const keyStop = ranges[carteiraStop - 1].max;
const range = (BigInt(keyStop) - BigInt(keyStart));

while (true) {
    console.clear();
    console.log('Versão:', 2.1, 'Carteiras:', carteiraInit, 'até', carteiraStop);
    console.log('keyStart:   ', chalk.cyanBright(keyStart), BigInt(keyStart));
    console.log('keyStop:    ', chalk.cyanBright(keyStop), BigInt(keyStop));
    console.log('range:      ', chalk.cyanBright('0x' + range.toString(16)), range);

    console.log(chalk.magenta('Alvos:'));
    console.log(walletsSet);



    // imprimi 10 vezes antes de limpar a tela
    for (let index = 0; index < 10; index++) {

        //let fatorPorcentagem = Math.random(); // deve ser um numero entre 0 e 1
        let fatorPorcentagem = gerarNumeroAleatorioEntre0e1(); // deve ser um numero entre 0 e 1

        //fatorPorcentagem = 0.01;

        let inicialRange = range * BigInt(Math.floor(parseFloat(fatorPorcentagem) * 1e18)) / BigInt(1e18);
        let inicio = BigInt(keyStart) + BigInt(inicialRange);

        console.log(printTime(), ' fator:', chalk.yellow(fatorPorcentagem), '\t range start:  ', chalk.yellow(inicialRange.toString(16).padStart(17, '0')), ' Comecando em: ', chalk.yellow(inicio.toString(16)));

        //encontrarBitcoins(inicio, targetPublicKeys)
        // procura por 10000 chaves
        for (let count = 10000; count > 0; count--) {

            let pkey = inicio.toString(16).padStart(64, '0'); // Converte para hexadecimal e adiciona zeros à esquerda
            let publicKey = generatePublic(pkey)

            if (walletsSet.has(publicKey)) {

                console.log('Private key:', chalk.green(pkey))
                console.log('WIF:', chalk.green(generateWIF(pkey)))
                console.log('Public key:', chalk.green(publicKey));

                const filePath = './keys.txt';
                const lineToAppend = `Private key: ${pkey}, WIF: ${generateWIF(pkey)}, Public key: ${publicKey}\n`;

                try {
                    fs.appendFileSync(filePath, lineToAppend);
                    console.log('Chave escrita no arquivo com sucesso.');
                } catch (err) {
                    console.error('Erro ao escrever chave em arquivo:', err);
                }

                process.exit();

            }
            inicio = inicio + 1n; // Incrementa a chave 
        }
    }
}

function gerarNumeroAleatorioEntre0e1() {

    return Math.random();

    const randomBuffer = crypto.randomBytes(4); // Gera 4 bytes aleatórios
    const randomNumber = randomBuffer.readUInt32BE(0); // Converte os bytes para um número inteiro
    return randomNumber / 0xFFFFFFFF; // Divide pelo maior número de 32 bits para obter um valor entre 0 e 1
}

function printTime() {
    let date = new Date();
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function generatePublic(privateKey) {
    let _key = new CoinKey(new Buffer.from(privateKey, 'hex'))
    _key.compressed = true
    return _key.publicAddress
}

function generateWIF(privateKey) {
    let _key = new CoinKey(new Buffer.from(privateKey, 'hex'))
    return _key.privateWif
}

