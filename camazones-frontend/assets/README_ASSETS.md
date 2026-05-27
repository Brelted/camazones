# Assets Camazones

## Fichiers requis

| Fichier                 | Taille       | Description |
|------------------------|--------------|-------------|
| `icon.png`             | 1024×1024 px | Icône de l'app (Android + iOS) |
| `adaptive-icon.png`    | 1024×1024 px | Icône adaptative Android (foreground) |
| `splash.png`           | 1242×2436 px | Écran de démarrage |
| `favicon.png`          | 196×196 px   | Favicon web |

## Design

**Fond splash / icône** : `#FF6B35` (orange Camazones)

**Logo** : Croissant de lune + texte CAMAZONES
- Croissant : couleur `#F7C948` (or kente)
- Texte CAMA : `#FFFFFF`
- Texte ZONES : `#F7C948`
- Police : sans-serif bold

## Générateur recommandé

Utilise **Expo EAS** ou **https://easyappicon.com** pour générer
toutes les tailles à partir d'une image 1024×1024.

Commande Expo :
```
npx expo install expo-asset
eas build --platform android
```

## Placeholder rapide (dev)

Pour tester sans vraie icône, crée une image 1024×1024 orange
avec le croissant en or au centre. Outil : Canva, Figma, ou GIMP.
