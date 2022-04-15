1.It's a sample project for Redis with Docker-compose
2.Here I have added two APIs which returns sample photo lists
    http://localhost:6000/photos    //for all potos list
              we can add query params like ?albumId=2
    http://localhost:6000/photos/1   //for photo with id=1
3.Building steps
    a)npm install after git pull
    b)docker-compose up --build
      Now we can trigger the APIs, 1st time it will fetch the data from server and store it in redis cache, next time it will return directly from cache memory
    c)docker-compose run redis redis-cli -h redis  //here both redis are service name only in docker-compose file
    Inside redis-cli we can use commands like, KEYS *, FLUSHALL, 
