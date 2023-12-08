# Kanban Board App - Backend

## Description
```
Ce repository contient le backend de l'application Kanban Board, conçu pour gérer et stocker les données des tâches et des projets de manière efficace. Il est construit avec Node.js et le framework NestJS.
```

## Technologies
```
- Node.js
- NestJS
- Prisma 
- MySQL 
- JWT pour l'authentification
- Bcypts pour le hashage du mot de passe
```

## Fonctionnalités
```
- Créez, lisez, mettez à jour et supprimez des tâches.
- Organisez vos tâches en colonnes "À faire", "En cours" et "Terminé".
- Déplacez les tâches d'une colonne à une autre en utilisant le glisser-déposer.
- Visualisez vos tâches avec un design propre et intuitif.
- Filtrez par priorité : Classez vos tâches par priorité pour vous concentrer sur celles qui sont les plus importantes.
```
## Installation

Pour installer et exécuter le backend localement, suivez ces étapes :

1. Clonez le dépôt GitHub sur votre machine locale :

```
git clone https://github.com/tchessi-pre/veille-techno-backend.git
```

2. Accédez au répertoire de l'application :
```
cd kanban-board-api
```

3. Installez les dépendances nécessaires :
```
npm install  ou yarn install
```

4. Configurez les variables d'environnement :
```
- Copiez `.env.example` en `.env`
- Remplissez les valeurs requises dans le fichier `.env`
```
5. Démarrez le serveur en mode développement :
```
npm run start:dev ou yarn run start:dev
```
6. Démarrez l'application en mode développement :
   
Le serveur backend sera accessible à l'adresse `http://localhost:3000/`.

## Endpoints de l'API
```
La documentation complète des endpoints de l'API se trouve dans le dossier `api-documentation`. Cette documentation fournit des détails sur chaque endpoint, y compris les méthodes HTTP, les paramètres requis, et les exemples de réponses.
```

## Tests
```
Les tests de l'API ont été réalisés en utilisant l'outil `useBruno`. Mais vous pouvez utiliser d'autres outils comme `Postman` ou `Swagger` par exemple
```



## Utilisation
```
La version actuelle de l'API Kanban Board est la v1.0. Cette version inclut les fonctionnalités suivantes :

- Gestion des tâches : Création, mise à jour, suppression et récupération de tâches.
- Gestion des colonnes : Déplacement des tâches entre les colonnes "À faire", "En cours" et "Terminé".
- Authentification et autorisation des utilisateurs.

Les détails complets de l'API, y compris les routes, les méthodes HTTP, et les formats de réponse, sont disponibles dans la documentation de l'API située dans le dossier `api-documentation`.

Pour toute mise à jour ou changement dans les versions futures, les notes de version seront ajoutées à ce document ainsi qu'à la documentation officielle.
```
## Contributions

Les contributions à l'application Kanban Board API sont très appréciées. Si vous avez des idées pour améliorer l'application ou corriger des bugs, n'hésitez pas à contribuer. Voici comment procéder :

1. **Forkez le dépôt** :
Commencez par forker le dépôt en utilisant le lien suivant : 
[Fork Kanban Board API](https://github.com/votre-utilisateur/kanban-board-api/fork)

2. **Créez une Branche pour Votre Fonctionnalité** :
```
Dans votre fork, créez une nouvelle branche pour votre fonctionnalité ou correction :
`git checkout -b feature/ma-fonctionnalite`
```

. **Commitez Vos Modifications** :
```
Une fois que vous avez apporté vos modifications ou ajouté votre fonctionnalité, commitez-les avec un message descriptif :
`git commit -am 'Ajout de ma fonctionnalité`
```

3. **Pushez Votre Branche** :
```
Poussez vos modifications sur votre fork :
`git push origin feature/ma-fonctionnalite`
```

## Contact

Pour toute question ou commentaire, n'hésitez pas à me contacter à [tchessi.pre@laplateforme.io](mailto:votre@email.com).


