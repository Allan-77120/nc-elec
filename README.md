# NC’ELEC

Site vitrine en français : Next.js 16.2, React 19, TypeScript, Tailwind CSS 4 et Resend. Les modifications restent locales ; aucune publication n’est effectuée par les scripts de vérification.

## Développement

Dans PowerShell :

```powershell
cd "C:\Users\Allan\Documents\nc'elec"
yarn dev
```

Ouvrir http://localhost:3000 (ou le port annoncé par Next.js).

```powershell
yarn lint
yarn test
yarn build
```

Le build télécharge la police Geist depuis Google Fonts et nécessite un accès réseau. Les tests serveur simulent Resend et n’envoient aucun e-mail.

## Identité et contenus

### Refonte du 2 novembre 2026

Composition inspirée de [Lueurs](https://lueurs.net/), avec la palette NC’ELEC conservée et centralisée dans `globals.css`. Navigation latérale à partir de 1100 px, en-tête compact sur tablette et mobile, accueil encadré avec la photo existante et la Seine-et-Marne dans le titre, six prestations en blocs blancs avec pictogrammes et accents jaunes, et démarche en trois étapes sans portrait. Les blocs de prestations s’affichent sur trois colonnes sur ordinateur, deux sur tablette et une sur mobile ; leurs titres ouvrent une demande de devis avec le service présélectionné.

Les réalisations reprennent une composition avec un encadré marine à rayures discrètes et une carte réunissant le descriptif et les photos. Les projets portent les titres « Rénovation d’un tableau électrique » et « Remplacement d’un coffret électrique ». Le lien « Voir l’autre réalisation » passe d’un projet à l’autre, au clavier ou au toucher, et conserve le focus. Chaque projet garde sa propre position avant/après lors des changements. Le glissement sur la photo commande exclusivement le comparateur. La transition respecte la réduction des animations. Les fichiers sources ne sont pas modifiés ; les images restent au ratio 3:4, avec une largeur limitée à 420 px sur ordinateur et 460 px sur mobile. Poignée à deux flèches, séparation fine, étiquettes et curseurs clavier visibles. Les fichiers `realisation-*.jpg` et `service-*.jpg` sont des fichiers de remplacement non exploitables, donc aucune galerie fictive n’a été ajoutée.

Le formulaire conserve ses champs et son intégration serveur Resend, sans modification du destinataire, de l’expéditeur ni des secrets. Les liens des prestations présélectionnent le type de projet. Les animations d’apparition et de survol respectent la réduction des animations, y compris lorsque cette préférence change pendant la visite.

La section 04 « Zone d’intervention » présente Coulommiers et ses alentours comme zone principale, et le reste de l’Île-de-France après étude au cas par cas. La carte [Leaflet](https://leafletjs.com/reference-1.9.4.html) utilise les tuiles OpenStreetMap avec attribution visible, commandes de zoom et repère bleu et jaune au centre de Coulommiers. Elle n’affiche ni rayon d’intervention inventé ni adresse d’entreprise. La carte se charge à l’approche de la section, adapte son rendu avec ResizeObserver et respecte la réduction des animations. Sur mobile, le défilement à un doigt reste celui de la page ; le pincement et les boutons contrôlent le zoom. Elle nécessite un accès réseau, sans clé API. Les coordonnées de contact renvoient vers la section et « Envoyer mon adresse » ouvre le formulaire existant. Les textes de couverture sont centralisés dans `src/data/site.ts`.

Vérifications : ESLint, compilation de production/TypeScript et huit tests serveur réussis. Edge : 1440, 1100, 1024, 768, 390 et 320 px, absence de débordement horizontal, chargement des images, menu/ancres, comparateurs souris/clavier/tactile et défilement vertical. États du formulaire vérifiés avec réponses simulées (aucun nouvel e-mail réel envoyé). Captures et rapport dans `artifacts/preview/`.

La carte ajoute Leaflet 1.9.4 et ses types TypeScript. Aucun nouveau paramètre requis pour cette refonte ; la configuration Resend et la réserve sur la livraison vers Outlook décrites ci-dessous restent applicables.

Le menu est regroupé sous « Découvrir », « Votre projet » et « Nous suivre », avec pictogrammes, état actif marine et jaune et lien vers la zone d’intervention. Les mêmes groupes sont accessibles dans le menu mobile. Le profil Instagram fourni est `https://www.instagram.com/nc_elec/`, ouvert dans un nouvel onglet ; son URL est centralisée dans `src/data/site.ts`.

- Couleurs conservées dans `src/app/globals.css` : marine #062747, bleu #0D4F8B, jaune #F4C430, blanc cassé #F8F8F6.
- Le logo original est conservé ; sa boîte d’affichage masque les marges transparentes sans modifier ni déformer le fichier.
- Les photos `avant.jpeg` et `apres.jpeg` restent celles du comparateur. La photo fournie de l’électricien en intervention est copiée sans modification dans `public/images/artisan-electricien.jpg` et illustre désormais l’accueil, avec un cadrage CSS adapté à l’ordinateur et au mobile. `finale.jpeg` reste disponible.
- Le comparateur existant fonctionnait par glissement après appui, pas par simple survol. Ce comportement est conservé, avec déplacement relatif sans saut initial, glissement tactile horizontal, défilement vertical et contrôle clavier visible.
- Les coordonnées publiques sont reprises de `src/data/site.ts` : téléphone 06 84 82 80 65 et e-mail ncelec@outlook.fr. La réception privée des formulaires est distincte.
- Aucun témoignage, nombre de clients, label, certification ou délai d’intervention n’a été ajouté. La section Avis et le pied de page sont retirés à la demande de l’utilisateur.

## Formulaire et Resend

La route `src/app/api/contact/route.ts` envoie uniquement côté serveur. La clé ne doit jamais porter un préfixe `NEXT_PUBLIC_`.

Configurer `.env.local` à la racine (fichier ignoré par Git), avec les variables suivantes. La clé existante a été conservée sans être affichée :

```dotenv
RESEND_API_KEY=<votre clé privée, à saisir uniquement dans ce fichier>
CONTACT_EMAIL=ncelec@outlook.fr
CONTACT_FROM_EMAIL="NC'ELEC <onboarding@resend.dev>"
```

Redémarrer `yarn dev` après modification si les nouvelles valeurs ne sont pas prises en compte. Ne jamais transmettre la clé dans la conversation, les logs ou le dépôt.

Le domaine `resend.dev` est un expéditeur de test : il ne permet l’envoi qu’à l’adresse associée au compte Resend. Pour utiliser un expéditeur de production, ajouter un domaine que vous possédez dans Resend, installer les enregistrements DNS demandés, attendre sa vérification, puis remplacer `CONTACT_FROM_EMAIL` par une adresse de ce domaine. Outlook reste le destinataire, jamais l’expéditeur Resend.

La réception est désormais configurée vers `ncelec@outlook.fr`. Le test de livraison ci-dessous concernait l’ancienne adresse Gmail ; aucun envoi réel vers Outlook n’a encore été vérifié. Tant que l’expéditeur reste `onboarding@resend.dev`, Outlook doit être l’adresse associée au compte Resend pour être autorisée comme destinataire de test.

Documentation officielle consultée :
- [Restriction du domaine de test](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain)
- [Domaines vérifiés](https://resend.com/docs/dashboard/domains/introduction)
- [Envoi et Reply-To](https://resend.com/docs/api-reference/emails/send-email)
- [Lecture du statut de livraison](https://resend.com/docs/api-reference/emails/retrieve-email)

Le formulaire préremplit devis/rendez-vous et le service choisi, valide les formats et longueurs côté navigateur et serveur, conserve la saisie en cas d’erreur et empêche les doubles clics. Une clé d’idempotence accompagne les nouvelles tentatives identiques auprès de Resend. Le succès exige un identifiant accepté par Resend ; il ne signifie ni arrivée certaine en boîte principale ni rendez-vous réservé.

Protection simple : champ piège antispam, contrôle de l’origine lorsqu’elle est présente, taille du corps limitée à 24 Ko, maximum de 60 tentatives globales et de 3 envois par adresse sur 15 minutes. Les adresses de limitation sont hachées. La limitation est en mémoire par processus : elle se réinitialise au redémarrage et n’est pas partagée entre instances. Avant une exploitation sur plusieurs instances, la remplacer par un stockage partagé ou une limitation sur la plateforme d’hébergement.

## Vérifications du 28 octobre 2026

- Compilation de production, TypeScript et ESLint.
- Huit tests : identifiants en contexte sécurisé et HTTP local, validation, spam, origine, taille, succès confirmé, pannes Resend, configuration absente, Reply-To, idempotence et limitations.
- Navigateur Edge : largeurs 1440, 768, 390 et 320 px, zoom 100 %, images chargées, pas de débordement horizontal ni d’erreur console inattendue.
- Navigation mobile, fermeture par Échap, destinations des boutons et décalage des ancres.
- Comparateur à la souris, au clavier et au tactile, sans blocage du défilement vertical.
- États de formulaire testés avec réponses simulées : erreur conservant les champs, succès, rendez-vous non réservé et prévention du double envoi.
- Envoi réel distinct depuis le formulaire : HTTP 200, Resend `delivered`, tous les champs présents et Reply-To `client-fictif@example.com`.
- Identifiant de l’e-mail réel : `01a18372-3fcb-79d2-adf4-7c002468aabb`.
- Objet : « Nouvelle demande de rendez-vous — NC’ELEC », destinataire christoph.allan77120@gmail.com.
- L’utilisateur a confirmé la réception dans la boîte principale.

Les captures et rapports sont dans `artifacts/preview/` (ignorés par Git).

Les vérifications visuelles utilisent Playwright installé séparément dans le dossier temporaire et Microsoft Edge installé sur Windows. Pour les relancer sur ce poste :

```powershell
npm install --prefix "$env:TEMP\nc-elec-qa" --no-save --package-lock=false playwright
node scripts/qa-browser.cjs
```

Le script `scripts/test-contact-live.cjs` effectue un **véritable envoi** puis interroge Resend. Il doit être lancé explicitement uniquement lorsqu’un nouvel envoi réel est souhaité ; il n’appartient pas à `yarn test`.

## Accès par le réseau local

L’adresse de développement `http://192.168.1.34:3000` est autorisée explicitement dans `allowedDevOrigins`. Cela permet au navigateur de charger correctement le fonctionnement interactif du site en développement.

Sur une adresse HTTP du réseau local, `crypto.randomUUID` n’est pas disponible. Le formulaire utilise alors `crypto.getRandomValues` pour générer un UUID v4. Le test `node scripts/qa-lan-contact.cjs` vérifie le chargement du formulaire et son envoi sur cette adresse, avec une réponse simulée et sans e-mail réel. Ce test passe après correction. Le nouvel envoi réel proposé après ce correctif n’a pas été autorisé ; le rapport de livraison précédent ne valide pas ce nouvel essai.

Si l’adresse IP de l’ordinateur change, mettre à jour l’adresse autorisée dans `next.config.ts` et l’URL du test réseau local.
