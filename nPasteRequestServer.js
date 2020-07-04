const http = require('http');
const fs = require('fs')
let manager = require('htpasswd-mgr')

const settings = require("./server-settings.json");


let reqData;
let reqDataProc;
let name;
let fileBody;
let puname;
let ppass;
let delFinished;
// Settup NPM for htpasswd storage. 
const serverPassword = settings.serverPassword;
// Assign Paste Name
name = Math.floor(Math.random() * 99999999999999);

http.createServer((request, response) => {
  const {
    headers,
    method,
    url
  } = request;
  let body = [];

  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {

    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    // BEGINNING OF NEW STUFF
    //console.log(body)
    response.on('error', (err) => {
      console.error(err);
    });

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    // Note: the 2 lines above could be replaced with this next one:
    // response.writeHead(200, {'Content-Type': 'application/json'})

    const responseBody = {
      headers,
      method,
      url,
      body
    };

    reqData = JSON.stringify(responseBody)
    reqDataProc = JSON.parse(reqData)
    fileBody = reqDataProc.body;

    // Server Pasdsword sent from client
    //console.log(reqDataProc.headers.passwd)
    // For Decode Use Only - This prints the user and pass sent from the shell script -
    //console.log(reqDataProc.headers.uname)
    //console.log(reqDataProc.headers.upass)

    if (serverPassword != reqDataProc.headers.passwd) {
      response.write("The request failed, please check the request data, and try again. ERR 1-22-X");
      response.end();
      return console.log("PASSWORD AUTH FAILED! Returning")



    } else { // Var Rec  reqDataProc.body

      if (reqDataProc.headers.delete) {
        const delPath = settings.pasteHTTPLocation + reqDataProc.headers.deleteid
        console.log(delPath)
        console.log(reqDataProc.headers)

        try {
          fs.unlinkSync(delPath)
          console.log("File Removed")
          delFinished = 1;
        } catch (err) {
          //console.error(err)
          response.write("\n--------------------ERROR---------------------\n");
          response.write("Paste NOT FOUND! Nothing was Deleted!");
        }
        if (delFinished === 1) {
          response.write("\n-------------------------------------------------------\n");
          response.write("Paste Deleted!");
          response.end();
          return
        } else {
          response.end();

        }

      } else {

        response.write("\n-------------------------------------------------------\n");
        response.write("Paste Saved: " + settings.pasteDomain + name);
        response.write("\n");

        response.end();

        if (reqDataProc.headers.uname && reqDataProc.headers.upass) {
          // Generating the .htpasswd file for this paste
          hTfilePath = settings.htPasswdPvtFolder + '.htpasswd-' + name;
          const fd = fs.openSync(hTfilePath, 'w', 0o644)

          console.log("This is an Auth Paste - Lets set up the user.")
          puname = reqDataProc.headers.uname;
          ppass = reqDataProc.headers.upass
          console.log(puname + ppass)

          // Allow the manager to know the file path to htpasswd
          htpasswdManager = manager(hTfilePath);

          // Add a user with username 'john' and password 'password123' via the 'crypt' algorithm
          htpasswdManager.addUser(puname, ppass, {
            algorithm: 'crypt',
            export: true
          });

          // Now we add the .htaccess entry for the paste

          var dataHtAccess = "\n#Protect single file\n<Files " + name + ">\nAuthName 'Dialog prompt'\nAuthType Basic\nAuthUserFile " + settings.htPasswdPvtFolder + ".htpasswd-" + name + "\nRequire valid-user\n</Files>";

          // append data to file
          fs.appendFile(settings.htaccessLocation, dataHtAccess, 'utf8',
            // callback function
            function (err) {
              if (err) throw err;
              // if no error
              console.log("Data is appended to file successfully.")


            });

          console.log("Recived Data from Client")
          console.log("Saving Paste ID: " + name)
          //  console.log(responseBody)
          fs.writeFile(settings.pasteHTTPLocation + name, reqDataProc.body, function (err, data) {
            if (err) {
              return console.log(err);
            }
            console.log("done");
            name = Math.floor(Math.random() * 99999999999999);

          });


        } else {
          // If no password is needed, just make the paste!
          console.log("Recived Data from Client")
          console.log("Saving Paste ID: " + name)
          //  console.log(responseBody)
          fs.writeFile(settings.pasteHTTPLocation + name, reqDataProc.body, function (err, data) {
            if (err) {
              return console.log(err);
            }
            console.log("done");
            name = Math.floor(Math.random() * 99999999999999);

          });


        }
      }
    }
    // END OF NEW STUFF
  });
}).listen(1337);
console.log("Running on port: 1337")