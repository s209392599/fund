cd ../
git pull
git add .
git status
echo;
set /p declation=push message:
git commit -m "%declation%"
git push
exit