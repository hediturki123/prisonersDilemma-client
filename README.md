# Dilemme du prisonnier - client

## Lancer le serveur
- mvn clean install
- heroku local

-> Si ça ne marche pas, faire Maven install depuis votre IDE et lancer le main de la classe RestServer.java

## Lancer le client
- npm start

# 2ème itération
## Serveur
- Nettoyage code 
- Ajout Javadoc
- Ajout d'un SseEmitter pour l'attente des 2 joueurs
- Ajout du JAR de l'autre groupe et ajout d'une classe StrategyAdaptor.java
- Ajout des tests unitaires 
- Ajout de plusieurs stratégies
- renommage des packages avec nomenclature plus explicite

## Client
- Nettoyage code
- Le jeu est fonctionnel
- Ajout choix des strategies
- Amélioration visuel 

## Difficultés
- Nous n'avons pas réussi à déployer le projet sur heroku
