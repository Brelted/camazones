const productImages = {
  koa1: require('../../assets/products/figma-style/fashion-bag.jpg'),
  koa2: require('../../assets/products/figma-style/fashion-dress.jpg'),
  koa3: require('../../assets/products/figma-style/fashion-sneaker-red.jpg'),
  koa4: require('../../assets/products/figma-style/fashion-glasses.jpg'),
  koa5: require('../../assets/products/figma-style/fashion-watch.jpg'),
  koa6: require('../../assets/products/figma-style/fashion-shirt.jpg'),
  koa7: require('../../assets/products/figma-style/fashion-jacket.jpg'),
  koa8: require('../../assets/products/figma-style/fashion-perfume.jpg'),
  talia1: require('../../assets/products/figma-style/fashion-bag.jpg'),
  talia2: require('../../assets/products/figma-style/fashion-dress.jpg'),
  talia3: require('../../assets/products/figma-style/fashion-shirt.jpg'),
  talia4: require('../../assets/products/figma-style/fashion-sneaker-red.jpg'),
  talia5: require('../../assets/products/figma-style/fashion-glasses.jpg'),
  talia6: require('../../assets/products/figma-style/fashion-watch.jpg'),
  talia7: require('../../assets/products/figma-style/fashion-jacket.jpg'),
  talia8: require('../../assets/products/figma-style/fashion-perfume.jpg'),
  noma1: require('../../assets/products/figma-style/tech-phone.jpg'),
  noma2: require('../../assets/products/figma-style/tech-laptop.jpg'),
  noma3: require('../../assets/products/figma-style/tech-headphones.jpg'),
  noma4: require('../../assets/products/figma-style/tech-watch.jpg'),
  noma5: require('../../assets/products/figma-style/tech-speaker.jpg'),
  noma6: require('../../assets/products/figma-style/tech-keyboard.jpg'),
  noma7: require('../../assets/products/figma-style/tech-camera.jpg'),
  noma8: require('../../assets/products/figma-style/tech-earbuds.jpg'),
  sawa1: require('../../assets/products/figma-style/fashion-shirt.jpg'),
  sawa2: require('../../assets/products/figma-style/fashion-bag.jpg'),
  sawa3: require('../../assets/products/figma-style/tech-earbuds.jpg'),
  sawa4: require('../../assets/products/figma-style/tech-phone.jpg'),
  sawa5: require('../../assets/products/figma-style/tech-speaker.jpg'),
  sawa6: require('../../assets/products/figma-style/fashion-perfume.jpg'),
  sawa7: require('../../assets/products/figma-style/fashion-sneaker-red.jpg'),
  sawa8: require('../../assets/products/figma-style/tech-laptop.jpg'),
};

export const categories = [
  { id: 'clothes', label: 'Clothes', icon: '👗' },
  { id: 'gadgets', label: 'Gadgets', icon: '📱' },
  { id: 'shoes', label: 'Shoes', icon: '👟' },
  { id: 'more', label: 'More', icon: '🛒' },
];

export const profilePhotos = [
  require('../../assets/profiles/profile-1.jpg'),
  require('../../assets/profiles/profile-2.jpg'),
  require('../../assets/profiles/profile-3.jpg'),
];

const product = (id, title, image, category, price, stock, description, options = {}) => ({
  id,
  title,
  image,
  category,
  price,
  stock,
  description,
  premium: Boolean(options.premium),
  certified: Boolean(options.certified),
});

