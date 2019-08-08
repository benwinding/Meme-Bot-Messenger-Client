# Page token is argument input from terminal
PAGE_TOKEN=$1
echo 
echo Using PAGE_TOKEN=$PAGE_TOKEN
echo 

# Set white listed domains
curl -X POST -F whitelisted_domains='[
    "https://herokuapp.com/", 
    "https://payments-memebot.herokuapp.com/", 
    "https://example.com/", 
    "https://glitch.me/", 
    "https://memebot.lappr.com.au",
    "https://messenger-bot-test1.glitch.me/"
  ]' "https://graph.facebook.com/v4.0/me/messenger_profile?fields=whitelisted_domains&access_token=$PAGE_TOKEN"
