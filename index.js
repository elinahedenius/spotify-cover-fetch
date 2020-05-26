#!/usr/bin/env node

var https = require('https')
var fs = require('fs')

function getImageData (json) {
  let image = {
    name: `${json.title}-${json.thumbnail_width}x${json.thumbnail_height}`,
    url: json.thumbnail_url
  }

  return image;
}

function downloadImage (imageUrl, imageName) {
  var outFile = imageName + '.jpg'
  var coverFile = fs.createWriteStream(outFile)
  console.log(`Downloading '${outFile}'...`)
  https.get(imageUrl, (res) => {
    res.pipe(coverFile)
    console.log("Done!");
  })
}

function getJson (res) {
  var allData

  res.on('data', (data) => {
    if (!allData) allData = data
    else allData += data
  })

  res.on('end', () => {
    var json = JSON.parse(allData)
    var image = getImageData(json)
    downloadImage(image.url, image.name)
  })
}

// Check if the supplied string contains a validish Spotify IDs, meaning
// that it checks for something similar to track:6PVfRMTytzNlq9P1BP3Jl0
// This will allow usage with all Spotify URLs I'm aware of - play., open.
// and spotify: - but I recommend the latter because it won't contain any
// weird characters, hopefully.

function getApiUrl (str) {
  if (/(?:album|artist|track)s?[:/][A-Za-z0-9]{22}/.test(str)) {
      return `https://open.spotify.com/oembed?url=` + str;
  } else {
    console.error(str + " does not look like a valid spotify url, so won't be downloaded.");
    return false;
  }
}

function startFetching (urls) {
  apiUrls = [];

  urls.forEach((url) => {
    if(getApiUrl(url)){
      apiUrls.push(getApiUrl(url));
    }
  })

  for(x in apiUrls){
    // Commence callback hell
    https.get(apiUrls[x], getJson);
  }
}

module.exports = (args) => {
  // Exit with error message if no URLs are supplied
  if (args.length <= 0) {
    console.log('You need to supply a Spotify URL')
    return
  }

  var urls = typeof args === 'string' ? [args] : args
  startFetching(urls);
}
