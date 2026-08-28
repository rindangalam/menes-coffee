import fs from 'fs';
import https from 'https';

const galleryImages = [
  { url: 'https://scontent-nrt1-1.cdninstagram.com/v/t51.82787-15/787136305_17943293832334856_6875853602328057937_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&ig_cache_key=Mzk3Mjc2ODE3NjU3Mzc3MTIwNA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTI4MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=hHCcQEe0crEQ7kNvwEdQyOF&_nc_oc=Adp_3WHK5xChCnFsnNy2dbZS8Qx1U0JDae0iUa93ieZ4byo7LbkGLGEceBQOBmDK0R8&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_gid=7lILWF2kBK4ko_5PIpD-oQ&_nc_ss=7a22e&oh=00_AQH4UN0kTcp5nvMAanhsGPuPS2lSFvgctEfiykG8BYohvA&oe=6A96E456', name: 'gallery-01-no-rush.jpg' },
  { url: 'https://scontent-nrt1-1.cdninstagram.com/v/t51.82787-15/780910200_17942513064334856_8164847459006144422_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ig_cache_key=Mzk2OTE3OTU4NjcxOTQzOTg3MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMzI4MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=tpvpVjlJd5EQ7kNvwEPFP5_&_nc_oc=Adrh8NleXwPil22lGJSNHKYJvVzPYIT88B-dEdgafQsKM8_YeWG7noJ42K7u5xwWK04&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_gid=7lILWF2kBK4ko_5PIpD-oQ&_nc_ss=7a22e&oh=00_AQFUb7mbL0WXQ76ieofa7m02n0lPEHy40-SnOlFmg2wb8w&oe=6A96C783', name: 'gallery-02-lifestyle.jpg' },
  { url: 'https://scontent-nrt1-1.cdninstagram.com/v/t51.82787-15/779200925_17942009403334856_3879673115705279762_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=103&ig_cache_key=Mzk2NzEyNTEyMjIzOTk3OTUxNjE3OTQyMDA5NDAwMzM0ODU2.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjEyNDIuc2RyLnZpZGVvX2RlZmF1bHRfY292ZXJfZnJhbWUuQzMifQ%3D%3D&_nc_ohc=6h_k2YaHrfMQ7kNvwGf7d0Q&_nc_oc=Adpn-fDmVefk1h-5-CsrLizJ5KGJjBrDxlG5wiQNqn6Z1kh5QUbk1EaFph5ebfiJg7E&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_gid=7lILWF2kBK4ko_5PIpD-oQ&_nc_ss=7a22e&oh=00_AQFJtt4OAPvmds6O3bROI9GAEWn9ISnQTgU90V6kxYMmow&oe=6A96E891', name: 'gallery-03-reel-music.jpg' },
  { url: 'https://scontent-nrt1-2.cdninstagram.com/v/t51.82787-15/774508940_17940932748334856_4397505546777390059_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=101&ig_cache_key=Mzk2MzQ5MzIwNTQ4NTYwMjQyMjE3OTQwOTMyNzQyMzM0ODU2.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjcyMC5zZHIudmlkZW9fZGVmYXVsdF9jb3Zlcl9mcmFtZS5DMyJ9&_nc_ohc=sWO0v_aqA5wQ7kNvwG73o9b&_nc_oc=Adq5Fjyr6ykw0JUGDq0euFqkEdcOLmOYt8BjlPTw_NeI1kcFrbO5nUAnQGJyc9skhIM&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-nrt1-2.cdninstagram.com&_nc_gid=7lILWF2kBK4ko_5PIpD-oQ&_nc_ss=7a22e&oh=00_AQEGDeOQ8DNXjAQCMmDythm4zLQtGNxHVNb91l7E3DlF8Q&oe=6A96E4EB', name: 'gallery-04-reel-moment.jpg' },
  { url: 'https://scontent-nrt1-2.cdninstagram.com/v/t51.82787-15/772137118_17940714609334856_4502337015111737265_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=104&ig_cache_key=Mzk2MjY4MDA0NTA5MDU1MDEyMTE3OTQwNzE0NjAzMzM0ODU2.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjcyMC5zZHIudmlkZW9fZGVmYXVsdF9jb3Zlcl9mcmFtZS5DMyJ9&_nc_ohc=LpnKoratGT8Q7kNvwGLlDXp&_nc_oc=AdoviuT5oLCwI89gt73LUvc1gnwKxolnbR2oK9dTIb26rroQWpyRKMQyIXsmzmhbzRs&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-nrt1-2.cdninstagram.com&_nc_gid=7lILWF2kBK4ko_5PIpD-oQ&_nc_ss=7a22e&oh=00_AQFgFUe-GZ_1A-B7ekKGUNztF5y7m7rytfoCglw9K7R7PQ&oe=6A96C6A3', name: 'gallery-05-reel-ready.jpg' },
  { url: 'https://scontent-nrt1-1.cdninstagram.com/v/t51.82787-15/766259485_17939718411334856_3282792460513832165_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=108&ig_cache_key=Mzk1ODUxNDUzMzcxMjMwMTg4MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMzA3Mi5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=ZcOFC_45HyEQ7kNvwE8S1lc&_nc_oc=AdpmlUOWpWIezURTCnvV8hUUZDBTn2cQ65B08QOsQuvcIe-b8qQGrQYxxEoCI_IgXRE&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_gid=7lILWF2kBK4ko_5PIpD-oQ&_nc_ss=7a22e&oh=00_AQHJOdailRVdfqOjq4CS_BW1RqETm3hI3dcGKPBVwIKynQ&oe=6A96D125', name: 'gallery-06-study.jpg' },
  { url: 'https://scontent-nrt1-1.cdninstagram.com/v/t51.82787-15/762324948_17938871550334856_5945706214803843822_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=109&ig_cache_key=Mzk1NDgxMDA0NDAzMTU3NzQyOTE3OTM4ODcxNTQ0MzM0ODU2.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjcyMC5zZHIudmlkZW9fZGVmYXVsdF9jb3Zlcl9mcmFtZS5DMyJ9&_nc_ohc=THPMlVeifz8Q7kNvwGZru35&_nc_oc=Adrm4UT1jlnI0Q9ZvEWfXCzEBnrLIoi6PLuGKiuBCNXp_Rs9y-nawMUUo4H3VvytbEU&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_gid=7lILWF2kBK4ko_5PIpD-oQ&_nc_ss=7a22e&oh=00_AQFBw8lBRGFBRj1p9RrSJJBP3aeIZ0tUH-eJQzMIKEW1TQ&oe=6A96D6C2', name: 'gallery-07-be-more.jpg' },
  { url: 'https://scontent-nrt1-1.cdninstagram.com/v/t51.82787-15/774826033_17940714867334856_307683458409111674_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=108&ig_cache_key=Mzk1NjI2MzMzMzg5MzkyNDE1MjE3OTQwNzE0ODY0MzM0ODU2.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjcyMC5zZHIudmlkZW9fZGVmYXVsdF9jb3Zlcl9mcmFtZS5DMyJ9&_nc_ohc=sww4wHcYFasQ7kNvwGWQMTM&_nc_oc=AdoBUIsrFyvprQFyd3UwopV05GPx5mdIMSsqD65g3f6EQOmfPZqYy0-e9hJ2uWTTbjM&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_gid=7lILWF2kBK4ko_5PIpD-oQ&_nc_ss=7a22e&oh=00_AQGgTqHCtOrgCMs_8vM31WIXUt5UF_w5fD6EPYYpBiCmUw&oe=6A96E193', name: 'gallery-08-hold-moments.jpg' },
  { url: 'https://scontent-nrt6-1.cdninstagram.com/v/t51.82787-15/770831923_17940714891334856_895706808336355949_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=111&ig_cache_key=Mzk1MzMyODA4MjkzMDQyMTQ0NjE3OTQwNzE0ODg4MzM0ODU2.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjcyMC5zZHIudmlkZW9fZGVmYXVsdF9jb3Zlcl9mcmFtZS5DMyJ9&_nc_ohc=vPNRRUR5rrYQ7kNvwHRITgB&_nc_oc=Adp_tXg1dPETKB8RYsVFbb6K5D4Wx_V40fUEllQxNLnDkrinIdDdW9Muqki-9aENHBo&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-nrt6-1.cdninstagram.com&_nc_gid=7lILWF2kBK4ko_5PIpD-oQ&_nc_ss=7a22e&oh=00_AQGTOnJI-nJfbhsRFdFO1ApGT7NA0XeyskVwQ5qLCuJK2A&oe=6A96DE1D', name: 'gallery-09-memories.jpg' },
  { url: 'https://scontent-nrt1-2.cdninstagram.com/v/t51.82787-15/771814728_17940714915334856_6885287649587126583_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=102&ig_cache_key=Mzk1MjU1MDIyMTUzNzY2NDMwMTE3OTQwNzE0OTEyMzM0ODU2.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjcyMC5zZHIudmlkZW9fZGVmYXVsdF9jb3Zlcl9mcmFtZS5DMyJ9&_nc_ohc=0eyL79XXyPUQ7kNvwHBpzjW&_nc_oc=AdoCPbJGIYwC9XoAOmyUH3F51b7QI_uX3nXLhoFP_cgiB8z4QDh-BIXHjP3vSDeZGpU&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-nrt1-2.cdninstagram.com&_nc_gid=7lILWF2kBK4ko_5PIpD-oQ&_nc_ss=7a22e&oh=00_AQFKRMTCgvoaJVtA47biknnJ_f2UXFDyJGrREfffly5vvw&oe=6A96C727', name: 'gallery-10-choose-yourself.jpg' },
  { url: 'https://scontent-nrt1-1.cdninstagram.com/v/t51.82787-15/774575364_17940714942334856_8471461936707557469_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=109&ig_cache_key=Mzk0ODM1MDgzNzc5MDkxOTAzOTE3OTQwNzE0OTM5MzM0ODU2.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjcyMC5zZHIudmlkZW9fZGVmYXVsdF9jb3Zlcl9mcmFtZS5DMyJ9&_nc_ohc=FgkbmPI3oZYQ7kNvwFEz0eQ&_nc_oc=Adrsc76qvtPKT1Y2V9gQoxCD3mIimsaoAwmQc0Bk1tbMBYHDuDKexb-i-s999l0dgks&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_gid=7lILWF2kBK4ko_5PIpD-oQ&_nc_ss=7a22e&oh=00_AQE3Yjl8tOPKdVxztXJKXQx02LxuDIFadbPt63zVxFn_uA&oe=6A96CB06', name: 'gallery-11-perfection.jpg' },
  { url: 'https://scontent-nrt6-1.cdninstagram.com/v/t51.82787-15/753231729_17936765967334856_6293547029886772701_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=100&ig_cache_key=Mzk0NjExMjQyMzg4MDMzNDc1Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMzI3Ny5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=oLskYbCggGwQ7kNvwH9gv9R&_nc_oc=AdprPSvwH2ZSszFXJe61TEUYDOcQFt8l6SIT02_lE0zUPJfwQEVck9ngWjYmLRCwoOQ&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-nrt6-1.cdninstagram.com&_nc_gid=7lILWF2kBK4ko_5PIpD-oQ&_nc_ss=7a22e&oh=00_AQH41j6wcTssuL8LqIJEpdp09tu_Hgb6vtw1PtnW7WzVIQ&oe=6A96CFF0', name: 'gallery-12-hiring.jpg' },
];

