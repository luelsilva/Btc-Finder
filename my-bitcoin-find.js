import CoinKey from 'coinkey';
import chalk from 'chalk'
import fs from 'fs';

function encontrarBitcoins(key, alvo) {

    for (let count = 10000; count > 0; count--) {

        key = key + 1n; // Incrementa a chave      

        let pkey = key.toString(16).padStart(64, '0'); // Converte para hexadecimal e adiciona zeros à esquerda

        let publicKey = generatePublic(pkey)

        if (alvo === (publicKey)) {
            console.log('Private key:', chalk.green(pkey))
            console.log('WIF:', chalk.green(generateWIF(pkey)))
            console.log('Public key:', chalk.green(publicKey));

            const filePath = './views/keys.txt';
            const lineToAppend = `Private key: ${pkey}, WIF: ${generateWIF(pkey)}, Public key: ${publicKey}\n`;

            try {
                fs.appendFileSync(filePath, lineToAppend);
                console.log('Chave escrita no arquivo com sucesso.');
            } catch (err) {
                console.error('Erro ao escrever chave em arquivo:', err);
            }

            process.exit();
        }

    }
};

function generatePublic(privateKey) {
    let _key = new CoinKey(new Buffer.from(privateKey, 'hex'))
    _key.compressed = true
    return _key.publicAddress
}

function generateWIF(privateKey) {
    let _key = new CoinKey(new Buffer.from(privateKey, 'hex'))
    return _key.privateWif
}

export default encontrarBitcoins;

