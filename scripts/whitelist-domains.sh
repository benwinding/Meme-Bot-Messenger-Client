curl -X POST -H "Content-Type: application/json" -d '{
  "whitelisted_domains":[
    "https://payments-memebot.herokuapp.com"
  ]
}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=PAGE_TOKEN"