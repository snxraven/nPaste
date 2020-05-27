# nPaste v1.0 - Written by: SNXRaven 
 
A simple HTTP Server, that accepts piped data from CLI posted via CURL and saves the data to a directory to be served separately. 

This server incorporates a password within the header to provide a simple layer of security. 


## Server Usage 
Run the Request Server:

```node nPasteRequestServer.js```                             

You can also run via pm2 to keep alive:

```pm2 start nPasteRequestServer.js```


## Client Usage and Compilation 

Example CURL Command

```
curl -X PUT --data-binary @- -H 'passwd: 1234'  -H 'Content-Type: text/plain' http://domain.tld:8080
```
Included is an example Shell Script, this can be compiled into a binary client for redistribution without sharing the paste password:




```$ shc -r -f script.sh ``` (To compile a copy that can not be distributed remove -r)

```$ mv script.sh.x npaste```



Test with: 

```echo "Hello, World" | ./npaste```

If test is successful:

``` $  cp npaste /usr/bin/npaste ```

## Client Redistribution 

Copy your compiled client to your paste folder and then run on your new client server

On the new client server run:

```curl -O https://paste.domain.tld/npaste```

Test with: 

```echo "Hello, World" | ./npaste```

If test is successful:

``` $  cp npaste /usr/bin/npaste ```
 

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
