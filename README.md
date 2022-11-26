# NodeJS_Express_Mongo_Angular13 DOCKER-COMPOSE
Realized by Sergi Biosca Beneyto

     PROYECTO PAGINA WEB BIOSPOP DOCKERIZADO PARA EL MODULO DE DESPLEGAMIENTO.

## Setup

### DOCKER-COMPOSE:
      
      docker-compose up --build

### CONTENEDOR SERVICIO-MONGODB:
      Creación del servicio con la reciente imagen de mongo, asociando al nombre mongo_container,
      realizamos que reinicie siempre al haber algún error, asociando a los puertos 27018:27017,
      poniendo las variables de entorno en un fichero .env, creación de diferentes volumenes con
      los scripts correspondientes y la copia de la base de datos para crearla una vez arrancado
      el contenedor y por último asociando a la network correspondiente de todo los contenedores:

      mongodb:
            image: mongo:latest
            container_name: mongo_container
            restart: always
            ports:
                  - 27018:27017
            env_file:
                  - data.env
            volumes:
                  - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
                  - ./mongo/mongorestore.sh:/docker-entrypoint-initdb.d/mongorestore.sh
                  - ./backend/rest/bd:/db-dump
            networks:
                  - network_project