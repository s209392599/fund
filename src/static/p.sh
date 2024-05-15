#!/bin/bash
cd ../
git add .
git status
read -p  "please input commit comments:" msg;
git commit -m "$msg";
git push
exit 1;