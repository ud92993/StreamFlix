# 🎬 StreamFlix - Plateforme de Streaming

Plateforme de streaming moderne et sécurisée avec interface admin, intégration UQload et design Netflix-like.

## ✨ Fonctionnalités

### 👥 Côté Utilisateur
- ✅ Design inspiré Netflix (thème sombre, cartes de films)
- ✅ Carrousels horizontaux par genre
- ✅ Barre de recherche en temps réel
- ✅ Filtrage par genre
- ✅ Page film avec lecteur vidéo intégré (UQload)
- ✅ Responsive (mobile, tablette, desktop)
- ✅ Animations fluides

### 🔐 Côté Admin
- ✅ Authentification sécurisée (NextAuth)
- ✅ Dashboard avec statistiques
- ✅ Formulaire d'ajout de film
- ✅ Gestion des films (voir, supprimer)
- ✅ Protection contre les attaques (rate limiting, hash bcrypt)
- ✅ Sessions sécurisées JWT

## 🛠️ Stack Technique

- **Framework**: Next.js 14 (App Router)
- **Base de données**: MongoDB (Mongoose)
- **Authentification**: NextAuth.js
- **Styling**: Tailwind CSS
- **Déploiement**: Vercel
- **Sécurité**: bcrypt, JWT, rate limiting

## 📦 Installation

### 1. Cloner et installer

```bash
git clone <votre-repo>
cd streaming-platform
npm install
```

### 2. Configuration MongoDB

1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster gratuit
3. Créer une base de données `streaming`
4. Récupérer la chaîne de connexion

### 3. Variables d'environnement

Créer un fichier `.env.local` à la racine :

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/streaming?retryWrites=true&w=majority

# NextAuth (générer avec: openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre_secret_genere_avec_openssl

# JWT Secret
JWT_SECRET=votre_jwt_secret

# Admin par défaut
ADMIN_EMAIL=admin@streaming.com
ADMIN_PASSWORD=VotreMotDePasseSecurise123!

# Environment
NODE_ENV=development
```

### 4. Initialiser le premier admin

```bash
node scripts/init-admin.js
```

Vous recevrez les identifiants de connexion dans le terminal.

### 5. Lancer en développement

```bash
npm run dev
```

Accéder à : http://localhost:3000

## 🚀 Déploiement sur Vercel

### 1. Préparer le projet

```bash
# Vérifier que tout fonctionne
npm run build
npm run start
```

### 2. Déployer sur Vercel

#### Option A : Via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

#### Option B : Via l'interface Vercel

1. Push votre code sur GitHub
2. Aller sur [vercel.com](https://vercel.com)
3. Cliquer "Import Project"
4. Sélectionner votre repo GitHub
5. Configurer les variables d'environnement

### 3. Configurer les variables d'environnement sur Vercel

Dans les paramètres du projet Vercel, ajouter :

```
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=https://votre-domaine.vercel.app
NEXTAUTH_SECRET=votre_secret
JWT_SECRET=votre_jwt_secret
ADMIN_EMAIL=admin@streaming.com
ADMIN_PASSWORD=VotreMotDePasseSecurise123!
NODE_ENV=production
```

### 4. Redéployer

Après avoir ajouté les variables, redéployer :

```bash
vercel --prod
```

## 📖 Utilisation

### Ajouter un film

1. Se connecter à `/admin/login`
2. Aller dans le dashboard
3. Remplir le formulaire :
   - **Titre** : Nom du film
   - **Genre** : Sélectionner dans la liste
   - **Année** : Année de sortie
   - **Description** : Synopsis
   - **URL affiche** : Lien vers l'image (ex: depuis UQload)
   - **Lien UQload** : Format `https://uqload.bz/XXXXX.html`
   - **Durée** : Format `HH:MM:SS` (optionnel)

### Format du lien UQload

Le système accepte les formats suivants :
- `https://uqload.bz/48nlkbwky85e.html`
- `https://uqload.com/embed-48nlkbwky85e.html`

L'ID sera automatiquement extrait et le lecteur intégré.

## 🔒 Sécurité

### Mesures implémentées

