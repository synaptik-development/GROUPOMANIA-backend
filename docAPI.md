# Documentation api

## Routes

#### **USERS**  
* POST (/api/auth/register)...............**créer un profil**  
* POST (api/auth/login)...................**se connecter**  
* GET (api/auth/ users)...................**voir tous les profils**  
* GET (api/auth/users/ :id)...............**voir un profil**  
* PUT (api/auth/users/ :id)...............**modifier le profil**  
* PUT (api/auth/users/ :id/moderator).....**changer les droits d’un utilisateur**(réservé modérateur)  
* DELETE (api/auth/users/ :id)............**supprimer le profil**  

#### **MESSAGES**
* GET (/api/messages).....................**voir tous les messages**  
* GET (/api/messages/ :messageId).........**voir un message**  
* POST (/api/messages)....................**poster un message**  
* PUT (/api/messages/ :messageId).........**modifier un message**  
* DELETE (/api/messages/ :messageId)......**supprimer un message**  

#### **COMMENTS**
* GET (/api/messages/ :messageId/comments).......................**voir les commentaires**
* POST (/api/messages/ :messageId/comment).......................**poster un commentaire**
* PUT (/api/messages/ :messageId/comments/ :commentId)...........**modifier commentaire**
* DELETE (/api/messages/ :messageId/comments/ :commentId)........**supprimer commentaire**

#### **LIKES**
* POST (/api/messages/ :messageId/likes).........**liker un message / retirer son like**

#### -----------------------------------------------------------------

## CRUD

### [USERS]
#### **---Créer un profil---**
* Method : post
* URL : http://hostName/api/auth/register
* Headers : -
* Body : x-www-form-urlencoded
  * 'username'
  * 'email'
  * 'password'
  * 'confirmPassword'
* Réponse : { ‘’id’’, ‘’username’’, ‘’email’’, ‘’password’’, ‘’updatedAt’’, ‘’createdAt’’ }

#### **---Se connecter---**
* Method : post
* URL : http://hostName/api/auth/login
* Headers : -
* Body : x-www-form-urlencoded
  * 'email'
  * 'password'
* Réponse : { ‘’userId’’, ‘’token’’ }

#### **---Voir tous les profils---**
* Method : get
* URL : http://hostName/api/auth/users
* Headers : { authorization : Bearer token }
* Body : -
* Réponse : [ { ‘’id’’, ‘’username’’, ‘’email’’, ‘’admin’’, ‘’updatedAt’’, ‘’createdAt’’ }, { … }, …]

#### **---Voir un profil---**
* Method : get
* URL : http://hostName/api/auth/users/:id
* Headers : { authorization : Bearer token }
* Body : -
* Réponse : { ‘’userFound’’ : { ‘’id’’, ‘’username’’, ‘’email’’, ‘’admin’’, ‘’updatedAt’’, ‘’createdAt’’ } }

#### **---Modifier un profil---**
* Method : put
* URL : http://hostName/api/auth/users/:id
* Headers : { authorization : Bearer token }
* Body : x-www-form-urlencoded
  * 'username (optionnel)'
  * 'email (optionnel)'
  * 'password (optionnel)'
  * 'confirmPassword (requis si password)'
* Réponse : { "message": "profile updated successfully" }

#### **---Changer les droits utilisateur (admin profil requis)---**
* Method : put
* URL : http://hostName/api/auth/users/:id/moderator
* Headers : { authorization : Bearer token }
* Body : x-www-form-urlencoded
  * 'admin (boolean)'
* Réponse : { "message": "profile updated successfully" }

#### **---Supprimer un profil---**
* Method : delete
* URL : http://hostName/api/auth/users/:id
* Headers : { authorization : Bearer token }
* Body : -
* Réponse : { "message": "profile deleted successfully" }

#### -----------------------------------------------------------------

### [MESSAGES]
#### **---Voir tous les messages---**
* Method : get
* URL : http://hostName/api/messages
* Headers : { authorization : Bearer token }
* Body : -
* Réponse : [ { ‘’id’’, ‘’userId’’, ‘’username’’, ‘’content’’, ‘’imageUrl’’, ‘’likes’’, ‘’updatedAt’’, ‘’createdAt’’ }, { … }, … ]

#### **---Voir un message---**
* Method : get
* URL : http://hostName/api/messages/:messageId
* Headers : { authorization : Bearer token }
* Body : -
* Réponse : { ‘’id’’, ‘’userId’’, ‘’username’’, ‘’content’’, ‘’imageUrl’’, ‘’likes’’, ‘’updatedAt’’, ‘’createdAt’’ }

#### **---Poster un message---**
* Method : post
* URL : http://localhost:3000/api/messages
* Headers : { authorization : Bearer token }
* Body : form-data
  * 'content (optionnel si image)'
  * 'image (optionnel si content)'
* Réponse : { ‘’id’’, ‘’userId’’, ‘’username’’, ‘’content’’, ‘’imageUrl’’, ‘’likes’’, ‘’updatedAt’’, ‘’createdAt’’ }

#### **---Modifier un message---**
* Method : put
* URL : http://hostName/api/messages/:messageId
* Headers : { authorization : Bearer token }
* Body : form-data
  * 'content (optionnel si image)'
  * 'image (optionnel si content)'
* Réponse : { "message": "message updated successfully" }

#### **---Supprimer un message---**
* Method : delete
* URL : http://hostName/api/messages/:messageId
* Headers : { authorization : Bearer token }
* Body : -
* Réponse : { "message": "message deleted successfully" }

#### -----------------------------------------------------------------

### [COMMENTS]
#### **---Voir les commentaires---**
* Method : get
* URL : http://hostName/api/messages/:messageId/comments
* Headers : { authorization : Bearer token }
* Body : -
* Réponse : [ { ‘’id’’, ‘’userId’’, ‘’messageId’’, ‘’content’’, ‘’username’’ }, { … }, … ]

#### **---Poster un commentaire---**
* Method : post
* URL : http://hostName/api/messages/:messageId/comments
* Headers : { authorization : Bearer token }
* Body : x-www-form-urlencoded
  * 'content'
* Réponse : [ { ‘’id’’, ‘’userId’’, ‘’messageId’’, ‘’username’’, ‘’content’’, ‘’updatedAt’’, ‘’createdAt’’ }, { … }, … ]

#### **---Modifier un commentaire---**
* Method : put
* URL : http://hostName/api/messages/:messageId/comments/:commentId
* Headers : { authorization : Bearer token }
* Body : x-www-form-urlencoded
  * 'content'
* Réponse : { "message": "comment updated successfully" }

#### **---Supprimer un commentaire---**
* Method : delete
* URL : http://hostName/api/messages/:messageId/comments/:commentId
* Headers : { authorization : Bearer token }
* Body : -
* Réponse : { "message": "comment deleted successfully" }

#### -----------------------------------------------------------------

### [LIKES]
#### **---Liker un message---**
* Method : post
* URL : http://hostName/api/messages/:messageId/likes
* Headers : { authorization : Bearer token }
* Body :  x-www-form-urlencoded
  * 'like' : 1
* Réponse : { "message": "user liked this message" }

#### **---Retirer mention like---**
* Method : post
* URL : http://hostName/api/messages/:messageId/likes
* Headers : { authorization : Bearer token }
* Body :  x-www-form-urlencoded
  * 'like' : 0
* Réponse : { "message": "user removed mention" }

#### **---Voir si le message est liké---**
* Method : get
* URL : http://hostName/api/messages/:messageId/likes
* Headers : { authorization : Bearer token }
* Body :  -
* Réponse : { "userId", "messageId", "createdAt", "updatedAt" } ou null