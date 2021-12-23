const express = require("express")
const { exec } = require('child_process');
const fs = require("fs");
const path = require("path");
const app = express();

const genSourceFile = require("./generateSourceFile")

// get java compiler
const dir = path.join(__dirname, "executable")
const getCompiler = () => {
    return new Promise((res, rej) => {
        fs.readdir(dir, (err, data) => {
            err && rej(err)
            res(data[0])
        })
    })
}

const compileJavaCode = async (code, ext) => {
    let { fileDir, fileName } = genSourceFile(code, ext);

    let java = await getCompiler()
    let command = `cd ${path.join(__dirname, "temp")} & ${java} ${fileName}`

    // execute the command
    return new Promise((res, rej) => {
        let output = {};
        exec(command, (err, stdout, stderr) => {
            if (err) {
                output["errorMsg"] = `${err}`;
                output["filename"] = fileName;
                return rej(output)
            }
            else if (stderr) {
                output["stderr"] = `${stderr}`;
                output["filepath"] = fileDir;
                return rej(output)
            }
            else {
                output["output"] = stdout;
                output["filename"] = fileName;
                output["filepath"] = fileDir;
                res(output)
            }
        })
    })
}


const compileJavaCodeWithInput = () => {

}

module.exports = {
    compileJavaCode,
    compileJavaCodeWithInput
}