const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: 'dyc0mcbkp',
  api_key: '712869652458293',
  api_secret: '7ZsvMcXDgYxzNV5DDpSuluJANXE',
});

async function updateImage() {
  try {
    const imagePath = 'D:\MB 官網\FW27原廠資料\ISM 拍攝資料\27FW MB展示會資料\0616 sec 1\1101776\1101776_DNV.JPG';
    
    console.log('📤 Uploading 1101776_DNV.JPG to Cloudinary...');
    console.log('   Path:', imagePath);
    const result = await cloudinary.uploader.upload(imagePath, {
      resource_type: 'auto',
      folder: 'montbell_fw27',
      public_id: '1101776_DNV',
      overwrite: true
    });

    console.log('✅ Upload successful!');
    console.log('   Version:', result.version);
    console.log('   URL:', result.secure_url);

    const mapping = JSON.parse(fs.readFileSync('public/imageMapping-internal.json', 'utf-8'));
    const newUrl = `https://res.cloudinary.com/dyc0mcbkp/image/upload/v${result.version}/montbell_fw27/1101776_DNV.jpg`;
    mapping['1101776_DNV'] = newUrl;
    
    if (mapping['1101776_DVN']) {
      delete mapping['1101776_DVN'];
      console.log('🗑️  Removed incorrect 1101776_DVN mapping');
    }

    fs.writeFileSync('public/imageMapping-internal.json', JSON.stringify(mapping, null, 2));
    console.log('✅ Updated imageMapping-internal.json');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateImage();
