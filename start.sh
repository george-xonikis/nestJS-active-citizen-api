echo 'Build for Environment' $NODE_ENV

if [[ $NODE_ENV == "staging" ]]
then
  node dist/main
elif [[ $NODE_ENV == "production" ]]
then
  node dist/main
fi
