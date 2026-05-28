const productImages = {
  koa1: require('../../assets/products/real/koa-1.jpg'),
  koa2: require('../../assets/products/real/koa-2.jpg'),
  koa3: require('../../assets/products/real/koa-3.jpg'),
  koa4: require('../../assets/products/real/koa-4.jpg'),
  koa5: require('../../assets/products/real/koa-5.jpg'),
  koa6: require('../../assets/products/real/koa-6.jpg'),
  koa7: require('../../assets/products/real/koa-7.jpg'),
  koa8: require('../../assets/products/real/koa-8.jpg'),
  talia1: require('../../assets/products/real/talia-1.jpg'),
  talia2: require('../../assets/products/real/talia-2.jpg'),
  talia3: require('../../assets/products/real/talia-3.jpg'),
  talia4: require('../../assets/products/real/talia-4.jpg'),
  talia5: require('../../assets/products/real/talia-5.jpg'),
  talia6: require('../../assets/products/real/talia-6.jpg'),
  talia7: require('../../assets/products/real/talia-7.jpg'),
  talia8: require('../../assets/products/real/talia-8.jpg'),
  noma1: require('../../assets/products/real/noma-1.jpg'),
  noma2: require('../../assets/products/real/noma-2.jpg'),
  noma3: require('../../assets/products/real/noma-3.jpg'),
  noma4: require('../../assets/products/real/noma-4.jpg'),
  noma5: require('../../assets/products/real/noma-5.jpg'),
  noma6: require('../../assets/products/real/noma-6.jpg'),
  noma7: require('../../assets/products/real/noma-7.jpg'),
  noma8: require('../../assets/products/real/noma-8.jpg'),
  sawa1: require('../../assets/products/real/sawa-1.jpg'),
  sawa2: require('../../assets/products/real/sawa-2.jpg'),
  sawa3: require('../../assets/products/real/sawa-3.jpg'),
  sawa4: require('../../assets/products/real/sawa-4.jpg'),
  sawa5: require('../../assets/products/real/sawa-5.jpg'),
  sawa6: require('../../assets/products/real/sawa-6.jpg'),
  sawa7: require('../../assets/products/real/sawa-7.jpg'),
  sawa8: require('../../assets/products/real/sawa-8.jpg'),
};

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
    accountType: 'professional',
    certifiedByAp: true,
    premium: true,
    visibilityRank: 98,
    speciality: 'Mode premium',
    tagline: 'Pieces sobres, accessoires durables et finitions elegantes pour une vitrine haut de gamme.',
    cover: productImages.koa1,
    products: [
      product('koa-sac-kaya', 'Sac Kaya', productImages.koa1, 'Accessoires', '35 000 FCFA', 'En stock', 'Sac structure, finition douce et detail dore discret.', { premium: true, certified: true }),
      product('koa-veste-nuit', 'Veste Nuit', productImages.koa2, 'Mode', '42 500 FCFA', '4 pieces', 'Veste droite, textile leger et silhouette tres propre.', { premium: true, certified: true }),
      product('koa-sneaker-ivoire', 'Sneaker Ivoire', productImages.koa3, 'Chaussures', '38 000 FCFA', '9 paires', 'Sneaker urbaine, semelle confortable et ton creme.', { premium: true }),
      product('koa-lunettes-soleil', 'Lunettes Sol', productImages.koa4, 'Accessoires', '16 500 FCFA', '12 pieces', 'Monture fine, protection solaire et style minimal.', { certified: true }),
      product('koa-montre-line', 'Montre Line', productImages.koa5, 'Accessoires', '29 000 FCFA', '6 pieces', 'Montre elegante avec bracelet acier et cadran net.', { premium: true }),
      product('koa-chemise-lin', 'Chemise Lin', productImages.koa6, 'Mode', '24 000 FCFA', '10 pieces', 'Chemise respirante, coupe calme et teinte naturelle.'),
      product('koa-portefeuille-nova', 'Portefeuille Nova', productImages.koa7, 'Accessoires', '14 500 FCFA', 'En stock', 'Portefeuille compact, cuir souple et rangement clair.', { certified: true }),
      product('koa-parfum-bois', 'Parfum Bois', productImages.koa8, 'Lifestyle', '31 000 FCFA', '5 pieces', 'Signature boisee douce, flacon sobre et tenue longue.', { premium: true }),
    ],
  },
  {
    id: 'maison-talia',
    name: 'Maison Talia',
    city: 'Yaounde',
    accountType: 'professional',
    certifiedByAp: true,
    premium: false,
    visibilityRank: 84,
    speciality: 'Maison et deco',
    tagline: 'Objets utiles, lignes calmes et presence raffinee pour la maison.',
    cover: productImages.talia1,
    products: [
      product('talia-lampe-mbe', 'Lampe Mbe', productImages.talia1, 'Decoration', '28 000 FCFA', '7 pieces', 'Lampe de table compacte avec abat-jour textile.', { certified: true }),
      product('talia-plateau-sol', 'Plateau Sol', productImages.talia2, 'Maison', '16 000 FCFA', 'En stock', 'Plateau minimal en bois sombre pour service quotidien.'),
      product('talia-vase-lumi', 'Vase Lumi', productImages.talia3, 'Decoration', '19 500 FCFA', '8 pieces', 'Vase ceramique, forme douce et finition satin.', { certified: true }),
      product('talia-coussin-ora', 'Coussin Ora', productImages.talia4, 'Textile', '12 500 FCFA', '15 pieces', 'Coussin textile epais, confortable et facile a associer.'),
      product('talia-cadre-eka', 'Cadre Eka', productImages.talia5, 'Decoration', '18 000 FCFA', '5 pieces', 'Cadre mural sobre pour une ambiance chaleureuse.'),
      product('talia-set-cafe', 'Set Cafe', productImages.talia6, 'Cuisine', '22 000 FCFA', '6 sets', 'Service cafe elegant, format compact et belles finitions.'),
      product('talia-panier-ndop', 'Panier Ndop', productImages.talia7, 'Rangement', '13 000 FCFA', 'En stock', 'Panier tresse pratique pour salon, bureau ou chambre.'),
      product('talia-miroir-zen', 'Miroir Zen', productImages.talia8, 'Decoration', '34 000 FCFA', '3 pieces', 'Miroir mural rond, rendu doux et cadre discret.'),
    ],
  },
  {
    id: 'studio-noma',
    name: 'Studio Noma',
    city: 'Bafoussam',
    accountType: 'professional',
    certifiedByAp: false,
    premium: true,
    visibilityRank: 91,
    speciality: 'Tech et mobilite',
    tagline: 'Accessoires tech fiables, service vendeur rapide et selection bien organisee.',
    cover: productImages.noma1,
    products: [
      product('noma-power-slim', 'Power Slim 20K', productImages.noma1, 'Tech', '24 000 FCFA', '12 pieces', 'Batterie externe fine, charge stable et design mat.', { premium: true }),
      product('noma-stand-lux', 'Stand Lux', productImages.noma2, 'Tech', '9 500 FCFA', 'En stock', 'Support telephone pliable pour bureau ou boutique.'),
      product('noma-airbuds', 'Airbuds Noma', productImages.noma3, 'Audio', '27 000 FCFA', '8 pieces', 'Ecouteurs sans fil, boitier compact et son clair.', { premium: true }),
      product('noma-watch-pro', 'Watch Pro', productImages.noma4, 'Wearable', '39 000 FCFA', '5 pieces', 'Montre connectee sobre avec suivi quotidien.', { premium: true }),
      product('noma-speaker-mini', 'Speaker Mini', productImages.noma5, 'Audio', '21 500 FCFA', '9 pieces', 'Enceinte bluetooth compacte, basse nette et autonomie fiable.'),
      product('noma-clavier-slate', 'Clavier Slate', productImages.noma6, 'Bureau', '32 000 FCFA', '4 pieces', 'Clavier silencieux, format bureau et toucher stable.'),
      product('noma-case-armor', 'Case Armor', productImages.noma7, 'Mobile', '7 500 FCFA', 'En stock', 'Coque renforcie, prise en main fine et look premium.'),
      product('noma-cable-fast', 'Cable Fast', productImages.noma8, 'Mobile', '5 000 FCFA', 'En stock', 'Cable rapide, gaine solide et connecteur renforce.'),
    ],
  },
  {
    id: 'sawa-market',
    name: 'Sawa Market',
    city: 'Limbe',
    accountType: 'professional',
    certifiedByAp: false,
    premium: false,
    visibilityRank: 73,
    speciality: 'Bien-etre et epicerie fine',
    tagline: 'Produits simples, naturels et accessibles pour une boutique vivante.',
    cover: productImages.sawa1,
    products: [
      product('sawa-savon-karite', 'Savon Karite', productImages.sawa1, 'Bien-etre', '4 500 FCFA', 'En stock', 'Savon naturel doux, parfum leger et usage quotidien.'),
      product('sawa-serum-vert', 'Serum Vert', productImages.sawa2, 'Soin', '13 500 FCFA', '10 pieces', 'Serum visage leger pour routine simple et propre.'),
      product('sawa-the-gingembre', 'The Gingembre', productImages.sawa3, 'Epicerie', '6 500 FCFA', 'En stock', 'Infusion epicee, boite elegante et gout intense.'),
      product('sawa-miel-foret', 'Miel Foret', productImages.sawa4, 'Epicerie', '8 500 FCFA', '12 pots', 'Miel local, texture ronde et parfum naturel.'),
      product('sawa-cafe-moka', 'Cafe Moka', productImages.sawa5, 'Epicerie', '7 500 FCFA', '15 paquets', 'Cafe moulu aromatique pour filtre ou presse.'),
      product('sawa-lotion-coco', 'Lotion Coco', productImages.sawa6, 'Soin', '11 000 FCFA', '9 pieces', 'Lotion hydratante au fini doux et non gras.'),
      product('sawa-epices-ndole', 'Epices Ndole', productImages.sawa7, 'Cuisine', '3 500 FCFA', 'En stock', 'Melange parfume pour cuisine locale et plats rapides.'),
      product('sawa-coffret-douceur', 'Coffret Douceur', productImages.sawa8, 'Cadeaux', '18 500 FCFA', '6 coffrets', 'Coffret cadeau avec soins et gourmandises selectionnes.'),
    ],
  },
];

export const independentSellers = [
  {
    id: 'mila-select',
    name: 'Mila Select',
    city: 'Douala',
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
    id: 'conv-maison-talia',
    sellerName: 'Maison Talia',
    product: 'Lampe Mbe',
    unread: 1,
    status: 'Reconnu AP',
    messages: [
      { id: 'm1', from: 'seller', text: 'La lampe est disponible avec emballage protege.' },
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
