# nPaste v1.0.1 - Written by: SNXRaven 
 
A simple HTTP Server, that accepts piped data from CLI posted via CURL and saves the data to a directory to be served separately. 

This server incorporates a password within the header to provide a simple layer of security, to ensure no spam is generated. 


** New ** 

nPaste now supports password protected pastes via htpasswd and htaccess for individual pastes.  


## Example Commands
Normal Paste

```$ echo "hello, npaste" | npaste```

Username and Password Protection

```$ echo "hello, npaste" | npaste username password```

```$ npaste delete pasteid```

*pasteid example: 87830925898230
(Paste deletes no longer require pipes)

## Example Output

```
user@server:~$ echo "Hello, World." | npaste

-------------------------------------------------------
Paste Saved:  https://paste.domain.tld/80331244708605
```

## Example Password Protected Output

```
root@main:/home/admin/public_html/paste# ls | npaste user 12345

-------------------------------------------------------
Paste Saved: https://paste.domain.tld/87830925898230

Your Paste has been password protected!
Username: user
Password: 12345

Please note:
This data is given to you in plain text, this is meant for temporary paste protection. 
Please delete any sensitive data from the server once finished.

```

## Dependency Installation

```$ npm i```

## Configuration
You will need to fill out server-settings-default.json and rename the file to server-settings.json
```
{
    "serverPassword": "1234",
    "pasteHTTPLocation": "/home/user/public_html/paste/",
    "pasteDomain": "https://paste.domain.tld/",
    "htPasswdPvtFolder": "/home/user/public_html/paste/private/",
    "htaccessLocation": "/home/user/public_html/paste/.htaccess"
  }
```
*serverPassword - The header password, make this very large!

*pasteHTTPLocation - Where your pastes are saved

*pasteDomain - The URL the pastes will be hosted at (With trailing slash)

*htPasswdPvtFolder - A private folder just for holding .htpasswd files

*htaccessLocation - .htaccess file for appending new username and passwords



## Server Usage 
Run the Request Server:

```$ node nPasteRequestServer.js```                             

You can also run via pm2 to keep alive:

``` $ pm2 start nPasteRequestServer.js```


## Client Usage and Compilation 

Example CURL Command

```
$ curl -X PUT --data-binary @- -H 'passwd: 1234'  -H 'Content-Type: text/plain' http://domain.tld:8080
```
Included is an example Shell Script, this can be compiled into a binary client for redistribution without sharing the paste password:

This script in the lastest update can now password protect pastes, as well as delete a paste from an ID.


```$ shc -r -f script.sh ``` (To compile a copy that can not be distributed remove -r)

```$ mv script.sh.x npaste```

```$ chmod +x npaste```



Test with: 

```$ echo "Hello, World" | ./npaste```

If test is successful:

``` $  cp npaste /usr/bin/npaste ```

## Client Redistribution 

Copy your compiled client to your paste folder and then run on your new client server

On the new client server run:

```$ curl -O https://paste.domain.tld/npaste```

```$ chmod +x npaste```

Test with: 

```$ echo "Hello, World" | ./npaste```

If test is successful:

``` $  cp npaste /usr/bin/npaste ```
 

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)

