# MongoDB APP (test with Postman)
Connect MongoDB with Node.js using Mongoose and testing with Postman.
CRUD Operations, Authentication, Authorization, JWT, controllers, middleware, models, routes

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
2. Clusters Connect -> Drivers ->
    1. (2)check code editor (VScode) do you have mongodb - if no in Terminal write "npm install mongodb"
    2. (3) check .env MONGO_URL= IS IT same link
3. Database Access Edit Check password (must be same) in .env file MONGO_URL= (if not-change to new <new> and delete <>)

Postman:
1. Download Postman desktop agent - open RMouseClick in Taskbar
2. In webpage My Workplaces -> New -> HTTP -> http://127.0.0.1:999 -> Choose method
for example:

    1. POST->Body->Raw->for example:
    {
        "name": "Pukis",
        "email": "pukis@gmail.com",
        "password": "pukis123",
        "role": "simple"
    }
    2. -> push Send
3. Checking if the data was saved in MongoDB push refresh.

Make sure PORTS in all files are the same:
1. .vscode folder > settings.json
2. src folder > app.js
3. public > js folder files
4. .env
5. server.js 

--------------------------------------------------------------------------------------------------------------------------

### Užduotis SKELBIMAI:
Sukurti skelbimų WEB programą (angl. application), kurią pasitelkę vartotojai galėtų skelbti ir rasti informaciją apie parduodamas prekes bei paslaugas, pasižymėti.

### Programą (angl. application) sudaro dvi dalys:
1. Administracinė sritis.
2. Vieša sritis.

### Administracinės srities aprašas ir jos privalomos funkcijos:

1. Administracinės srities funkcijos prieinamos tik autentifikuotam vartotojui.
2. Jeigu vartotojas nėra autentifikuotas, pradiniame puslapyje rodoma prisijungimo forma.
3. Autentifikuotas vartotojas (Administratorius) gali blokuoti netinkamą turinį ir vartotojus, įvesti skelbimų kategorijas.
Autentifikuotas vartotojas (Vartotojas) gali pridėti skelbimą, nurodydamas pavadinimą, kategoriją, aprašą, kainą, nuotrauką, koreguoti tik savo skelbimų duomenis, juos ištrinti, sudominusius skelbimus išsaugoti patikusiųjų sąraše.
4. Administracinės srities vartotojo sąsajai gali būti naudojami Boostrap šablonai.

### Viešosios srities aprašas ir jos privalomos funkcijos:
1. Vieša sritis turi būti realizuota naudojant HTML5, CSS ir (arba) Bootstrap, JavaScript.
2. Skelbimų paieška vykdoma naudojant filtrą pagal kategorijas ir paieškos žodį.
3. Skelbimas gali būti pridedamas į patikusiųjų sąrašą, paspaudus širdutę. Po paspaudimo pasižymėjimas išsaugomas duomenų bazėje.

### Užduoties etapai:
1. Sukurti naują projektą
2. Sukurti duomenų bazę
3. Sukurti administratoriaus vartotojo sąsają.
4. Sukurti naujo skelbimo įvedimo puslapį ir realizuoti skelbimo duomenų išsaugojimą duomenų bazėje. Formos duomenys turi būti validuojami, kad duomenų bazėje būtų korektiška informacija.
5. Sukurti skelbimų valdymo puslapį, kuriame būtų galima pašalinti skelbimus ir keisti jų duomenis.
6. Sukurti vartotojo registracijos puslapį, kuriame vartotojas registruojasi, o jo duomenys išsaugomi duomenų bazėje. Pastaba: vartotojo slaptažodis negali būti saugomas duomenų bazėje atviru tekstu (plain text).
7. Sukurti vartotojo prisijungimo puslapį. Prisijungęs vartotojas autentifikuojamas ir autorizuojamas administracinėje sistemoje.
8. Suprojektuoti ir realizuoti viešos srities vartotojo sąsają. Privalomas suderinamumas su išmaniaisiais įrenginiais.
9. Įkelti užduoties kodą į sukurtą GITHUB saugyklą (angl. repository). Turi būti sukurtas README.MD failas, kuriame surašyta instrukcija, kaip reikia paleisti programą (angl. application), pateikti prisijungti prie administracinės ir kliento dalių reikalingi duomenys.