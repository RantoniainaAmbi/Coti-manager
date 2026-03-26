# 💰 Coti Manager

Une application web moderne pour gérer les cotisations et les finances en groupe. **Coti Manager** simplifie le partage des dépenses, le suivi des contributions et la gestion des finances collectives.

**🚀 [Voir la démo en direct](https://coti-manager.vercel.app)**

---

## ✨ Caractéristiques

- 👥 **Gestion des groupes** - Créez et gérez plusieurs groupes de partage
- 💳 **Suivi des cotisations** - Enregistrez et suivez toutes les contributions
- 📊 **Tableaux de bord** - Visualisez vos finances avec des graphiques intuitifs
- 🔐 **Authentification sécurisée** - Système d'authentification robuste avec NextAuth
- 🗄️ **Base de données** - Stockage fiable avec Prisma et PostgreSQL
- 📱 **Design responsive** - Interface moderne et adaptée à tous les appareils
- 🎨 **Interface élégante** - Créée avec Tailwind CSS et Lucide React

---

## 🛠️ Stack Technique

### Frontend
- **Next.js 16** - Framework React moderne
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS 4** - Stylisation utility-first
- **Lucide React** - Icônes élégantes
- **Recharts** - Graphiques interactifs

### Backend & Base de Données
- **Prisma 5** - ORM TypeScript
- **NextAuth 5** - Authentification
- **bcryptjs** - Hachage des mots de passe

### Développement
- **ESLint 9** - Linting du code
- **ts-node** - Exécution de scripts TypeScript

---

## 🚀 Démarrage rapide

### Prérequis
- **Node.js** 18+ ou **npm**
- Une base de données PostgreSQL (optionnelle pour développement local)

### Installation

1. **Clonez le repository**
```bash
git clone https://github.com/RantoniainaAmbi/Coti-manager.git
cd Coti-manager
```

2. **Installez les dépendances**
```bash
npm install
```

3. **Configurez les variables d'environnement**
```bash
cp .env.example .env.local
```

Remplissez les variables nécessaires pour votre base de données et l'authentification.

4. **Configurez la base de données**
```bash
npm run prisma migrate dev
npm run prisma db seed
```

5. **Lancez le serveur de développement**
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 📝 Scripts disponibles

```bash
npm run dev       # Démarrage du serveur de développement
npm run build     # Build pour la production
npm start         # Lancement du serveur en production
npm run lint      # Vérification du code avec ESLint
```

---

## 📁 Structure du projet

```
Coti-manager/
├── app/                 # Application Next.js (App Router)
├── components/          # Composants React réutilisables
├── lib/                 # Fonctions utilitaires
├── prisma/              # Schéma de base de données et migrations
├── public/              # Fichiers statiques
├── types/               # Définitions TypeScript
├── middleware.ts        # Middleware Next.js
├── next.config.ts       # Configuration Next.js
├── tsconfig.json        # Configuration TypeScript
└── package.json         # Dépendances du projet
```

---

## 🔐 Authentification

Cette application utilise **NextAuth 5** avec l'adaptateur Prisma. Les utilisateurs peuvent :
- Créer un compte
- Se connecter de manière sécurisée
- Gérer leur profil
- Se déconnecter

Les mots de passe sont hachés avec **bcryptjs** pour une sécurité maximale.

---

## 💾 Base de données

Le schéma Prisma définit les modèles pour :
- Les utilisateurs
- Les groupes de cotisation
- Les transactions et cotisations
- Les historiques des mouvements

Pour consulter/modifier le schéma :
```bash
npx prisma studio    # Ouvre l'interface Prisma Studio
```

---

## 🌐 Déploiement

### Déployer sur Vercel

L'application est optimisée pour Vercel. Déployez en un seul clic :

1. Poussez votre code sur GitHub
2. Connectez votre repository à [Vercel](https://vercel.com)
3. Configurez les variables d'environnement
4. Vercel déploiera automatiquement

[En savoir plus sur le déploiement Next.js](https://nextjs.org/docs/app/building-your-application/deploying)

---

## 📚 Documentation utile

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Prisma](https://www.prisma.io/docs/)
- [Documentation NextAuth](https://next-auth.js.org/)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commiter vos changements (`git commit -m 'Add AmazingFeature'`)
4. Pousser vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est open source. Consultez le fichier LICENSE pour plus de détails.

---

## 👤 Auteur

**RantoniainaAmbi**
- GitHub: [@RantoniainaAmbi](https://github.com/RantoniainaAmbi)

---

## 💡 Support

Vous avez des questions ? Consultez :
- Les [Issues GitHub](https://github.com/RantoniainaAmbi/Coti-manager/issues)
- Les [Discussions](https://github.com/RantoniainaAmbi/Coti-manager/discussions)

---

**Construit avec ❤️ en utilisant Next.js et TypeScript**