export const shops = [
  {
    id: 'atelier-koa',
    name: 'Atelier Koa',
    city: 'Douala',
    email: 'atelier.koa@camazones.demo',
    accountType: 'professional',
    certifiedByAp: true,
    premium: true,
    visibilityRank: 98,
    speciality: 'Mode premium',
    tagline: 'Pieces sobres, accessoires durables et finitions elegantes pour une vitrine haut de gamme.',
    cover: productImages.koa1,
    products: [
      product('koa-sac-kaya', 'Sac Kaya', productImages.koa1, 'Accessoires', '35 000 FCFA', 'En stock', 'Sac structure, finition douce et detail dore discret.', { premium: true, certified: true }),
      product('koa-veste-nuit', 'Look Burgundy', productImages.koa2, 'Mode', '42 500 FCFA', '4 pieces', 'Tenue bordeaux avec accessoires shopping, rendu chic pour sortie urbaine.', { premium: true, certified: true }),
      product('koa-sneaker-ivoire', 'Sneaker Rouge', productImages.koa3, 'Chaussures', '38 000 FCFA', '9 paires', 'Sneaker rouge sportive, semelle confortable et photo produit nette.', { premium: true }),
      product('koa-lunettes-soleil', 'Lunettes Sol', productImages.koa4, 'Accessoires', '16 500 FCFA', '12 pieces', 'Monture fine, protection solaire et style minimal.', { certified: true }),
      product('koa-montre-line', 'Montre Line', productImages.koa5, 'Accessoires', '29 000 FCFA', '6 pieces', 'Montre elegante avec bracelet acier et cadran net.', { premium: true }),
      product('koa-chemise-lin', 'Chemise Lin', productImages.koa6, 'Mode', '24 000 FCFA', '10 pieces', 'Chemise respirante, coupe calme et teinte naturelle.'),
      product('koa-portefeuille-nova', 'Veste City Noir', productImages.koa7, 'Mode', '34 500 FCFA', 'En stock', 'Veste noire elegante, coupe urbaine et finition premium.', { certified: true }),
      product('koa-parfum-bois', 'Parfum Bois', productImages.koa8, 'Lifestyle', '31 000 FCFA', '5 pieces', 'Signature boisee douce, flacon sobre et tenue longue.', { premium: true }),
    ],
  },
  {
    id: 'maison-talia',
    name: 'Talia Closet',
    city: 'Yaounde',
    email: 'talia.closet@camazones.demo',
    accountType: 'professional',
    certifiedByAp: true,
    premium: false,
    visibilityRank: 84,
    speciality: 'Vetements tendance',
    tagline: 'Robes, chemises et accessoires propres pour un style mobile marketplace.',
    cover: productImages.talia1,
    products: [
      product('talia-bag-mini', 'Mini Bag Cyan', productImages.talia1, 'Clothes', '28 000 FCFA', '7 pieces', 'Sac mode compact avec couleur forte et finition nette.', { certified: true }),
      product('talia-dress-sand', 'Look Shopping', productImages.talia2, 'Clothes', '36 000 FCFA', 'En stock', 'Look mode avec sacs shopping, ideal pour une vitrine tendance.'),
      product('talia-shirt-basic', 'Basic Tee', productImages.talia3, 'Clothes', '12 500 FCFA', '18 pieces', 'T-shirt simple, propre et facile a porter.', { certified: true }),
      product('talia-red-runner', 'Red Runner', productImages.talia4, 'Shoes', '44 000 FCFA', '10 paires', 'Sneaker rouge type featured product avec photo nette.'),
      product('talia-sun-glasses', 'Sun Glasses', productImages.talia5, 'Accessories', '18 000 FCFA', '5 pieces', 'Lunettes noires minimalistes pour look premium.'),
      product('talia-watch-clean', 'Clean Watch', productImages.talia6, 'Accessories', '22 000 FCFA', '6 pieces', 'Montre fine et lisible, ideale pour carte produit.'),
      product('talia-jacket-city', 'City Jacket', productImages.talia7, 'Clothes', '34 000 FCFA', 'En stock', 'Veste urbaine, image mode claire et style street.'),
      product('talia-perfume-soft', 'Soft Perfume', productImages.talia8, 'Accessories', '31 000 FCFA', '3 pieces', 'Parfum visuel propre pour completer la vitrine mode.'),
    ],
  },
  {
    id: 'studio-noma',
    name: 'Studio Noma',
    city: 'Bafoussam',
    email: 'studio.noma@camazones.demo',
    accountType: 'professional',
    certifiedByAp: false,
    premium: true,
    visibilityRank: 91,
    speciality: 'Tech et mobilite',
    tagline: 'Accessoires tech fiables, service vendeur rapide et selection bien organisee.',
    cover: productImages.noma1,
    products: [
      product('noma-power-slim', 'Smartphone Clear', productImages.noma1, 'Tech', '124 000 FCFA', '12 pieces', 'Smartphone lumineux, ecran net et format pratique pour usage quotidien.', { premium: true }),
      product('noma-stand-lux', 'Laptop Desk', productImages.noma2, 'Tech', '285 000 FCFA', 'En stock', 'Ordinateur portable sobre pour bureau, cours et gestion de boutique.'),
      product('noma-airbuds', 'Casque Noma', productImages.noma3, 'Audio', '27 000 FCFA', '8 pieces', 'Casque audio noir, coussinets confortables et son clair.', { premium: true }),
      product('noma-watch-pro', 'Watch Pro', productImages.noma4, 'Wearable', '39 000 FCFA', '5 pieces', 'Montre connectee sobre avec suivi quotidien.', { premium: true }),
      product('noma-speaker-mini', 'Speaker Mini', productImages.noma5, 'Audio', '21 500 FCFA', '9 pieces', 'Enceinte bluetooth compacte, basse nette et autonomie fiable.'),
      product('noma-clavier-slate', 'Clavier Slate', productImages.noma6, 'Bureau', '32 000 FCFA', '4 pieces', 'Clavier silencieux, format bureau et toucher stable.'),
      product('noma-case-armor', 'Camera Compact', productImages.noma7, 'Camera', '175 000 FCFA', 'En stock', 'Camera compacte noire, ideale pour photos produit et contenu boutique.'),
      product('noma-cable-fast', 'Earbuds Fast', productImages.noma8, 'Audio', '25 000 FCFA', 'En stock', 'Ecouteurs sans fil avec boitier compact et connexion rapide.'),
    ],
  },
  {
    id: 'sony-store',
    name: 'Sony Store',
    city: 'Douala',
    email: 'sony.store@camazones.demo',
    accountType: 'professional',
    certifiedByAp: true,
    premium: true,
    visibilityRank: 96,
    speciality: 'Sony mobile et audio',
    tagline: 'Smartphones, audio, camera et accessoires Sony avec garantie boutique.',
    cover: productImages.noma1,
    products: [
      product('sony-ps5-slim', 'Sony Xperia Slim', productImages.noma1, 'Mobile', '390 000 FCFA', '5 pieces', 'Smartphone Sony premium, ecran clair, facture boutique et garantie.', { premium: true, certified: true }),
      product('sony-wh-headset', 'Casque Sony WH', productImages.noma3, 'Audio', '155 000 FCFA', '8 pieces', 'Casque reduction de bruit, son propre et autonomie longue.', { premium: true }),
      product('sony-alpha-camera', 'Camera Alpha', productImages.noma7, 'Camera', '520 000 FCFA', '3 pieces', 'Camera Sony Alpha pour createur, image nette et kit complet.', { premium: true, certified: true }),
      product('sony-xperia-pro', 'Sony Watch Pro', productImages.noma4, 'Wearable', '110 000 FCFA', '6 pieces', 'Montre connectee Sony, bracelet clair et suivi quotidien.', { premium: true }),
      product('sony-speaker-go', 'Speaker Sony Go', productImages.noma5, 'Audio', '45 000 FCFA', '12 pieces', 'Enceinte Sony compacte, basse claire et bluetooth stable.'),
      product('sony-dualsense', 'Sony Earbuds Sense', productImages.noma8, 'Audio', '42 000 FCFA', '10 pieces', 'Ecouteurs Sony compacts, boitier propre et autonomie fiable.', { certified: true }),
      product('sony-soundbar', 'Sony Keyboard Media', productImages.noma6, 'Bureau', '80 000 FCFA', '4 pieces', 'Clavier media Sony, touches propres et format bureau.', { premium: true }),
      product('sony-fast-charge', 'Sony Laptop Dock', productImages.noma2, 'Accessoires', '218 000 FCFA', 'En stock', 'Laptop Sony avec poste de travail clair et garantie boutique.'),
    ],
  },
  {
    id: 'sawa-market',
    name: 'Sawa Deals',
    city: 'Limbe',
    email: 'sawa.deals@camazones.demo',
    accountType: 'professional',
    certifiedByAp: false,
    premium: false,
    visibilityRank: 73,
    speciality: 'Clothes et gadgets',
    tagline: 'Selection mixte, prix visibles et offres rapides comme une app marketplace.',
    cover: productImages.sawa1,
    products: [
      product('sawa-basic-tee', 'Basic Tee', productImages.sawa1, 'Clothes', '8 500 FCFA', 'En stock', 'T-shirt propre pour les ventes rapides.'),
      product('sawa-mini-bag', 'Mini Bag', productImages.sawa2, 'Accessories', '20 000 FCFA', '10 pieces', 'Sac tendance avec couleur forte.'),
      product('sawa-airbuds-lite', 'Airbuds Lite', productImages.sawa3, 'Gadgets', '18 500 FCFA', 'En stock', 'Ecouteurs sans fil proches des cartes gadget.'),
      product('sawa-phone-plus', 'Phone Plus', productImages.sawa4, 'Gadgets', '95 000 FCFA', '12 pieces', 'Telephone vitrine avec image nette et prix visible.'),
      product('sawa-speaker-go', 'Speaker Go', productImages.sawa5, 'Gadgets', '21 000 FCFA', '15 pieces', 'Mini enceinte type marketplace, photo claire.'),
      product('sawa-perfume-clear', 'Perfume Clear', productImages.sawa6, 'Accessories', '24 000 FCFA', '9 pieces', 'Accessoire lifestyle pour diversifier la boutique.'),
      product('sawa-red-sneaker', 'Red Sneaker', productImages.sawa7, 'Shoes', '38 000 FCFA', 'En stock', 'Sneaker rouge tres visible comme dans la reference.'),
      product('sawa-laptop-air', 'Laptop Air', productImages.sawa8, 'Gadgets', '260 000 FCFA', '6 pieces', 'Laptop clair pour completer la grille gadgets.'),
    ],
  },
];

