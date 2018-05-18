# Page token is argument input from terminal
PAGE_TOKEN=$1
echo Using PAGE_TOKEN=$PAGE_TOKEN

# Set white listed domains
curl -X POST -H "Content-Type: application/json" -d '{
  "whitelisted_domains":[
    "https://herokuapp.com/",
    "https://payments-memebot.herokuapp.com/",
    "https://example.com/",
    "https://www.example.com/",
    "https://glitch.me/",
    "https://messenger-bot-test1.glitch.me/"
  ]
}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=$PAGE_TOKEN"
