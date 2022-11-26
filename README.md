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

### CONTENEDOR SERVICIO-BACKEND:
      Creación del servicio backend con el nombre backend_container, reiniciando siempre el contenedor,
      asociando a los puertos 3000:3000, creando la imagen a través del correspondiente dockerfile,
      siempre y cuando el servicio anterior de mongo este correctamente iniciado, una vez iniciado ejecute
      el comando npm run dev para iniciar el servicio backend y por último asociando a la network 
      correspondiente de todo los contenedores

      backend:
            container_name: backend_container
            restart: always
            ports:
                  - 3000:3000
            build: ./backend
            depends_on:
                  - mongodb
            command: "npm run dev"
            networks:
                  - network_project

      -----------------------------
      DOCKERFILE MULTI-STAGE BUILD:

      FROM node:19-alpine as dependencies
      WORKDIR /rest
      COPY ./package.json ./package.json
      RUN ["npm", "install"]

      FROM node:19-alpine
      WORKDIR /rest
      RUN apk update && apk add bash
      COPY ./package.json ./package.json
      COPY ./rest ./rest
      COPY ./index.js ./index.js
      COPY --from=dependencies /rest/node_modules ./node_modules
      EXPOSE 3000

### CONTENEDOR SERVICIO-FRONTEND:
      Creación del servicio frontend con el nombre frontend_container, reiniciando siempre el contenedor,
      asociando a los puertos 4200:4200, creando la imagen a través del correspondiente dockerfile,
      siempre y cuando el servicio anterior de backend este correctamente iniciado y por último asociando 
      a la network correspondiente de todo los contenedores

      frontend:
            container_name: frontend_container
            restart: always
            ports:
                  - 4200:4200
            build: ./frontend
            depends_on:
                  - backend
            networks:
                  - network_project

      -----------------------------
      DOCKERFILE MULTI-STAGE BUILD:
      
      FROM node:19-alpine as dependencies
      WORKDIR /app
      COPY ./package.json .
      RUN ["npm", "install", "--force"]

      FROM node:19-alpine
      WORKDIR /app
      COPY --from=dependencies /app/node_modules ./node_modules
      COPY . .
      EXPOSE 4200 49153
      CMD ["npm", "start"]

### CONTENEDOR SERVICIO-MONGOEXPRESS:
      Creación del servicio con la reciente imagen de mongo-express, asociando al nombre 
      adminMongo_container, realizamos que reinicie siempre al haber algún error, asociando a los puertos 
      8081:8081, poniendo las variables de entorno en un fichero .env, siempre y cuando el servicio anterior 
      de mongodb este correctamente iniciado y por último asociando a la network correspondiente de todo 
      los contenedores:

      mongo-express:
            image: mongo-express:latest
            restart: always
            container_name: adminMongo_container
            ports:
                  - 8081:8081
            env_file:
                  - data.env
            depends_on:
                  - "mongodb"
            networks:
                  - network_project

### CONTENEDOR SERVICIO-LOADBALANCER:
      Creación del servicio con la reciente imagen de nginx, asociando al nombre loadbalancer_container,
      realizamos que reinicie siempre al haber algún error, asociando a los puertos 80:80,
      creación del volumen de la carpeta loadbalancer donde se encuentra el fichero nginx.conf asociando 
      al /etc/nginx/nginx.conf, luego ejecutando el comando correspondiente para el nginx loadbalancer
      y por último asociando a la network correspondiente de todo los contenedores:

      loadbalancer:
            container_name: loadbalancer_container
            image: nginx:latest
            restart: always
            ports:
                  - 80:80
            volumes:
                  - ./loadbalancer/nginx.conf:/etc/nginx/nginx.conf
            command: ["nginx", "-g", "daemon off;"]
            networks:
                  - network_project

### CONTENEDOR SERVICIO-PROMETHEUS:
      Creación del servicio con la imagen de prometheus:v2.20.1, asociando al nombre prometheus_container,
      realizamos que reinicie siempre al haber algún error, asociando a los puertos 9090:9090,
      creación del volumen de la carpeta prometheus donde se encuentran ficheros correspondientes a la 
      configuración de prometheus asociando, luego ejecutando el comando correspondiente para el file prometheus.yml
      y por último asociando a la network correspondiente de todo los contenedores:

      prometheus:
            container_name: prometheus_containers
            image: prom/prometheus:v2.20.1
            restart: always
            ports:
                  - 9090:9090
            volumes:
                  - ./prometheus/:/etc/prometheus
            command:  
                  - --config.file=/etc/prometheus/prometheus.yml
            networks:
                  - network_project

### CONTENEDOR SERVICIO-GRAFANA:
      Creación del servicio con la imagen de grafana:7.1.5, asociando al nombre grafana_container,
      realizamos que reinicie siempre al haber algún error, asociando a los puertos 3500:3000,
      creación del volumen del volumen creado en el docker-compose myGrafanaVol asociandolo a var/lib/grafana 
      y la carpeta de prometheus asociando los ficheros correspondientes entre grafana y prometheus, también
      poniendo las variables de entorno en un fichero .env y cuando el servicio anterior de prometheus este 
      correctamente iniciado y por último asociando a la network correspondiente de todo los contenedores:

      grafana:
            container_name: grafana_container
            image: grafana/grafana:7.1.5
            restart: always
            ports:
                  - 3500:3000
            volumes:
                  - myGrafanaVol:/var/lib/grafana
                  - ./prometheus/datasources.yml:/etc/grafana/provisioning/datasources/datasources.yml
            env_file:
                  - data.env
            depends_on:
                  - prometheus
            networks:
                  - network_project

### CREACIÓN VOLUMEN Y NETWORK EN DOCKER-COMPOSE:

      networks:
            network_project:
      volumes:
            myGrafanaVol:

## CONTENEDORES ARRANCADOS ACCEDER PUERTOS:

### BACKEND:
      http://localhost:3000/api/product

### FRONTEND:
      http://localhost:4200

### MONGO-EXPRESS:
      http://localhost:8081

### LOADBALANCER:
      http://localhost:80/api/product --> BACKEND
      http://localhost:80 --> FRONTEND

### PROMETHEUS:
      http://localhost:9090

### GRAFANA:
      http://localhost:3500