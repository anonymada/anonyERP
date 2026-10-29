# Déploiement frontend avec Docker Swarm

Le bundle Angular est construit une seule fois. Les URL d'API et de fichiers sont injectées au démarrage du conteneur avec les variables du service Swarm.

## Variables runtime

Renseigner `FRONTEND_PUBLIC_URL` dans le fichier `.env` à côté de `compose.yaml` (sans slash final). Cette URL publique HTTPS est utilisée pour l'API, les uploads et les images. Nginx relaie `/api/` vers le backend et `/upload-file/` et `/image/` vers le service d'upload, afin que le navigateur ne fasse que des requêtes HTTPS vers le frontend.

Le conteneur produit `/assets/env.js` au démarrage. Nginx ne met pas ce fichier en cache. En développement hors Docker, `src/assets/env.js` fournit les valeurs locales par défaut.

## Construire et publier

Depuis la racine du dépôt :

```sh
docker build --pull -f frontend/Dockerfile -t 192.168.2.254:5000/frontend:1.2.3 frontend
docker build --pull -f fileupload/Dockerfile -t 192.168.2.254:5000/fileupload:1.1.1 fileupload
docker push 192.168.2.254:5000/frontend:1.2.3
docker push 192.168.2.254:5000/fileupload:1.1.1
```

## Déployer la stack

Créer d'abord les secrets TLS sur un manager Swarm. Le certificat doit correspondre au nom ou à l'adresse utilisés par les navigateurs :

```sh
docker secret create frontend_tls_cert ./cert.pem
docker secret create frontend_tls_key ./key.pem
```

Puis déployer depuis la racine du dépôt :

```sh
docker stack deploy --with-registry-auth -c frontend/swarm-stack.yml anonyerp
```

La stack publie HTTPS sur le port `8001`. Adapter l'image, les URL runtime, les secrets externes et le port publié aux valeurs de l'environnement cible avant le déploiement.
