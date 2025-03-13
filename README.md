# MongoDB APP (test with Postman)
Connect MongoDB with Node.js using Mongoose and testing with Postman.
CRUD Operations, Authentication, Authorization, JWT, controllers, middleware, models, routes

HOW TO RUN THIS APP

## Frontend preview:
1. Clone it to your machine in code editor (VScode/PhpStorm) Terminal write:
    git clone https://github.com/redpanda-8/MongoApp.git
2. Open the main folder, in Terminal write "npm install" to get all required node modules
3. Now run "npm run dev", open up index.html with a Live Server (RMouseClick)
4. Check web:  http://127.0.0.1:999
5. For admin check: Admin login:    admin@mail.com      admin123

## Backend preview:
If no database has been created in MongoDB ->Database->Build a Database->FreeDB->Create

Start MongoDB:
    1. Check if Network Access of current IP adress is in whitelist
    2. Database Access Edit Check password (must be same) .env file MONGO_URL= (if not-change to new <new> and delete <>)
    3. Clusters Connect -> Drivers -> (2)check VScode do you have mongodb-if no in Terminal npm istall mongodb, (3) check .env MONGO_URL= is it same link -> Done

Postman:
    1. Download Postman desktop agent - open RMouseClick in Taskbar
    2. In webpage My Workplaces -> New -> HTTP -> http://127.0.0.1:999 ->Choose method
    for example: POST->Body->Raw->for example:
    {
        "name": "Pukis",
        "email": "pukis@gmail.com",
        "password": "pukis123",
        "role": "simple"
    }
    -> push Send
Checking if the data was saved in MongoDB push refresh.