# 🚀 Guide de Démarrage Rapide

## Installation en 5 minutes

### 1️⃣ Installation des dépendances

```bash
npm install
```

### 2️⃣ Configuration MongoDB Atlas

1. Aller sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un compte gratuit
3. Créer un nouveau cluster (M0 Free)
4. Cliquer sur "Connect" → "Connect your application"
5. Copier la chaîne de connexion

### 3️⃣ Configuration .env.local

Créer le fichier `.env.local` à la racine :

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/streaming?retryWrites=true&w=majority
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generer_avec_openssl_rand_base64_32
JWT_SECRET=generer_avec_openssl_rand_base64_32
ADMIN_EMAIL=admin@streaming.com
ADMIN_PASSWORD=Admin123!
NODE_ENV=development
```

**💡 Générer des secrets sécurisés :**

```bash
# Sur Mac/Linux
openssl rand -base64 32

# Sur Windows PowerShell
[Convert]::ToBase64String((1..32|%{Get-Random -Max 256}))
```

### 4️⃣ Créer le premier admin

```bash
node scripts/init-admin.js
```

Notez les identifiants affichés dans le terminal.

### 5️⃣ Lancer l'application

```bash
npm run dev
```

Ouvrir : http://localhost:3000

---

## 🎬 Premier film à ajouter

1. Aller sur http://localhost:3000/admin/login
2. Se connecter avec les identifiants admin
3. Remplir le formulaire avec ces données de test :

**Exemple Spider-Man :**
- **Titre** : Spider-Man: No Way Home
- **Genre** : Action
- **Année** : 2021
- **Description** : Peter Parker voit son identité de Spider-Man révélée au grand jour...
- **Affiche** : https://m80.uqload.bz/i/09/00975/48nlkbwky85e_t.jpg
- **Lien UQload** : https://uqload.bz/48nlkbwky85e.html
- **Durée** : 02:28:00

4. Cliquer sur "Ajouter le film"
5. Retourner à l'accueil pour voir le film

---

## 📝 Checklist avant déploiement

- [ ] `.env.local` configuré
- [ ] MongoDB Atlas configuré
- [ ] Admin créé
- [ ] Test local réussi (`npm run dev`)
- [ ] Test de build réussi (`npm run build`)
- [ ] Au moins un film ajouté pour tester

---

## 🔥 Déploiement Vercel en 3 étapes

### 1. Push sur GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

### 2. Connecter à Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. "Import Project" → Sélectionner votre repo
3. Configurer les variables d'environnement (copier depuis `.env.local`)
4. Déployer

### 3. Créer l'admin en production

Via MongoDB Compass ou Atlas :
1. Connecter à votre cluster
2. Aller dans la collection `admins`
3. Exécuter le script `init-admin.js` avec l'URL de production

Ou via l'API :
```bash
# Créer un endpoint temporaire pour init ou utiliser MongoDB Atlas directement
```

---

## 🎉 C'est terminé !

Votre site est maintenant en ligne :
- **Site** : https://votre-app.vercel.app
- **Admin** : https://votre-app.vercel.app/admin/login

---

## ⚡ Commandes utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint

# Créer un admin
node scripts/init-admin.js
```

---

## 🐛 Problèmes courants

### "Cannot connect to MongoDB"
→ Vérifier `MONGODB_URI` et autoriser toutes les IPs (`0.0.0.0/0`) dans MongoDB Atlas

### "Invalid JWT secret"
→ Régénérer `NEXTAUTH_SECRET` avec `openssl rand -base64 32`

### Le lecteur vidéo ne charge pas
→ Désactiver les bloqueurs de pub et vérifier le format du lien UQload

### Erreur 500 sur Vercel
→ Vérifier les variables d'environnement dans les settings Vercel

---

## 📚 Prochaines étapes

1. ✅ Ajouter plus de films
2. ✅ Personnaliser le design
3. ✅ Configurer un nom de domaine personnalisé
4. ✅ Activer l'authentification utilisateur (optionnel)
5. ✅ Mettre en place des backups MongoDB

---

**Besoin d'aide ?** Consultez le README.md complet !