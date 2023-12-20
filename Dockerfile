# Utiliza una imagen base de Node.js
FROM node:latest

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia el archivo 'package.json' y 'package-lock.json' (si está disponible)
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Si estás construyendo tu código para producción, ejecuta `npm ci --only=production`
#RUN npm run build
# Copia los archivos fuente
COPY . .

# Expone el puerto que tu aplicación utilizará
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start"]
