# Page token is argument input from terminal
PAGE_TOKEN=$1
echo Using PAGE_TOKEN=$PAGE_TOKEN

# Get user info
curl -X GET "https://graph.facebook.com/v2.6/1726694837394539?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=$PAGE_TOKEN"