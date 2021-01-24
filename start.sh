echo 'Build for Environment' $NODE_ENV

if [[ $NODE_ENV == "staging" ]]
then
  NODE_ENV=staging node dist/main
elif [[ $NODE_ENV == "production" ]]
then
  NODE_ENV=production node dist/main
fi