- ✅ **Hash des mots de passe** : bcrypt avec 12 rounds
- ✅ **Sessions JWT** : Tokens sécurisés
- ✅ **Protection des routes** : Middleware NextAuth
- ✅ **Rate limiting** : Protection contre brute force
- ✅ **Verrouillage de compte** : Après 5 tentatives échouées (2h)
- ✅ **Validation des données** : Mongoose schemas
- ✅ **Variables d'environnement** : Secrets non exposés
- ✅ **Protection CSRF** : NextAuth intégré
- ✅ **Headers sécurisés** : Configuration Next.js

### Bonnes pratiques

1. **Changer le mot de passe admin** après le premier déploiement
2. **Utiliser des secrets forts** pour JWT et NextAuth
3. **Activer HTTPS** en production (automatique sur Vercel)
4. **Mettre à jour régulièrement** les dépendances
5. **Sauvegarder la base de données** régulièrement

## 📁 Structure du projet

```
streaming-platform/
├── src/
│   ├── app/
│   │   ├── api/              # Routes API
│   │   │   ├── auth/         # NextAuth
│   │   │   ├── movies/       # CRUD films
│   │   │   └── admin/        # Routes protégées
│   │   ├── admin/            # Pages admin
│   │   ├── movie/[id]/       # Page film
│   │   ├── layout.jsx        # Layout racine
│   │   ├── page.jsx          # Page d'accueil
│   │   └── globals.css       # Styles globaux
│   ├── components/           # Composants React
│   ├── lib/                  # Utilitaires
│   │   ├── mongodb.js        # Connexion DB
│   │   └── auth.js           # Config NextAuth
│   └── models/               # Modèles Mongoose
│       ├── Movie.js
│       └── Admin.js
├── scripts/
│   └── init-admin.js         # Script d'init
├── .env.local                # Variables (à créer)
├── next.config.js
├── tailwind.config.js
└── package.json
```

## 🎨 Personnalisation

### Thème

Modifier les couleurs dans `tailwind.config.js` :

```javascript
colors: {
  netflix: {
    red: '#E50914',      // Couleur principale
    black: '#141414',    // Fond principal
    darkGray: '#181818', // Fond secondaire
    gray: '#2F2F2F',     // Éléments UI
    lightGray: '#B3B3B3' // Texte secondaire
  }
}
```

### Genres

Modifier la liste dans `src/models/Movie.js` :

```javascript
enum: ['Action', 'Drame', 'Comédie', 'SF', 'Horreur', 'Animation', 'Romance', 'Thriller', 'Documentaire']
```

## 🐛 Dépannage

### Le lecteur vidéo ne s'affiche pas

- Vérifier que le lien UQload est correct
- Désactiver les bloqueurs de publicités
- Vérifier la console navigateur pour les erreurs

### Erreur de connexion MongoDB

- Vérifier que `MONGODB_URI` est correct
- Autoriser l'IP `0.0.0.0/0` dans MongoDB Atlas (Network Access)
- Vérifier que l'utilisateur DB a les droits

### Session expirée rapidement

- Vérifier que `NEXTAUTH_SECRET` est défini
- Augmenter `maxAge` dans `src/lib/auth.js`

### Erreur 500 sur Vercel

- Vérifier les logs Vercel
- Vérifier toutes les variables d'environnement
- Vérifier la connexion MongoDB

## 📝 TODO / Améliorations futures

- [ ] Upload d'affiches directement
- [ ] Gestion des utilisateurs (inscription, favoris)
- [ ] Système de notation et commentaires
- [ ] Recommandations basées sur l'historique
- [ ] Support multi-langues
- [ ] Mode sombre / clair
- [ ] Export/Import de catalogue
- [ ] Analytics détaillés

## 📄 Licence

Ce projet est à usage éducatif uniquement.

## 🤝 Support

Pour toute question ou problème :
1. Vérifier la documentation
2. Consulter les issues GitHub
3. Contacter le support

---

**🎉 Votre plateforme de streaming est prête !**

Accéder à :
- Site public : `https://votre-domaine.vercel.app`
- Admin : `https://votre-domaine.vercel.app/admin/login`