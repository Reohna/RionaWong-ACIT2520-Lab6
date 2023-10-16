const path = require("path");
const { pipeline } = require("stream");

/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");
const {unzip, grayScale} = require("./IOhandler.js");


unzip(zipFilePath, pathUnzipped),
grayScale(pathUnzipped,pathProcessed)


