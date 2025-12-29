# ✅ Checklist de Déploiement Production

## Avant le déploiement

### 🔐 Sécurité

- [ ] **Secrets générés** : Utiliser `openssl rand -base64 32` pour NEXTAUTH_SECRET et JWT_SECRET
- [ ] **Mot de passe admin fort** : Minimum 12 caractères, majuscules, minuscules, chiffres, symboles
- [ ] **Variables d'environnement** : Aucun secret dans le code source
- [ ] **`.gitignore`** : Vérifier que `.env.local` est ignoré
- [ ] **MongoDB IP Whitelist** : Configurer `0.0.0.0/0` pour Vercel (serverless)

### 🗄️ Base de données

- [ ] **Cluster MongoDB Atlas créé** : M0 Free tier suffit pour commencer
- [ ] **Base de données `streaming` créée**
- [ ] **Utilisateur DB avec droits ReadWrite**
- [ ] **Connection string testée** localement
- [ ] **Backup configuré** (optionnel pour production)

### 🧪 Tests locaux

- [ ] `npm install` : Sans erreurs
- [ ] `npm run dev` : L'app se lance sur localhost:3000
- [ ] **Page d'accueil** : S'affiche correctement
- [ ] **Admin créé** : Script `init-admin.js` exécuté
- [ ] **Connexion admin** : Login fonctionne
- [ ] **Ajout de film** : Test avec un film
- [ ] **Lecteur vidéo** : Le film se lit correctement
- [ ] `npm run build` : Build sans erreurs
- [ ] `npm run start` : Production mode fonctionne

---

## Configuration Vercel

### 📦 Projet

- [ ] **Compte Vercel** créé
- [ ] **Repo GitHub** connecté
- [ ] **Framework preset** : Next.js détecté automatiquement
- [ ] **Build command** : `npm run build` (par défaut)
- [ ] **Output directory** : `.next` (par défaut)

### 🔑 Variables d'environnement

Ajouter dans les settings Vercel :

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/streaming
NEXTAUTH_URL=https://votre-domaine.vercel.app
NEXTAUTH_SECRET=secret_genere_32_caracteres
JWT_SECRET=autre_secret_genere_32_caracteres
ADMIN_EMAIL=admin@votre-domaine.com
ADMIN_PASSWORD=MotDePasseTresFort123!@#
NODE_ENV=production
```

- [ ] Toutes les variables ajoutées
- [ ] Pas d'espaces avant/après les valeurs
- [ ] NEXTAUTH_URL correspond au domaine de production

### 🚀 Déploiement

- [ ] **Premier déploiement** : Réussi
- [ ] **URL de production** : Accessible
- [ ] **Logs Vercel** : Aucune erreur critique
- [ ] **Build time** : < 2 minutes (normal)

---

## Tests en production

### ✅ Fonctionnalités essentielles

- [ ] **Page d'accueil** : Charge en < 3 secondes
- [ ] **Design responsive** : Testé sur mobile, tablette, desktop
- [ ] **Recherche** : Retourne des résultats
- [ ] **Filtres genre** : Fonctionnent
- [ ] **Page film** : Affiche correctement
- [ ] **Lecteur vidéo** : Charge et lit la vidéo

### 🔐 Admin

- [ ] **Page login** : Accessible à `/admin/login`
- [ ] **Authentification** : Connexion réussie
- [ ] **Dashboard** : Statistiques affichées
- [ ] **Ajout de film** : Fonctionne
- [ ] **Suppression** : Fonctionne
- [ ] **Déconnexion** : Fonctionne
- [ ] **Session** : Persiste pendant 24h

### 🌐 Performance

- [ ] **Lighthouse Score** : 
  - Performance > 80
  - Accessibility > 90
  - Best Practices > 90
  - SEO > 90
- [ ] **Images** : Optimisées avec Next Image
- [ ] **Temps de réponse API** : < 1 seconde
- [ ] **Cold start** : < 5 secondes (normal sur Vercel)

---

## Sécurité en production

### 🛡️ Vérifications

- [ ] **HTTPS** : Activé automatiquement par Vercel
- [ ] **Headers sécurisés** : Configurés dans next.config.js
- [ ] **Rate limiting** : Actif sur les routes auth
- [ ] **Validation des entrées** : Mongoose schemas
- [ ] **Pas de secrets exposés** : Vérifier le code source public
- [ ] **Sessions sécurisées** : httpOnly cookies

### 🔍 Tests de sécurité

- [ ] **Tentatives login invalides** : Bloquées après 5 essais
- [ ] **Accès routes admin sans auth** : Redirigé vers login
- [ ] **Injection SQL/NoSQL** : Protégé par Mongoose
- [ ] **XSS** : React échappe automatiquement
- [ ] **CSRF** : NextAuth protège

---

## Post-déploiement

### 📝 Documentation

- [ ] **README** à jour avec l'URL de production
- [ ] **Identifiants admin** sauvegardés de manière sécurisée
- [ ] **URL admin** documentée pour l'équipe

### 🔄 Maintenance

- [ ] **Backup MongoDB** : Configuré (recommandé)
- [ ] **Monitoring** : Vercel Analytics activé (optionnel)
- [ ] **Alertes** : Erreurs critiques notifiées
- [ ] **Updates** : Plan de mise à jour défini

### 👥 Accès

- [ ] **Admin principal** : Créé et testé
- [ ] **Changer mot de passe** : Admin par défaut modifié
- [ ] **Documentation accès** : Partagée avec l'équipe

---

## 🚨 Troubleshooting Production

### Erreur "Cannot connect to database"

```bash
# Vérifier dans Vercel > Settings > Environment Variables
# - MONGODB_URI est correct
# - Pas d'espace avant/après la valeur
# Dans MongoDB Atlas > Network Access
# - Ajouter 0.0.0.0/0 (pour Vercel)
```

### Erreur "Invalid token" ou "Session expired"

```bash
# Régénérer les secrets
openssl rand -base64 32
# Mettre à jour dans Vercel > Settings > Environment Variables
# Redéployer
```

### Le site charge mais pas les films

```bash
# Vérifier les logs Vercel
# Vérifier que la DB contient des films
# Tester l'API directement : /api/movies
```

### Page 500 sur certaines routes

```bash
# Vercel > Logs > Chercher l'erreur exacte
# Souvent : variable d'environnement manquante
# Ou : problème de connexion MongoDB
```

---

## 📊 Métriques de succès

### KPIs à surveiller

- **Uptime** : > 99.5%
- **Temps de réponse** : < 1s (moyenne)
- **Taux d'erreur** : < 0.1%
- **Utilisation DB** : < 512 MB (M0 limit)
- **Bande passante** : < 100 GB/mois (Vercel free tier)

---

## ✅ Déploiement validé !

Une fois cette checklist complétée, votre plateforme est prête pour la production. 

**🎉 Félicitations !**

Prochaine étape : Ajouter du contenu et promouvoir votre plateforme.

---

## 🔗 Liens utiles

- **Vercel Dashboard** : https://vercel.com/dashboard
- **MongoDB Atlas** : https://cloud.mongodb.com
- **Next.js Docs** : https://nextjs.org/docs
- **NextAuth Docs** : https://next-auth.js.org
- **Tailwind CSS** : https://tailwindcss.com/docs

---

**Date de déploiement** : _________________

**Déployé par** : _________________

**URL de production** : _________________

**Notes** : 
_______________________________________
_______________________________________
_______________________________________