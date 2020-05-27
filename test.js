var scf = require("./index.js");

async function main(){
  let src = await scf.getSrc("spotify:album:4GMgNPA4fMv3U0QQsdRLJk");
  console.log(`src: ${src}`);

  scf.download(['gfsdgfksg jkfsl g', 'spotify:album:4GMgNPA4fMv3U0QQsdRLJk'])
}

main();
