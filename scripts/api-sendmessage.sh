# Page token is argument input from terminal
PAGE_TOKEN=$1
echo Using PAGE_TOKEN=$PAGE_TOKEN

# Test payment button
curl -X POST -H "Content-Type: application/json" -d '{
  "recipient":{
    "id":"1726694837394539"
  },
  "message":{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title": "Woww",
            "image_url":"https://i.imgur.com/xjzTjiF.gif",
            "buttons":[
              {
                "type":"web_url",
                "url":"https://messenger-bot-test1.glitch.me/webview.html",
                "title":"View More"
              }              
            ]      
          }
        ]
      }
    }
  }
}' "https://graph.facebook.com/v2.6/me/messages?access_token=$PAGE_TOKEN