export const independentSellers = [
  {
    id: 'alan-independant',
    name: 'Alan Independant',
    city: 'Douala',
    email: 'alan.independant@camazones.demo',
    accountType: 'independent',
    certifiedByAp: true,
    premium: false,
    sellsOften: true,
    avatar: profilePhotos[2],
    tagline: 'Client independant actif, vend et achete souvent sans vitrine.',
    products: [
      product('alan-tablette-clean', 'Laptop Alan Clean', productImages.noma2, 'Gadgets', '65 000 FCFA', '1 piece', 'Laptop tres propre, negociable et disponible a Douala.', { certified: true }),
      product('alan-casque-lite', 'Casque Lite Alan', productImages.noma3, 'Audio', '19 000 FCFA', '1 piece', 'Casque leger vendu par Alan apres upgrade audio.'),
    ],
  },
  {
    id: 'mila-select',
    name: 'Mila Select',
    city: 'Douala',
    email: 'mila.select@camazones.demo',
    accountType: 'independent',
    certifiedByAp: false,
    premium: false,
    sellsOften: true,
    avatar: profilePhotos[0],
    tagline: 'Client actif qui vend souvent sans vitrine publique.',
    products: [
      product('mila-watch-line', 'Watch Line', productImages.koa5, 'Accessoires', '18 000 FCFA', '2 pieces', 'Montre sobre, bracelet acier et cadran fin.'),
      product('mila-sac-ville', 'Sac Ville', productImages.koa1, 'Accessoires', '20 000 FCFA', '1 piece', 'Sac propre, peu utilise et disponible rapidement.'),
    ],
  },
  {
    id: 'leo-corner',
    name: 'Leo Corner',
    city: 'Yaounde',
    email: 'leo.corner@camazones.demo',
    accountType: 'independent',
    certifiedByAp: true,
    premium: false,
    sellsOften: true,
    avatar: profilePhotos[1],
    tagline: 'Vendeur independant reconnu, annonces ponctuelles et contact rapide.',
    products: [
      product('leo-headset-noir', 'Headset Noir', productImages.noma3, 'Tech', '21 000 FCFA', '3 pieces', 'Casque leger, finition sombre et son equilibre.', { certified: true }),
      product('leo-speaker-go', 'Speaker Go', productImages.noma5, 'Audio', '17 000 FCFA', '2 pieces', 'Petite enceinte propre avec autonomie correcte.'),
    ],
  },
];

