const figmaStyleImages = {
  fashionBag: require('../../assets/products/figma-style/fashion-bag.jpg'),
  fashionDress: require('../../assets/products/figma-style/fashion-dress.jpg'),
  fashionGlasses: require('../../assets/products/figma-style/fashion-glasses.jpg'),
  fashionJacket: require('../../assets/products/figma-style/fashion-jacket.jpg'),
  fashionPerfume: require('../../assets/products/figma-style/fashion-perfume.jpg'),
  fashionShirt: require('../../assets/products/figma-style/fashion-shirt.jpg'),
  fashionSneaker: require('../../assets/products/figma-style/fashion-sneaker-red.jpg'),
  fashionWatch: require('../../assets/products/figma-style/fashion-watch.jpg'),
  techCamera: require('../../assets/products/figma-style/tech-camera.jpg'),
  techEarbuds: require('../../assets/products/figma-style/tech-earbuds.jpg'),
  techHeadphones: require('../../assets/products/figma-style/tech-headphones.jpg'),
  techKeyboard: require('../../assets/products/figma-style/tech-keyboard.jpg'),
  techLaptop: require('../../assets/products/figma-style/tech-laptop.jpg'),
  techPhone: require('../../assets/products/figma-style/tech-phone.jpg'),
  techSpeaker: require('../../assets/products/figma-style/tech-speaker.jpg'),
  techWatch: require('../../assets/products/figma-style/tech-watch.jpg'),
  foodPlate: require('../../assets/products/figma-style/food-plate.jpg'),
  foodPlate2: require('../../assets/products/figma-style/food-plate-2.jpg'),
  foodPlate3: require('../../assets/products/figma-style/food-plate-3.jpg'),
  foodGrill: require('../../assets/products/figma-style/food-grill.jpg'),
  foodDrink: require('../../assets/products/figma-style/food-drink.jpg'),
  homeKitchen: require('../../assets/products/figma-style/home-kitchen.jpg'),
  tv: require('../../assets/products/figma-style/tv.jpg'),
  screen: require('../../assets/products/figma-style/ecran.jpg'),
  airConditioner: require('../../assets/products/figma-style/Climatisation.jpg'),
  fridge: require('../../assets/products/figma-style/Frigo Compacte.jpg'),
  projector: require('../../assets/products/figma-style/projecteur.jpg'),
  regulator: require('../../assets/products/figma-style/regulateur.jpg'),
  fan: require('../../assets/products/figma-style/ventilateur.jpg'),
  pouletDg: require('../../assets/products/figma-style/poulet dg.jpg'),
  beignetsHaricots: require('../../assets/products/figma-style/Beignets haricots.jpg'),
};

const shopLogoImages = {
  atelierKoa: require('../../assets/shops/logos/atelier-koa.png'),
  taliaCloset: require('../../assets/shops/logos/talia-closet.png'),
  studioNoma: require('../../assets/shops/logos/studio-noma.png'),
  sonyStore: require('../../assets/shops/logos/sony-store.png'),
  sawaDeals: require('../../assets/shops/logos/sawa-deals.png'),
  bijouxMboa: require('../../assets/shops/logos/bijoux-mboa.png'),
  maisonOud: require('../../assets/shops/logos/maison-oud.png'),
  cuisineSika: require('../../assets/shops/logos/cuisine-sika.png'),
  visionHome: require('../../assets/shops/logos/vision-home.png'),
  mboaKids: require('../../assets/shops/logos/mboa-kids.png'),
  saveursMboa: require('../../assets/shops/logos/saveurs-mboa.png'),
};

const normalize = (value) => String(value ?? '').toLowerCase();

