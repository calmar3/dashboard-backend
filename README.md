

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


Collegarsi tramite browser su localhost al numero di porta scritto all'avvio dal server per poter accedere alla dashboard