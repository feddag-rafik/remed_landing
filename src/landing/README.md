# Landing demos

See [project commands and deployment](../../README.md). Sources, presentation components, theme tokens and assets are local to this project. Login links navigate normally to the app.

Le hero utilise `HeroPatientDemo` et la chronologie pure `heroTimeline.ts` :
Séquence à 60 fps : liste → dossier → drawer → deux antécédents, puis fenêtre mobile à cheval sur le coin inférieur droit → patient → consultation → sélection de « Douleur thoracique » et « Asthénie » dans le même sélecteur, puis confirmation dans le pied de dialogue et ajout simultané des deux motifs. La lecture s’arrête après l’apparition du motif, à l’image 936, sans boucle.

Les états et les curseurs sont calculés depuis une seule frame dans `heroTimeline.ts`. Les deux démos sont des répliques de présentation sans dépendance aux API métier. Le curseur desktop disparaît quand le mobile apparaît ; le curseur mobile s’efface avant l’arrêt.

La composition réserve le débordement : 1100 × 820 en desktop (écran 1000 × 650), 740 × 820 en compact (écran 740 × 650). `demoDimensions` partage ces dimensions entre lecteur et Studio ; les posters CSS suivent les mêmes proportions. Le poster et le mode mouvement réduit montrent le dossier complété et les deux motifs mobiles ajoutés.

La génération s'exécute avec Bun et utilise esbuild pour les modules ESM et
CSS Modules : Bun 1.2.13 produit des imports dynamiques CSS incorrects avec ce
graphe partagé. Les identifiants CSS restent stables entre posters et lecteurs.
Les anciens assets versionnés sont conservés pour que les pages déjà ouvertes
puissent encore charger leurs modules différés après une reconstruction.

Les démonstrations sont des présentations déterministes de données fictives.
Elles ne doivent importer ni clients API, ni contrôleurs de session, ni moteurs
de document/calendrier, ni composants avec effets métier. Les images médicales
sont synthétiques. Les contrôles de lecture fonctionnent ; les commandes
métier illustrées sont décoratives.

