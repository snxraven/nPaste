#!/bin/bash
#curl  -H 'passwd: 1234'  -H 'Content-Type: text/plain' http://192.168.0.12:8080 -d@-

username=$1
password=$2

if [ $username == "delete" ]
then
curl -X PUT --data-binary @- -H 'delete: yes' -H "deleteID: $2" -H 'passwd: 1234'  -H 'Content-Type: text/plain' http://domain.tld:1337
echo ""
echo "deleteID: $2"
exit
fi


if [ $1 ]
then
curl -X PUT --data-binary @- -H "uname: $username" -H "upass: $2" -H 'passwd: 1234'  -H 'Content-Type: text/plain' http://domain.tld:1337
   echo ""
   echo "Your Paste has been password protected!"
   echo "Username: $1"
   echo "Password: $2"
   echo ""
   echo "Please note:"
   echo "This data is given to you in plain text, this is meant for temporary paste protection. 
Please delete any sensitive data from the server once finished."
else
curl -X PUT --data-binary @- -H 'passwd: 1234'  -H 'Content-Type: text/plain' http://domain.tld:1337

  echo ""
  echo "Pro tip: you can password protect your paste just by typing a username and password after your paste command."
fi



