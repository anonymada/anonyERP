#!/bin/bash

# Renseignez le chemin d'accès local et le nom du répertoire
local_path="."
directory_name="www"

# Renseignez le nom d'utilisateur et l'adresse IP du serveur distant
remote_user="mndptserver"
remote_host="192.168.1.254"

# Renseignez le chemin du répertoire sur le serveur distant
remote_path="/var/www/app"

# Copier le répertoire vers le serveur distant
cd "${local_path}/${directory_name}"
scp -r . "${remote_user}@${remote_host}:${remote_path}"