export const getProductVisual = ({ title, category } = {}) => {
  const value = `${normalize(title)} ${normalize(category)}`;
  if (value.match(/bissap|drink|jus/)) return figmaStyleImages.foodDrink;
  if (value.match(/beignet|haricot/)) return figmaStyleImages.beignetsHaricots;
  if (value.match(/poulet dg/)) return figmaStyleImages.pouletDg;
  if (value.match(/poisson|attieke/)) return figmaStyleImages.foodGrill;
  if (value.match(/eru|koki/)) return figmaStyleImages.foodPlate2;
  if (value.match(/achu|sauce jaune/)) return figmaStyleImages.foodPlate3;
  if (value.match(/ndole|riz crevette|aliment|repas/)) return figmaStyleImages.foodPlate;
  if (value.match(/frigo/)) return figmaStyleImages.fridge;
  if (value.match(/climatiseur/)) return figmaStyleImages.airConditioner;
  if (value.match(/ventilateur/)) return figmaStyleImages.fan;
  if (value.match(/regulateur|régulateur/)) return figmaStyleImages.regulator;
  if (value.match(/projecteur/)) return figmaStyleImages.projector;
  if (value.match(/sony tv|bravia|oled|ecran|écran/)) return figmaStyleImages.screen;
  if (value.match(/tv|television|televisions|support tv/)) return figmaStyleImages.tv;
  if (value.match(/marmite|poele|couteau|assiette|verre|bouilloire|epice|planche|thermos|gourde|blender|mixeur|ustensile|electro/)) return figmaStyleImages.homeKitchen;
  if (value.match(/playstation|ps5|dualsense|console|gaming|manette/)) return figmaStyleImages.techKeyboard;
  if (value.match(/electromenager/)) return figmaStyleImages.homeKitchen;
  if (value.match(/phone|xperia|smartphone|telephone|tablette/)) return figmaStyleImages.techPhone;
  if (value.match(/laptop|ordinateur/)) return figmaStyleImages.techLaptop;
  if (value.match(/camera/)) return figmaStyleImages.techCamera;
  if (value.match(/casque|headset|headphone/)) return figmaStyleImages.techHeadphones;
  if (value.match(/earbuds|airbuds/)) return figmaStyleImages.techEarbuds;
  if (value.match(/speaker|soundbar|audio/)) return figmaStyleImages.techSpeaker;
  if (value.match(/clavier|keyboard|router|power|gadget|gaming|playstation|dualsense/)) return figmaStyleImages.techKeyboard;
  if (value.match(/watch|montre/)) return figmaStyleImages.fashionWatch;
  if (value.match(/sneaker|runner|sandale|basket|chaussure/)) return figmaStyleImages.fashionSneaker;
  if (value.match(/robe|dress/)) return figmaStyleImages.fashionDress;
  if (value.match(/shirt|tee|chemise|pyjama|vetement/)) return figmaStyleImages.fashionShirt;
  if (value.match(/jacket|veste|jupe|foulard/)) return figmaStyleImages.fashionJacket;
  if (value.match(/perfume|parfum|oud|musc|brume|huile|savon|encens|diffuseur/)) return figmaStyleImages.fashionPerfume;
  if (value.match(/lunette|glasses/)) return figmaStyleImages.fashionGlasses;
  if (value.match(/bague|bracelet|collier|chaine|parure|broche|bijoux/)) return figmaStyleImages.fashionWatch;
  if (value.match(/bag|sac/)) return figmaStyleImages.fashionBag;
  return figmaStyleImages.fashionBag;
};

export const getShopVisuals = (shop = {}) => {
  const name = normalize(shop.name);
  const logo =
    name.includes('atelier koa') ? shopLogoImages.atelierKoa :
    name.includes('talia') ? shopLogoImages.taliaCloset :
    name.includes('noma') ? shopLogoImages.studioNoma :
    name.includes('sony') ? shopLogoImages.sonyStore :
    name.includes('sawa') ? shopLogoImages.sawaDeals :
    name.includes('bijoux') ? shopLogoImages.bijouxMboa :
    name.includes('oud') ? shopLogoImages.maisonOud :
    name.includes('sika') ? shopLogoImages.cuisineSika :
    name.includes('vision') ? shopLogoImages.visionHome :
    name.includes('kids') ? shopLogoImages.mboaKids :
    name.includes('saveurs') ? shopLogoImages.saveursMboa :
    shopLogoImages.sawaDeals;

  return {
    logo,
    cover: getProductVisual({ title: shop.name, category: shop.category }),
  };
};

export const categories = [
  { id: 'all', label: 'Toutes', icon: '🛍️', match: null },
  { id: 'clothes', label: 'Vetements', icon: '👗', match: 'Vetements' },
  { id: 'gadgets', label: 'Gadgets', icon: '🔌', match: 'Gadgets' },
  { id: 'accessories', label: 'Accessoires', icon: '👜', match: 'Accessoires' },
  { id: 'phones', label: 'Telephones', icon: '📱', match: 'Telephones' },
  { id: 'tv', label: 'TV', icon: '📺', match: 'Televisions' },
  { id: 'audio', label: 'Audio', icon: '🎧', match: 'Audio' },
  { id: 'gaming', label: 'Gaming', icon: '🎮', match: 'Gaming' },
  { id: 'food', label: 'Repas', icon: '🍲', match: 'Alimentation' },
  { id: 'beauty', label: 'Parfums', icon: '🌸', match: 'Parfums' },
  { id: 'jewelry', label: 'Bijoux', icon: '💍', match: 'Bijoux' },
  { id: 'appliances', label: 'Electro', icon: '🧊', match: 'Electromenager' },
  { id: 'home', label: 'Maison', icon: '🍽️', match: 'Ustensiles' },
  { id: 'shoes', label: 'Chaussures', icon: '👟', match: 'Chaussures' },
];

export const paymentMethods = [
  { id: 'orange-money', label: 'Orange Money', short: 'OM', icon: '🟧', fee: '1%', color: '#FF7900', detail: 'Paiement mobile avec validation OTP.' },
  { id: 'mtn-momo', label: 'MTN MoMo', short: 'MoMo', icon: '🟨', fee: '1%', color: '#F8C400', detail: 'Paiement mobile simple et rapide.' },
  { id: 'card', label: 'Carte bancaire', short: 'Card', icon: '💳', fee: '2%', color: '#2F3A56', detail: 'Paiement sécurisé via Stripe Checkout.' },
  { id: 'wallet', label: 'Wallet Camazones', short: 'Wallet', icon: '👛', fee: '0%', color: '#1E8E5A', detail: 'Utilise ton solde Camazones.' },
];

export const accountTypes = [
  { id: 'professional', label: 'Boutique professionnelle', description: 'Vitrine, catalogue, badges et meilleure visibilite.' },
  { id: 'independent', label: 'Client independant', description: 'Achete et vend souvent sans vitrine publique complete.' },
];
