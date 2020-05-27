#!/bin/bash
curl -X PUT --data-binary @- -H 'passwd: 1234'  -H 'Content-Type: text/plain' http://domain.tld:8080

