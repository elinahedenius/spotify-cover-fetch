#!/usr/bin/env node
const scf = require("../index.js")

actualArg = process.argv.slice(2)[0]

async function main(arg){
  let toGet = process.argv.slice(3);

  if(arg == "-download"){
    scf.download(toGet);
    return;
  }
  if (arg == "-getsrc"){
    let src = await scf.getSrc(toGet);
    console.log(`Image src: ${src}`);
  }
  else {
    console.error("you need to use the argument '-download' or '-getsrc'");
    return;
  }
}

main(actualArg);
