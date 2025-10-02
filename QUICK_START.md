# 🚀 Guide de Démarrage Rapide - MCN Museum

## ⏱️ Timeline: 7 jours jusqu'au pitch

### Jour 1 (Aujourd'hui) - Setup ✅

```bash
# 1. Créer le projet (5 min)
npx create-next-app@latest mcn-museum
cd mcn-museum

# 2. Installer les dépendances (3 min)
npm install firebase html5-qrcode lucide-react next-pwa

# 3. Créer Firebase project (10 min)
# Aller sur console.firebase.google.com
# Créer projet > Activer Firestore + Storage
# Copier config dans .env.local
```

**Tâches importantes:**
- ✅ Copier tous les fichiers fournis
- ✅ Configurer Firebase
- ✅ Tester `npm run dev`
- ✅ Vérifier que tout fonctionne

### Jour 2 - Données et contenu

**Matin (4h):**
- Collecter 10-15 photos d'œuvres du MCN
- Rédiger descriptions FR/EN/Wolof (ou utiliser ChatGPT)
- Créer le fichier `artworks.json` complet

**Après-midi (4h):**
- Enregistrer descriptions audio (téléphone suffit)
- Uploader images vers Firebase Storage
- Uploader audio vers Firebase Storage
- Mettre à jour les URLs dans artworks.json

**Outils recommandés:**
- Photos: Smartphone haute qualité
- Audio: Voice Recorder (Android) / Voice Memos (iOS)
- Traduction Wolof: Aide d'un locuteur natif si possible

### Jour 3 - QR Codes et Tests

**Matin (3h):**
- Générer QR codes pour chaque œuvre
- Format: https://votre-app.vercel.app/artwork/MCN001
- Outils: qrcode.js, qr-code-generator.com
- Imprimer et tester le scan

**Après-midi (5h):**
- Tester toutes les fonctionnalités
- Corriger les bugs
- Optimiser les images (compression)
- Tester sur mobile réel

### Jour 4 - Déploiement

**Matin (2h):**
```bash
# Déployer sur Vercel
npm install -g vercel
vercel login
vercel --prod
```

**Après-midi (6h):**
- Configurer domaine personnalisé (optionnel)
- Tester PWA en production
- Vérifier mode hors ligne
- Optimiser performances (Lighthouse)
- Ajouter Google Analytics events

### Jour 5-6 - Pitch Deck

**Jour 5 (8h):**
Créer présentation PowerPoint/Google Slides:

**Structure recommandée:**
1. **Titre** - MCN Digital Experience
2. **Problème** - Accès limité au patrimoine
3. **Solution** - Notre plateforme
4. **Démo** - Screenshots + vidéo courte
5. **Fonctionnalités** - Les 7 features clés
6. **Technologie** - Stack moderne et scalable
7. **Impact** - Chiffres et bénéfices
8. **Business Model** - Monétisation
9. **Roadmap** - Vision 6-12 mois
10. **Équipe** - Qui vous êtes
11. **Demande** - Partenariat avec MCN

**Jour 6 (8h):**
- Peaufiner le design du pitch
- Préparer démo live (2-3 min)
- Répéter la présentation (10x minimum)
- Créer version vidéo backup
- Anticiper questions du jury

### Jour 7 - Finalisation

**Matin:**
- Derniers tests
- Backup de tout
- Charger téléphones
- Préparer matériel démo

**Après-midi:**
- Répétition finale pitch (5x)
- Relaxer
- Arriver tôt à l'événement

## 🎯 Checklist avant le pitch

### Technique
- [ ] App déployée et accessible
- [ ] Toutes les œuvres affichées correctement
- [ ] Scan QR fonctionnel
- [ ] Audio player fonctionne
- [ ] PWA installable
- [ ] Mode hors ligne opérationnel
- [ ] Responsive mobile/desktop

### Contenu
- [ ] Minimum 10 œuvres avec descriptions complètes
- [ ] Descriptions en 3 langues
- [ ] Photos haute qualité
- [ ] Audio enregistrés
- [ ] QR codes générés

