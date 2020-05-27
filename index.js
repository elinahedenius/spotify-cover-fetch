#!/usr/bin/env node

var https = require('https')
var fs = require('fs')

function downloadImage (img) {
  var outFile = img.name + '.jpg'
  var coverFile = fs.createWriteStream(outFile)
  console.log(`Downloading '${outFile}'...`)
  https.get(img.src, (res) => {
    res.pipe(coverFile);
  })
}

// Check if the supplied string contains a validish Spotify IDs, meaning
// that it checks for something similar to track:6PVfRMTytzNlq9P1BP3Jl0
// This will allow usage with all Spotify URLs I'm aware of - play., open.
// and spotify: - but I recommend the latter because it won't contain any
// weird characters, hopefully.

function getApiUrls (args) {

  // Exit with error message if no URLs are supplied
  if (args.length <= 0) {
    console.log('You need to supply a Spotify URL')
    return
  }

  var urls = typeof args === 'string' ? [args] : args

  apiUrls = [];

  urls.forEach((str) => {
    if (/(?:album|artist|track)s?[:/][A-Za-z0-9]{22}/.test(str)) {
        apiUrls.push(`https://open.spotify.com/oembed?url=` + str);
    } else {
      console.error(`"${str}" does not look like a valid spotify url, so I won't try anything with it.`);
    }
  })

  return apiUrls;
}

function getImgData(url){
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      var allData

      res.on('error', (err) => {
        reject(err);
      });

      res.on('data', (data) => {
        if (!allData) allData = data
        else allData += data
      })

      res.on('end', () => {
        var json = JSON.parse(allData)

        let img = {
          name: `${json.title}-${json.thumbnail_width}x${json.thumbnail_height}`,
          src: json.thumbnail_url
        }

        resolve(img);
      })
    })
  })
}

async function askForData(url){
  try {
    let img = await getImgData(url);
    return img;
  }
  catch(e){
    console.error(e);
  }
}

async function getImages(args){
  apiUrls = getApiUrls(args);

  let images = [];

  for(x in apiUrls){
    let img = await askForData(apiUrls[x]);
    images.push(img);
  }

  return images;
}

module.exports = {
  getSrc: async (args) => {
    let images = await getImages(args);

    imgSrc = [];

    images.forEach((img) => {
      imgSrc.push(img.src);
    });

    return imgSrc;
  },

  download: async (args) => {
    let images = await getImages(args);

    images.forEach(downloadImage);
  }
}