export const conversations = [
  {
    id: 'conv-alan-sony',
    sellerName: 'Sony Store',
    product: 'Sony Xperia Slim',
    unread: 3,
    status: 'Negociation acceptee',
    messages: [
      { id: 'm1', from: 'buyer', text: 'Bonjour Sony, je suis Alan. Le Sony Xperia Slim est a 390 000 FCFA, possible de revoir le prix ?' },
      { id: 'm2', from: 'seller', text: 'Bonjour Alan, elle est neuve avec garantie boutique. Vous proposez combien ?' },
      { id: 'm3', from: 'buyer', text: 'Je peux payer 350 000 FCFA aujourd hui via Camazones Pay.' },
      { id: 'm4', from: 'seller', text: 'Accorde. Sony accepte 350 000 FCFA si paiement aujourd hui.' },
      { id: 'm5', from: 'buyer', text: 'Parfait, je confirme le paiement maintenant.' },
    ],
  },
  {
    id: 'conv-atelier-koa',
    sellerName: 'Atelier Koa',
    product: 'Sac Kaya',
    unread: 2,
    status: 'Premium',
    messages: [
      { id: 'm1', from: 'seller', text: 'Bonjour, le Sac Kaya est disponible aujourd hui.' },
      { id: 'm2', from: 'buyer', text: 'Je peux payer directement dans l application ?' },
      { id: 'm3', from: 'seller', text: 'Oui, choisissez Orange Money, MTN MoMo, carte ou portefeuille.' },
    ],
  },
  {
    id: 'conv-talia-closet',
    sellerName: 'Talia Closet',
    product: 'Dress Sand',
    unread: 1,
    status: 'Reconnu AP',
    messages: [
      { id: 'm1', from: 'seller', text: 'La robe est disponible avec emballage protege.' },
      { id: 'm2', from: 'buyer', text: 'Parfait, je confirme apres avoir vu la livraison.' },
    ],
  },
  {
    id: 'conv-studio-noma',
    sellerName: 'Studio Noma',
    product: 'Power Slim 20K',
    unread: 0,
    status: 'Premium',
    messages: [
      { id: 'm1', from: 'seller', text: 'Le modele premium est prioritaire en livraison.' },
      { id: 'm2', from: 'buyer', text: 'Merci, je confirme apres verification.' },
    ],
  },
];

