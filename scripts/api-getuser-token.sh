#!/usr/bin/env bash
# Page token is argument input from terminal
USER_ACCESS_TOKEN=$1
echo "Using USER_ACCESS_TOKEN=$USER_ACCESS_TOKEN"
PAGE_ID=10155046324084882

# USE https://developers.facebook.com/tools/explorer/

curl -v -i -X GET "https://graph.facebook.com/$PAGE_ID?
  fields=access_token&
  access_token=$USER_ACCESS_TOKEN"