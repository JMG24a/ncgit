# Clon de Git: Replica de Comandos Básicos con Node.js

Este proyecto es un clon simplificado de Git, desarrollado en Node.js, que busca replicar algunos de los comandos básicos de Git para el control de versiones de archivos. La palabra clave `git` sera remplazada por `ncgit` (Node Clone Global Information Tracker).  A continuación, se detallan los comandos que hemos implementado y su funcionalidad dentro de este clon:

## Comandos Implementados

### 1. git init

El comando `git init` se utiliza para iniciar un nuevo repositorio Git. En este clon, al ejecutar `ncgit start`, se crea un directorio `.ncgit` en el directorio actual, que contendrá todos los archivos necesarios para el repositorio Git, incluyendo el almacenamiento de objetos, referencias y configuraciones.

### 2. git add

El comando `git add` se utiliza para agregar cambios al área de preparación (staging area) para ser incluidos en el próximo commit. En este clon, al ejecutar `ncgit add <archivo>`, se simula el agregado del archivo especificado al área de preparación.

### 3. git status

El comando `git status` se utiliza para mostrar el estado actual del repositorio, incluyendo los archivos modificados, agregados y sin seguimiento. En este clon, al ejecutar `ncgit status`, se muestra una lista simulada de archivos en el directorio de trabajo y su estado en relación con el repositorio.

### 4. git commit

El comando `git commit` se utiliza para confirmar los cambios en el repositorio con un mensaje descriptivo. En este clon, al ejecutar `ncgit commit"`, se simula la creación de un nuevo commit con el mensaje proporcionado.

### 5. git log

El comando `git log` se utiliza para mostrar el historial de commits en el repositorio, incluyendo información sobre el autor, la fecha y el mensaje del commit. En este clon, al ejecutar `ncgit log`, se muestra una lista simulada de commits con información similar a la de Git.

### 6. `git checkout`

El comando `git checkout` se utiliza para cambiar entre ramas o restaurar archivos desde el repositorio. Aunque aún no se ha implementado en este clon, se planea agregarlo en futuras actualizaciones para permitir la navegación entre ramas y la restauración de archivos.

### 7. `git branch`

El comando `git branch` se utiliza para listar, crear o eliminar ramas en el repositorio. Aunque aún no se ha implementado en este clon, se planea agregarlo en futuras actualizaciones para permitir la gestión de ramas en el repositorio.

## Uso

Para utilizar este clon de Git desarrollado en Node.js, simplemente clona o descarga el repositorio y ejecuta los comandos mencionados anteriormente en tu terminal. Aunque este clon no proporciona todas las funcionalidades y características de Git, es útil para comprender los conceptos básicos de control de versiones y cómo funcionan los comandos principales de Git.

¡Disfruta explorando y aprendiendo sobre control de versiones con este clon de Git desarrollado en Node.js!
