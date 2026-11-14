# English Coach

Application personnelle pour passer d'un anglais B2 solide à un C1, avec un volet anglais de la finance.
Elle tourne **sur votre ordinateur**, sans abonnement et sans API payante.

> État actuel : **squelette**. La navigation, la base de données et les pages des modules existent,
> mais les exercices ne sont pas encore développés. Ils arriveront module par module.

---

## Lancer l'application sur votre ordinateur

Vous n'avez besoin d'aucune connaissance en programmation : il suffit de suivre les étapes dans l'ordre.
Les étapes 1 et 2 ne se font qu'une seule fois.

### 1. Installer Node.js (une seule fois)

Node.js est le programme qui fait tourner l'application.

1. Allez sur <https://nodejs.org/fr>.
2. Téléchargez la version **LTS** (le gros bouton de gauche) et installez-la en laissant les options par défaut.
3. Vérifiez l'installation : ouvrez un **terminal**
   - **Mac** : touche `Cmd` + `Espace`, tapez `Terminal`, puis Entrée ;
   - **Windows** : touche `Windows`, tapez `PowerShell`, puis Entrée.

   Tapez ensuite la commande suivante, puis Entrée :

   ```
   node -v
   ```

   Un numéro de version doit s'afficher (par exemple `v22.12.0`). Il faut au moins la version 20.

### 2. Récupérer le code et l'installer (une seule fois)

1. Sur la page GitHub du projet, cliquez sur le bouton vert **Code**, puis **Download ZIP**.
2. Décompressez le fichier ZIP, par exemple dans votre dossier `Documents`.
   Vous obtenez un dossier `english-app` (parfois `english-app-main` : c'est le même).
3. Dans le terminal, placez-vous dans ce dossier. Le plus simple : tapez `cd ` (avec un espace),
   puis **glissez le dossier** depuis le Finder ou l'Explorateur dans la fenêtre du terminal, et appuyez sur Entrée.
4. Installez les composants de l'application (cela prend une à deux minutes) :

   ```
   npm install
   ```

5. Créez la base de données locale :

   ```
   npm run setup
   ```

   Le message `✔ 5 compétences enregistrées.` confirme que tout est prêt.

### 3. Démarrer l'application (à chaque utilisation)

Dans le terminal, depuis le dossier du projet :

```
npm run dev
```

Puis ouvrez <http://localhost:3000> dans votre navigateur (Chrome ou Edge recommandés, pour la partie vocale à venir).

Pour arrêter l'application : revenez dans le terminal et appuyez sur `Ctrl` + `C`.

### Mettre à jour l'application

Quand une nouvelle version est disponible, retéléchargez le ZIP et remplacez les fichiers,
**en gardant le dossier `data`** (c'est là que sont enregistrés vos progrès). Puis lancez :

```
npm install
npm run setup
```

`npm run setup` met la base à jour sans effacer vos données.

### En cas de problème

| Message | Solution |
| --- | --- |
| `node` ou `npm` « n'est pas reconnu » / « command not found » | Node.js n'est pas installé, ou le terminal a été ouvert avant l'installation : fermez-le et rouvrez-le. |
| `ENOENT` ou `package.json` introuvable | Vous n'êtes pas dans le bon dossier : refaites l'étape 2.3. |
| Le tableau de bord dit que la base n'est pas prête | Arrêtez l'app (`Ctrl` + `C`), lancez `npm run setup`, puis `npm run dev`. |
| `Port 3000 is in use` | L'app tourne déjà dans un autre terminal : utilisez celui-là, ou fermez-le. |

---

## Comment l'application est construite

### Les modules

| Module | Adresse | Rôle prévu |
| --- | --- | --- |
| Tableau de bord | `/` | Séance du jour, maîtrise par compétence |
| Grammaire | `/grammar` | Diagnostic, parcours, révision des erreurs |
| Vocabulaire | `/vocabulary` | Cartes en révision espacée (SRS) |
| Écoute | `/listening` | YouTube et podcasts, quiz, transcriptions |
| Expression orale | `/speaking` | Conversation vocale avec une IA (Web Speech API) |
| Expression écrite | `/writing` | Rédaction corrigée |
| Business & Finance | `/business` | Marchés, crédit, titrisation, corporate finance |

### Le modèle d'apprenant

C'est le cœur de l'application. Toutes vos réponses sont enregistrées avec la compétence
et le concept travaillés, et chaque concept a un score de maîtrise entre 0 et 1.
Le futur moteur adaptatif s'appuiera dessus pour choisir quoi vous faire travailler chaque jour.

Tables de la base (fichier `data/app.db`, défini dans `src/db/schema.ts`) :

- **skills** : les 5 compétences (grammaire, vocabulaire, compréhension orale, expression orale, expression écrite) ;
- **concepts** : les notions à maîtriser (ex. *present perfect vs prétérit*, *vocabulaire des spreads de crédit*), avec un niveau CECRL et un domaine `general` ou `finance` ;
- **attempts** : le journal de chaque réponse (exercice, réponse donnée, score, type d'erreur, temps de réponse) ;
- **mastery** : le score de maîtrise courant par concept ;
- **vocab_cards** : les cartes de vocabulaire et leur planning de révision espacée ;
- **study_sessions** : les séances de travail.

Toute réponse passe par une seule fonction, `recordAttempt` (`src/lib/learner/record-attempt.ts`),
qui l'enregistre puis met à jour la maîtrise du concept.

### L'IA, sans API payante

Les modules qui ont besoin d'une IA (correction d'écrit, conversation) passent par une interface commune
(`src/lib/ai`). On pourra brancher derrière, au choix :

- **copier-coller** vers votre propre chat Claude (disponible dès maintenant, par défaut) ;
- **Ollama**, un modèle qui tourne sur votre ordinateur ;
- les paliers **gratuits** de Google Gemini ou Groq.

Le choix se fait dans un fichier `.env.local` (voir `.env.example`).

### Commandes utiles

| Commande | Effet |
| --- | --- |
| `npm run dev` | Démarre l'application |
| `npm run setup` | Crée ou met à jour la base, puis ajoute les données de départ |
| `npm run typecheck` / `npm run lint` | Vérifie le code |
| `npm run db:generate` | (Développement) génère une migration après modification de `src/db/schema.ts` |

Technologies : Next.js, TypeScript, Tailwind CSS, SQLite (via Drizzle ORM et libSQL).
