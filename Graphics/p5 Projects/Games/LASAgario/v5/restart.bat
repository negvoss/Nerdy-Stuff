git add .
git commit -am %1
git push heroku master
timeout 5
heroku ps
heroku open
