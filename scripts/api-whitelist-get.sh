# Page token is argument input from terminal
PAGE_TOKEN=$1
echo Using PAGE_TOKEN=$PAGE_TOKEN

# Set white listed domains
curl -X GET "https://graph.facebook.com/v4.0/me/messenger_profile?fields=whitelisted_domains&access_token=$PAGE_TOKEN"
