

Installare npm e nodejs

Configurare gli host di zookeeper e del local controller nel file controller/utils/host.js



Generare il file controller/utils/config.js con le credenziali del proprio CloudantDB nella seguente maniera

var properties = {
    "username": "",
    "password": "",
    "host": "",
    "port": ,
    "url": ""
};
module.exports = properties;



Per avviare l'applicazione eseguire nella directory contenente il file app.js, i comandi :

- npm install 

- node app.js


Generare la versione "dist" dell'applicazione dashboard (https://github.com/calmar3/dashboard)
e copiarne il contenuto in una directory chiamata "public" nella directory dell'applicazione dashboard-backend

Collegarsi tramite browser all'indirizzo stampato all'avvio del server per visualizzare la dashboard 