### Pitch
- [ ] Slides finalisées (10-12 max)
- [ ] Démo vidéo (backup)
- [ ] Script pitch mémorisé
- [ ] Réponses aux questions préparées
- [ ] Timer configuré (respecter temps limite)

### Logistique
- [ ] Ordinateur chargé + chargeur
- [ ] Téléphone chargé + chargeur
- [ ] Connexion internet testée
- [ ] Backup USB avec présentation
- [ ] QR codes physiques pour démo
- [ ] Cartes de visite (si possible)

## 💡 Astuces pour gagner

### 1. Storytelling émotionnel
Commencez par une histoire:
> "Imaginez un enfant sénégalais à New York qui veut découvrir l'héritage de ses ancêtres. Aujourd'hui, c'est impossible. Demain, avec MCN Digital..."

### 2. Démo impeccable
- Préparez 3 scénarios de démo
- Testez sur le WiFi de l'événement avant
- Ayez une vidéo backup au cas où

### 3. Différenciation
**Ce qui vous rend unique:**
- Premier à inclure le Wolof (authenticité)
- PWA hors ligne (réalité connectivité africaine)
- Scalabilité panafricaine claire
- Impact culturel mesurable

### 4. Chiffres percutants
Préparez ces stats:
- Nombre de visiteurs MCN/an
- Potentiel visiteurs digitaux
- Coût par visite physique vs digitale
- Nombre de musées africains potentiels

### 5. Vision claire
Montrez où vous serez dans 12 mois:
- 5 musées partenaires
- 10,000 utilisateurs actifs
- 500 œuvres digitalisées
- Plateforme éducative pour écoles

## 🆘 En cas de problème

### Firebase ne fonctionne pas
```bash
# Vérifier les variables d'env
echo $NEXT_PUBLIC_FIREBASE_API_KEY

# Réinstaller Firebase
npm uninstall firebase
npm install firebase@latest
```

### Scanner QR ne marche pas
- Utiliser le mode démo intégré
- Expliquer que c'est un prototype
- Montrer les QR codes physiques

### Pas de temps pour l'audio
- Utilisez text-to-speech en ligne
- Ou présentez comme "fonctionnalité à venir"

### Build fail sur Vercel
```bash
# Build local d'abord
npm run build

# Si ça marche local, check logs Vercel
vercel logs
```

## 📞 Ressources d'urgence

### Support technique
- Next.js Discord: discord.gg/nextjs
- Stack Overflow: stackoverflow.com
- Firebase Support: firebase.google.com/support

### Design d'urgence
- Unsplash: photos gratuites
- Flaticon: icons gratuits
- Canva: pitch deck templates

### Audio gratuit
- Text-to-speech: ttsmaker.com
- Musique libre: freemusicarchive.org

## 🎤 Template Script Pitch (3 min)

```
[0-15s] Hook
"Le patrimoine africain vaut des milliards, mais 99% du monde n'y a pas accès."

[15-45s] Problème
"Le MCN reçoit 50,000 visiteurs/an. Mais 1 milliard d'Africains dans la diaspora ne peuvent pas visiter. Les barrières: langue, distance, accessibilité."

[45s-1:30] Solution
"MCN Digital: scannez un QR, découvrez l'œuvre en FR/EN/Wolof, écoutez l'audio, partagez. Hors ligne. Gratuit. Accessible à tous."

[1:30-2:00] Démo
[Montrer scan → fiche → audio → partage]

[2:00-2:30] Impact et Business
"Vision: 10 musées africains, 1M utilisateurs, préserver notre patrimoine. Modèle: SaaS pour institutions + sponsoring."

[2:30-3:00] Équipe et Demande
"Nous sommes [X] développeurs passionnés. Nous demandons un partenariat avec le MCN pour déployer dès novembre 2025."
```

## ✨ Derniers conseils

1. **Restez calme** - Vous avez une super solution
2. **Soyez passionnés** - L'émotion compte
3. **Écoutez le jury** - Adaptez vos réponses
4. **Souriez** - Confiance et positivité
5. **Ayez du fun** - C'est une opportunité incroyable!

---

**Vous allez cartonner! 🚀🇸🇳**

Besoin d'aide? Revenez me voir à tout moment!