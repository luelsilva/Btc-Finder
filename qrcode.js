import { toFile } from 'qrcode';

var wif = process.argv[2];

  toFile('./file.png', wif, {
    errorCorrectionLevel: 'H'
  }, function (err) {
    if (err) throw err;
    console.log('QR code saved!');
  });