export const paymentMethods = [
  { id: 'orange-money', label: 'Orange Money', detail: 'Numero local, validation OTP et recu instantane.', icon: '🟧' },
  { id: 'mtn-momo', label: 'MTN MoMo', detail: 'Paiement mobile money avec confirmation securisee.', icon: '🟨' },
  { id: 'card', label: 'Carte bancaire', detail: 'Visa ou Mastercard avec controle 3D Secure.', icon: '💳' },
  { id: 'wallet', label: 'Solde Camazones', detail: 'Utilise le portefeuille existant sans module doublon.', icon: '🏦' },
];

export const accountTypes = [
  {
    id: 'independent',
    label: 'Client independant',
    description: 'Achete et revend souvent, sans vitrine dediee.',
  },
  {
    id: 'professional',
    label: 'Boutique professionnelle',
    description: 'Possede une vitrine visible avec produits structures.',
  },
];

export const getAllProducts = () =>
  shops.flatMap((shop) => shop.products.map((item) => ({ product: item, seller: shop, sellerType: 'shop' })));

export const getRankedProducts = () =>
  [...getAllProducts()].sort((left, right) => {
    const leftScore =
      Number(left.seller.premium) * 40 +
      Number(left.product.premium) * 30 +
      Number(left.seller.certifiedByAp || left.product.certified) * 18 +
      (left.seller.visibilityRank ?? 0);
    const rightScore =
      Number(right.seller.premium) * 40 +
      Number(right.product.premium) * 30 +
      Number(right.seller.certifiedByAp || right.product.certified) * 18 +
      (right.seller.visibilityRank ?? 0);

    return rightScore - leftScore;
  });

export const searchMarketplace = (query) => {
  const cleanQuery = query.trim().toLowerCase();

  if (!cleanQuery) {
    return shops;
  }

  return shops.filter((shop) => {
    const shopText = `${shop.name} ${shop.city} ${shop.speciality} ${shop.tagline}`.toLowerCase();
    const productText = shop.products
      .map((item) => `${item.title} ${item.category} ${item.description}`)
      .join(' ')
      .toLowerCase();

    return `${shopText} ${productText}`.includes(cleanQuery);
  });
};
