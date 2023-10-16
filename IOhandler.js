/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const { dirname } = require("path");
const { pipeline } = require("stream");

const unzipper = require("unzipper"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");
const AdmZip = require('adm-zip');

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {

  return new Promise((resolve, reject) => {
    const zip = new AdmZip(pathIn);
    try {
      zip.extractAllTo(pathOut, /*overwrite*/ true);
      console.log('Extraction completed successfully!');
      resolve();
    } catch (error) {
      console.error('Extraction error:', error);
      reject(error);
    }
  });
}


/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */

const readDir = (dir) => {
  return new Promise((resolve, reject)=>{
    listOfPaths = []
    fs.readdir(dir,(err, file)=>{
      console.log("reading data from path")
      if (err)
        reject(err)
      else{
        for(x in file){
          listOfPaths.push(path.join(dir,file[x].toString()))
        }
        const filteredFiles = listOfPaths.filter(file => file.endsWith('.png'));
        resolve(filteredFiles)
        console.log(filteredFiles)
      }
    })
  })

};

  
/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
//  * @param {string} filePath
//  * @param {string} pathProcessed
//  * @return {promise}
//  */

const processImage = (file,pathOut) =>{
        const fileName = path.basename(file);
        const outputPath = path.join(pathOut, `${fileName}_grayscale.png`);
        return new Promise((resolve, reject) => {
        const inputStream = fs.createReadStream(file);
        const png = new PNG();

        inputStream
            .pipe(png)
            .on('parsed', function() {
                for (let y = 0; y < this.height; y++) {
                    for (let x = 0; x < this.width; x++) {
                        const idx = (this.width * y + x) << 2;
                        const avg = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
                        this.data[idx] = avg;
                        this.data[idx + 1] = avg;
                        this.data[idx + 2] = avg;
                    }
                }

                const outputStream = fs.createWriteStream(outputPath);
                this.pack().pipe(outputStream);

                outputStream.on('finish', () => {
                    console.log(`Image converted to grayscale and saved at ${outputPath}`);
                    resolve();
                });
            })
            .on('error', error => {
                console.error(`Error processing ${file}:`, error);
                reject(error);
            });
            
    });
}


const grayScale = (pathIn, pathOut) => {
  if (!fs.existsSync(pathOut)) {
    fs.mkdirSync(pathOut, { recursive: true });
}
  readDir(pathIn)
    .then(array => {
      for (file in array){
        processImage(array[file],pathOut)
  } 
    })
    .catch(error => {
        console.error('Error :', error);
    });

}

module.exports = {
  unzip,
  readDir,
  grayScale,
};

readDir("/Users/riona/Documents/ACIT2520 Web Development/week6/Lab6")