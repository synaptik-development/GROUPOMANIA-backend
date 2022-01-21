# GROUPOMANIA – social network
## backend de l'application

## Utilisation de l’application en local

### Prérequis d’installation
Node : https://dev.mysql.com/downloads/installer/
####
MySql : https://nodejs.org/fr/download/
####
Frontend de l'application: https://github.com/synaptik-development/GROUPOMANIA-frontend.git

#### **Dépendances**
* nodeJS
* npm
* async
* bcrypt
* body-parser
* crypto-js
* dotenv
* express
* express-rate-limit
* helmet
* jsonwebtoken
* multer
* mysql2
* sequelize 

**Etapes :**
1. Ouvrez le terminal intégré au dossier backend et taper la commande **npx sequelize-cli init** puis renseignez un nom de base de données et vos identifiants mysql (nom d'utilisateur et mot de passe) dans le fichier config.js
    **nb: pour créer un utilisateur dont l'accés est strictement limité à cette base de données (conseillé) :**
        1. ouvrez votre terminal mysql
        2. tapez **CREATE USER 'user name'@'localhost' IDENTIFIED BY 'mot_de_passe';**
        3. puis **GRANT ALL PRIVILEGES ON database_name. TO 'username'@'localhost';**
2. Copiez/collez le contenu du fichier .env.example dans un nouveau fichier .env à la racine du backend et remplacez les valeurs par défaut (vos identifiants mysql, votre mot de passe, un token personnalisé. **Attention** : la database doit avoir le même nom que celui précédemment renseigné dans le fichier de configuration)
3. créez un dossier "images" à la racine du projet
4. Dans le terminal intégré au backend entrez **sequelize db:create** suivi de **sequelize db:migrate**
5. Optionnel : pour créer un compte modérateur pour l’application, commencez par créer un compte via l’interface utilisateur ou via postman (sinon votre email ne sera ni crypté ni reconnu par l’algorithme de l’application) puis connectez vous à la base de données via la commande en ligne et entrez **UPDATE 'users' SET 'admin' = 1 WHERE 'username' = 'votreUsername';**
6. Dans le terminal intégré au backend, entrez **node server**
7. Vous pouvez maintenant effectuer des tests sur postman ou utiliser l'interface utilisateur en téléchargeant le frontend de l'application