const logoUrl = 'https://scontent-nrt1-1.cdninstagram.com/v/t51.82787-19/718576635_17929321689334856_2848131325044070126_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=108&_nc_oc=Q6cZ2gEVGQJOgXieh75_4QjopMBozfqxb_KStc4U-_30jN0GMZtzRA65EeghQj73t_DY0rc&_nc_ohc=l_jEvjV0MCUQ7kNvwHHfKs6&_nc_gid=7lILWF2kBK4ko_5PIpD-oQ&edm=AE-LrgUBAAAA&ccb=7-5&oh=00_AQF505FeSkJ4VtLqrCo2ZHigvb6zA6m0sytCDdOi9vUvwA&oe=6A96DA38&_nc_sid=8353fa';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('Downloading logo...');
  try {
    await downloadFile(logoUrl, './public/logo/logo.png');
    console.log('✅ Logo downloaded');
  } catch (e) {
    console.error('❌ Logo failed:', e.message);
  }

  console.log(`Downloading ${galleryImages.length} gallery images...`);
  for (const img of galleryImages) {
    try {
      await downloadFile(img.url, `./public/images/${img.name}`);
      console.log(`✅ ${img.name}`);
    } catch (e) {
      console.error(`❌ ${img.name}:`, e.message);
    }
  }
  console.log('Done!');
}

main();