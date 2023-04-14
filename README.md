# microservice-tweet
a super small tiny piece of ****

WHAT UPDATE FROM V1
  - get all tweet/retweet
  - add createAt, updatedAt field in each tweet/retweet
  - fix redundant path from local:80/tweet/tweet -> local:80/tweet/ (**check this in postman**)
  - get profile by id
  - get tweet/retweet by id
  - add like and comment fields in each tweet/retweet
  - add photo, video fields in each tweet/retweet
  - get all user id
  - new postman collection json (**import new one**)

run `docker-compose up --build`.  
You can use postman collection from `Microservice Tweet.postman_collection.json`

MAIN PORT IS localhost:80

It's consist of 3 services User, Tweet, Retweet talk to each other by RabbitMQ
![alt text](https://github.com/patkamon/microservice-tweet/blob/main/diagram.png)


