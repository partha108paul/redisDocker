1.It's a sample project for Redis with Docker-compose
2.Here I have added two APIs which returns sample photo lists
    http://localhost:6000/photos    //for all potos list
              we can add query params like ?albumId=2
    http://localhost:6000/photos/1   //for photo with id=1
3.Building steps
    a)docker-compose up --build
    b)docker-compose run redis redis-cli -h redis  //here both redis are service name only in docker-compose file
    Inside redis-cli we can use commands like, KEYS *, FLUSHALL, 
