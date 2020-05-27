// npaste v1.0
// Written by: SNXRaven
// This is a simple HTTP Server, that accepts piped data from CLI posted via CURL
// curl -X PUT --data-binary @- -H 'passwd: 1234'  -H 'Content-Type: text/plain' http://domain.tld:8080
// This can be added into a shell script and compiled via SHC: shc -r -f script.sh
// This will allow redistribution via compiled binary so your paste password is not shared. 
//////////////////////////////////////////Server-Usage///////////////////////////////////////////                          
//                                 node httpRequestServer.js                                   //
//                           You can also run via pm2 to keep alive                            //
//                               pm2 start nPasteRequestServer.js                               //
/////////////////////////////////////////////////////////////////////////////////////////////////
//                                 Client Compile & Install                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////                          
//                                   $ shc -r -f script.sh                                     //
//                                   $ mv script.sh.x npaste                                   //
//                        Test with echo "Hello, World" | ./npaste                             //
//                        If test is successful:                                               //
//                        cp npaste /usr/bin/npaste                                            //
//                                                                                             //
//                        Installation Complete, Final Syntax:                                 //
//                                 echo "test" | npaste                                        //
/////////////////////////////////////////////////////////////////////////////////////////////////
//                                 To distribute:                                              //
//   Copy your compiled client to your paste folder and then run on your new client server     //
//                        curl -O https://paste.domain.tld/npaste                              //
//                        Test with echo "Hello, World" | ./npaste                             //
//                        If test is successful:                                               //
//                        cp npaste /usr/bin/npaste                                            //
/////////////////////////////////////////////////////////////////////////////////////////////////



const http = require('http');
let reqData;
let reqDataProc;
let name;
// Make this strong! I recommend a 2048 Char Pass here. This will be hard coded into the client as well.
const serverPassword = "1234";

// Your new pastes name, generated randomly
name = Math.floor(Math.random() * 99999999999999);

// Create the server
http.createServer((request, response) => {
  // Setting up the request
  const { headers, method, url } = request;
  // Get the body asset ready
  let body = [];
  // Give Error if exists, push the data chunks and when done give us the body
  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    
    // If We get a response in error, lets find out the issue
    response.on('error', (err) => {
      console.error(err);
    });
    
    // Request is ready, lets give us a response of success and reply back with JSON
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
     
    // Setting up our body
    const responseBody = { headers, method, url, body };
    
    // We have the paste name above, lets send it to the client
    response.write("\n-------------------------------------------------------\n");
    response.write("Paste Saved:  https://domain.tld/" + name);
    response.write("\n");
    // Kill the response
    response.end();
    
    // Parsing out our data from the client
    reqData = JSON.stringify(responseBody)
    reqDataProc = JSON.parse(reqData)

    // Check password sent from the client
    //console.log(reqDataProc.headers.passwd)
    if (serverPassword != reqDataProc.headers.passwd) {
      return console.log("PASSWORD AUTH FAILED! Returning")
    } else { // Var Rec  reqDataProc.body
      // The password checked out, lets log this paste and write its contents to the public_html directory
      console.log("Recived Data from Client")
      console.log("Saving Paste ID: " + name)
      fs = require('fs')
      fs.writeFile('/home/user/public_html/paste/' + name, reqDataProc.body, function (err, data) {
        if (err) {
          return console.log(err);
        }
        // This paste is finished...Lets log that.
        console.log("done");
        // Reset the name var ensuring a new name for the next paste. 
        name = Math.floor(Math.random() * 99999999999999);
      });
    }
  });
}).listen(8080);
console.log("nPaste v1.0 is running on port: 8080")