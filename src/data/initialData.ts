import { Product, Coupon, Order, BannerAnnouncement, UserProfile } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // 1. MAKHANA
  {
    id: 'makhana-himalayan-salt',
    name: 'Himalayan Pink Salt Makhana',
    hindiName: 'सेंधा नमक मखाना',
    category: 'Makhana',
    shortDescription: 'Slow-roasted jumbo foxnuts tossed in pure desi ghee and mineral-rich Himalayan pink salt.',
    fullDescription: 'Indulge in guilt-free crunch with Aayusha Swad’s Himalayan Pink Salt Makhana. Hand-harvested from pristine lotus ponds, these premium jumbo foxnuts are gently roasted in small batches using pure A2 Desi Cow Ghee and seasoned with stone-ground Himalayan pink rock salt. Rich in antioxidants, calcium, and plant protein, it is the quintessential healthy snack for all ages.',
    price: 199,
    originalPrice: 249,
    weight: '150g',
    weightOptions: [
      { weight: '150g', price: 199, originalPrice: 249, inStock: true },
      { weight: '300g (Pack of 2)', price: 379, originalPrice: 498, inStock: true },
      { weight: '500g Mega Saver', price: 599, originalPrice: 799, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 142,
    images: [
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=800&auto=format&fit=crop'
    ],
    inStock: true,
    isBestSeller: true,
    isFeatured: true,
    badge: 'Bestseller',
    ingredients: ['Premium Foxnuts (Phool Makhana)', 'Pure Desi Cow Ghee', 'Himalayan Pink Salt', 'Black Pepper Extract'],
    nutritionFacts: {
      servingSize: '30g',
      calories: '110 kcal',
      protein: '3.2g',
      carbohydrates: '18.4g',
      sugar: '0g',
      fat: '2.5g',
      dietaryFiber: '2.1g'
    },
    storageInstructions: 'Store in an airtight container in a cool, dry place away from direct sunlight.',
    shelfLife: '6 Months from date of packaging',
    tags: ['Gluten-Free', 'Pure Ghee', 'Roasted', 'Low Calorie', 'High Protein'],
    reviews: [
      {
        id: 'rev-1',
        userName: 'Pooja Sharma',
        rating: 5,
        date: '2026-09-18',
        comment: 'The crunch is unbelievably fresh! You can taste the genuine desi ghee aroma without it feeling greasy. Re-ordering the 500g pack!',
        verifiedPurchase: true,
        helpfulCount: 24
      },
      {
        id: 'rev-2',
        userName: 'Vikramaditya Roy',
        rating: 5,
        date: '2026-09-12',
        comment: 'Properly sorted large size foxnuts. Not a single unpopped hard kernel. 10/10 quality.',
        verifiedPurchase: true,
        helpfulCount: 18
      }
    ]
  },
  {
    id: 'makhana-peri-peri',
    name: 'Spicy Peri Peri Roasted Makhana',
    hindiName: 'पेरी पेरी मसाला मखाना',
    category: 'Makhana',
    shortDescription: 'Zesty African bird’s eye chili blend infused with traditional Indian spices on crispy foxnuts.',
    fullDescription: 'For those who love an invigorating punch of spice! Our Spicy Peri Peri Makhana is prepared with our proprietary spice rub containing Kashmiri red chili, crushed garlic, oregano, and dried lemon zest. Lightly crisped to golden perfection, it offers an explosion of tangy, fiery satisfaction without artificial food coloring or MSG.',
    price: 219,
    originalPrice: 269,
    weight: '150g',
    weightOptions: [
      { weight: '150g', price: 219, originalPrice: 269, inStock: true },
      { weight: '300g (Pack of 2)', price: 410, originalPrice: 538, inStock: true },
      { weight: '500g Mega Saver', price: 649, originalPrice: 849, inStock: true }
    ],
    rating: 4.8,
    reviewCount: 98,
    images: [
      'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop'
    ],
    inStock: true,
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: true,
    badge: 'Trending Spicy',
    ingredients: ['Phool Makhana', 'Cold Pressed Groundnut Oil', 'Peri Peri Spice Blend', 'Garlic Powder', 'Kashmiri Chili', 'Lemon Powder', 'Sea Salt'],
    nutritionFacts: {
      servingSize: '30g',
      calories: '115 kcal',
      protein: '3.0g',
      carbohydrates: '19.0g',
      sugar: '0.4g',
      fat: '2.8g',
      dietaryFiber: '2.0g'
    },
    storageInstructions: 'Keep sealed in moisture-proof pouch after opening.',
    shelfLife: '6 Months from packaging',
    tags: ['Spicy', 'Vegan', 'Roasted', 'No MSG'],
    reviews: [
      {
        id: 'rev-3',
        userName: 'Aakash Verma',
        rating: 5,
        date: '2026-09-25',
        comment: 'Perfect evening tea snack. Tangy, zesty, and super light on the stomach.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'makhana-pudina-mint',
    name: 'Desi Ghee Pudina Crunch Makhana',
    hindiName: 'पुदीना मसाला मखाना',
    category: 'Makhana',
    shortDescription: 'Refreshing garden mint leaves and black salt roasted in pure cow ghee for soothing crunch.',
    fullDescription: 'Cooling hill mint meets nutty roasted foxnuts. A refreshing blend made from sun-dried mint leaves, roasted cumin, and black rock salt tossed in golden desi ghee. Perfect as an office snack, road trip companion, or teatime refresher.',
    price: 209,
    originalPrice: 259,
    weight: '150g',
    weightOptions: [
      { weight: '150g', price: 209, originalPrice: 259, inStock: true },
      { weight: '300g (Pack of 2)', price: 395, originalPrice: 518, inStock: true }
    ],
    rating: 4.7,
    reviewCount: 64,
    images: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop'
    ],
    inStock: true,
    badge: 'Fresh Mint',
    ingredients: ['Foxnuts', 'Pure Cow Ghee', 'Dry Mint Leaves', 'Black Salt', 'Roasted Cumin', 'Amchur (Dry Mango)'],
    nutritionFacts: {
      servingSize: '30g',
      calories: '112 kcal',
      protein: '3.1g',
      carbohydrates: '18.2g',
      sugar: '0.2g',
      fat: '2.6g',
      dietaryFiber: '2.2g'
    },
    storageInstructions: 'Store in a cool dry pantry.',
    shelfLife: '6 Months',
    tags: ['Mint', 'Digestive', 'Pure Ghee'],
    reviews: []
  },

  // 2. THEKUA
  {
    id: 'thekua-traditional-khajoor',
    name: 'Traditional Desi Ghee Khajoor Thekua',
    hindiName: 'पारंपरिक खजूर ठेकुआ (शुद्ध देशी घी)',
    category: 'Thekua',
    shortDescription: 'Authentic heirloom recipe hand-pressed in wooden molds with pure cow ghee, whole wheat & cardamom.',
    fullDescription: 'Aayusha Swad brings you the venerated traditional sweetness of Eastern India. Our Traditional Desi Ghee Thekua is handcrafted using stone-milled whole wheat flour (Chakki Atta), fragrant green cardamom, fennel seeds (Saunf), and dried grated coconut, kneaded generously with Pure Desi Cow Ghee and molded into heritage patterns before slow-frying to a royal caramel-golden hue.',
    price: 280,
    originalPrice: 350,
    weight: '400g',
    weightOptions: [
      { weight: '400g Box', price: 280, originalPrice: 350, inStock: true },
      { weight: '800g (Pack of 2)', price: 530, originalPrice: 700, inStock: true },
      { weight: '1.2kg Family Pack', price: 780, originalPrice: 1050, inStock: true }
    ],
    rating: 5.0,
    reviewCount: 310,
    images: [
      'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop'
    ],
    inStock: true,
    isBestSeller: true,
    isFeatured: true,
    badge: 'Heritage Recipe',
    ingredients: ['Stone-Ground Whole Wheat Flour', 'Pure Desi Cow Ghee', 'Raw Cane Sugar', 'Fennel Seeds (Saunf)', 'Green Cardamom (Elaichi)', 'Dry Coconut Slices'],
    nutritionFacts: {
      servingSize: '50g (approx 2 pcs)',
      calories: '228 kcal',
      protein: '4.1g',
      carbohydrates: '32.5g',
      sugar: '11.8g',
      fat: '9.2g',
      dietaryFiber: '3.4g'
    },
    storageInstructions: 'Store in a dry container. Does not require refrigeration.',
    shelfLife: '45 Days from baking/frying',
    tags: ['Traditional', 'Pure Ghee', 'No Palm Oil', 'Handmade', 'Festive Special'],
    reviews: [
      {
        id: 'rev-4',
        userName: 'Sunita Mishra',
        rating: 5,
        date: '2026-09-28',
        comment: 'Brings back childhood memories of Chhath Puja prasad. The crunch, the fennel flavor, and the rich desi ghee aroma are 100% authentic.',
        verifiedPurchase: true,
        helpfulCount: 52
      },
      {
        id: 'rev-5',
        userName: 'Rajnish Kumar',
        rating: 5,
        date: '2026-09-20',
        comment: 'Crispy on the outside, tender crumb inside. Far superior to commercial market sweets.',
        verifiedPurchase: true,
        helpfulCount: 37
      }
    ]
  },
  {
    id: 'thekua-organic-jaggery',
    name: 'Organic Gur (Jaggery) & Saunf Thekua',
    hindiName: 'देसी गुड़ और सौंफ का ठेकुआ',
    category: 'Thekua',
    shortDescription: 'Refined sugar-free traditional Thekua sweetened naturally with organic Desi Jaggery.',
    fullDescription: 'Made for conscious indulgence, our Organic Jaggery Thekua replaces white sugar entirely with unrefined mineral-rich desi Gur. Enhanced with roasted fennel seeds, crushed dry fruits, and pure desi cow ghee, it has a rich caramel, earthy note that melts deliciously on the tongue.',
    price: 310,
    originalPrice: 380,
    weight: '400g',
    weightOptions: [
      { weight: '400g Box', price: 310, originalPrice: 380, inStock: true },
      { weight: '800g (Pack of 2)', price: 590, originalPrice: 760, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 185,
    images: [
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=800&auto=format&fit=crop'
    ],
    inStock: true,
    isBestSeller: true,
    isFeatured: true,
    badge: '100% Jaggery',
    ingredients: ['Whole Wheat Flour (Chakki Atta)', 'Pure Organic Jaggery (Desi Gur)', 'Pure Desi Ghee', 'Fennel Seeds', 'Dry Ginger Powder (Saunth)', 'Coconut Kernels'],
    nutritionFacts: {
      servingSize: '50g',
      calories: '215 kcal',
      protein: '3.8g',
      carbohydrates: '34.0g',
      sugar: '10.2g (Natural Gur)',
      fat: '8.4g',
      dietaryFiber: '3.5g'
    },
    storageInstructions: 'Store in cool dry place away from moisture.',
    shelfLife: '45 Days',
    tags: ['Sugar-Free', 'Organic Jaggery', 'Iron Rich', 'Pure Ghee'],
    reviews: [
      {
        id: 'rev-6',
        userName: 'Meenakshi Iyer',
        rating: 5,
        date: '2026-09-22',
        comment: 'Loved that there is zero white sugar. The subtle hint of saunth and saunf is delightful.',
        verifiedPurchase: true
      }
    ]
  },

  // 3. COOKIES
  {
    id: 'cookies-pista-elaichi-nankhatai',
    name: 'Pistachio Elaichi Royal Nankhatai',
    hindiName: 'शाही पिस्ता इलायची नानखटाई',
    category: 'Cookies',
    shortDescription: 'Melt-in-mouth traditional Indian shortbread cookies enriched with Iranian pistachios and green cardamom.',
    fullDescription: 'Nankhatai is India’s royal tea cookie, perfected over generations. At Aayusha Swad, our master bakers cream pure golden desi ghee and powdered raw sugar until fluffy, blending in fine gram flour (Besan), semolina (Sooji), crushed green cardamom, and top with toasted pistachio slivers. Every bite crumbles softly in your mouth with an intoxicating aroma.',
    price: 240,
    originalPrice: 299,
    weight: '300g',
    weightOptions: [
      { weight: '300g Tin', price: 240, originalPrice: 299, inStock: true },
      { weight: '600g (Pack of 2)', price: 450, originalPrice: 598, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 167,
    images: [
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop'
    ],
    inStock: true,
    isBestSeller: true,
    isFeatured: true,
    badge: 'Melt-in-Mouth',
    ingredients: ['Whole Wheat Flour', 'Bengal Gram Flour (Besan)', 'Pure Cow Ghee', 'Raw Sugar', 'Roasted Pistachios', 'Green Cardamom', 'Nutmeg'],
    nutritionFacts: {
      servingSize: '25g (2 cookies)',
      calories: '135 kcal',
      protein: '2.5g',
      carbohydrates: '16.0g',
      sugar: '5.2g',
      fat: '7.1g',
      dietaryFiber: '1.2g'
    },
    storageInstructions: 'Keep in an airtight jar to preserve delicate crumb texture.',
    shelfLife: '3 Months',
    tags: ['Nankhatai', 'Desi Ghee', 'Chai Partner', 'Artisanal'],
    reviews: [
      {
        id: 'rev-7',
        userName: 'Ananya Deshmukh',
        rating: 5,
        date: '2026-09-24',
        comment: 'Literally melts on the tongue! The aroma of elaichi and ghee when opening the tin was heavenly.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cookies-roasted-jeera',
    name: 'Roasted Jeera (Cumin) Chai Biscuits',
    hindiName: 'भुना जीरा नमकीन बिस्कुट',
    category: 'Cookies',
    shortDescription: 'Crisp savory-sweet tea biscuits infused with freshly pan-roasted cumin seeds and rock salt.',
    fullDescription: 'The quintessential Indian tea stall nostalgia elevated to premium elegance! These handcrafted biscuits strike the harmonious balance between subtle sweetness and savory roasted cumin with hints of pink salt. Baked slow to achieve a delicate, crumbly snap perfect for dunking in your morning masala chai.',
    price: 195,
    originalPrice: 245,
    weight: '300g',
    weightOptions: [
      { weight: '300g Box', price: 195, originalPrice: 245, inStock: true },
      { weight: '600g (Pack of 2)', price: 369, originalPrice: 490, inStock: true }
    ],
    rating: 4.8,
    reviewCount: 114,
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop'
    ],
    inStock: true,
    badge: 'Chai Companion',
    ingredients: ['Stone Ground Atta', 'Roasted Whole Cumin Seeds (Jeera)', 'Desi Butter', 'Raw Sugar', 'Rock Salt', 'Fennel Powder'],
    nutritionFacts: {
      servingSize: '25g',
      calories: '120 kcal',
      protein: '2.1g',
      carbohydrates: '17.2g',
      sugar: '3.1g',
      fat: '5.2g',
      dietaryFiber: '1.4g'
    },
    storageInstructions: 'Store in a dry tin away from humidity.',
    shelfLife: '4 Months',
    tags: ['Savory', 'Jeera', 'Tea Time', 'Handcrafted'],
    reviews: []
  },
  {
    id: 'cookies-desi-ghee-atta',
    name: 'Desi Ghee Handcrafted Atta Cookies',
    hindiName: 'देसी घी आटा कुकीज',
    category: 'Cookies',
    shortDescription: 'Wholesome whole wheat cookies with crunchy almond flakes and unrefined brown sugar.',
    fullDescription: 'Goodness of 100% whole grain wheat flour churned with farmhouse butter and desi ghee. Studded with sliced California almonds and sweetened with unrefined Muscovado sugar. Wholesome, rich in fiber, and free from any palm oil, artificial emulsifiers, or preservatives.',
    price: 220,
    originalPrice: 275,
    weight: '300g',
    weightOptions: [
      { weight: '300g Box', price: 220, originalPrice: 275, inStock: true },
      { weight: '600g (Pack of 2)', price: 410, originalPrice: 550, inStock: true }
    ],
    rating: 4.8,
    reviewCount: 88,
    images: [
      'https://images.unsplash.com/photo-1548848221-0c2e497ed557?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop'
    ],
    inStock: true,
    badge: '100% Atta',
    ingredients: ['100% Whole Wheat Atta', 'Pure Cow Ghee', 'Raw Brown Sugar', 'Sliced Almonds', 'Milk Solids', 'Cardamom Powder'],
    nutritionFacts: {
      servingSize: '30g',
      calories: '142 kcal',
      protein: '2.8g',
      carbohydrates: '18.1g',
      sugar: '4.8g',
      fat: '6.9g',
      dietaryFiber: '2.0g'
    },
    storageInstructions: 'Keep in cool dry airtight container.',
    shelfLife: '4 Months',
    tags: ['Zero Maida', 'Whole Wheat', 'Almonds', 'Pure Ghee'],
    reviews: []
  },

  // 4. NAMAK PAARE
  {
    id: 'namak-paare-ajwain-crisp',
    name: 'Crispy Ajwain Namak Paare',
    hindiName: 'कुरकुरा अजवाइन नमक पारे',
    category: 'Namak Paare',
    shortDescription: 'Classic diamond-cut savory diamonds seasoned with digestive carom seeds and pure rock salt.',
    fullDescription: 'Nothing epitomizes authentic Indian celebrations like a bowl of golden diamond-cut Namak Paare! Kneaded meticulously with freshly hand-crushed carom seeds (Ajwain), black peppercorns, and pure ghee for a crisp, layered flaky texture (Khasta). Every piece snaps delightfully with zero oily aftertaste.',
    price: 175,
    originalPrice: 220,
    weight: '350g',
    weightOptions: [
      { weight: '350g Pouch', price: 175, originalPrice: 220, inStock: true },
      { weight: '700g (Pack of 2)', price: 330, originalPrice: 440, inStock: true },
      { weight: '1kg Mega Pack', price: 470, originalPrice: 620, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 240,
    images: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=800&auto=format&fit=crop'
    ],
    inStock: true,
    isBestSeller: true,
    isFeatured: true,
    badge: 'Khasta Crisp',
    ingredients: ['Wheat Flour', 'Pure Desi Ghee (Moyen)', 'Carom Seeds (Ajwain)', 'Crushed Black Peppercorns', 'Rock Salt', 'Filtered Groundnut Oil for crisping'],
    nutritionFacts: {
      servingSize: '30g',
      calories: '138 kcal',
      protein: '3.1g',
      carbohydrates: '17.8g',
      sugar: '0.1g',
      fat: '6.2g',
      dietaryFiber: '1.5g'
    },
    storageInstructions: 'Store in an airtight container to keep that crisp snap intact.',
    shelfLife: '90 Days',
    tags: ['Khasta', 'Ajwain', 'Namkeen', 'Festive Favorite'],
    reviews: [
      {
        id: 'rev-8',
        userName: 'Suresh Singhania',
        rating: 5,
        date: '2026-09-15',
        comment: 'Incredibly crisp and fresh! The ajwain flavor is strong and authentic, just like homemade snacks made during Diwali.',
        verifiedPurchase: true,
        helpfulCount: 41
      }
    ]
  },
  {
    id: 'namak-paare-methi-mathri',
    name: 'Kasuri Methi Mathri Bites',
    hindiName: 'कसूरी मेथी मठरी बाइट्स',
    category: 'Namak Paare',
    shortDescription: 'Bite-sized flaky round mathri infused with aromatic Nagauri fenugreek leaves and black pepper.',
    fullDescription: 'Prepared using shade-dried aromatic Kasuri Methi from Rajasthan, these bite-sized savory disks are pierced lightly before slow frying in small batches. Layered, savory, with a subtle herbal bitterness and peppery heat that elevates evening chai into an aristocratic feast.',
    price: 185,
    originalPrice: 230,
    weight: '350g',
    weightOptions: [
      { weight: '350g Pouch', price: 185, originalPrice: 230, inStock: true },
      { weight: '700g (Pack of 2)', price: 350, originalPrice: 460, inStock: true }
    ],
    rating: 4.8,
    reviewCount: 132,
    images: [
      'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop'
    ],
    inStock: true,
    isBestSeller: false,
    isNewArrival: true,
    badge: 'Aromatic Methi',
    ingredients: ['Whole Wheat Flour', 'Nagauri Dried Fenugreek (Kasuri Methi)', 'Desi Ghee', 'Cumin Seeds', 'Black Peppercorns', 'Sea Salt'],
    nutritionFacts: {
      servingSize: '30g',
      calories: '140 kcal',
      protein: '3.0g',
      carbohydrates: '17.2g',
      sugar: '0.2g',
      fat: '6.5g',
      dietaryFiber: '1.8g'
    },
    storageInstructions: 'Store in airtight box.',
    shelfLife: '90 Days',
    tags: ['Kasuri Methi', 'Mathri', 'Crispy', 'Snack'],
    reviews: []
  },
  {
    id: 'namak-paare-masala-nimki',
    name: 'Spicy Masala Nimki Ribbons',
    hindiName: 'चटपटा मसाला निमकी',
    category: 'Namak Paare',
    shortDescription: 'Crunchy spiral savory ribbons dusted with tangy chaat masala, amchur, and roasted spices.',
    fullDescription: 'Crisp savory ribbons infused with kalonji (nigella seeds) and dusted with our secret street-style chatpata spice mix. Every bite delivers a mouth-watering combination of tanginess, cumin, and satisfying crunch.',
    price: 180,
    originalPrice: 225,
    weight: '350g',
    weightOptions: [
      { weight: '350g Pouch', price: 180, originalPrice: 225, inStock: true },
      { weight: '700g (Pack of 2)', price: 340, originalPrice: 450, inStock: true }
    ],
    rating: 4.7,
    reviewCount: 95,
    images: [
      'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop'
    ],
    inStock: true,
    badge: 'Chatpata',
    ingredients: ['Wheat Flour', 'Nigella Seeds (Kalonji)', 'Chaat Masala', 'Amchur', 'Desi Ghee', 'Pink Salt', 'Hing (Asafoetida)'],
    nutritionFacts: {
      servingSize: '30g',
      calories: '136 kcal',
      protein: '2.9g',
      carbohydrates: '18.0g',
      sugar: '0.3g',
      fat: '6.0g',
      dietaryFiber: '1.4g'
    },
    storageInstructions: 'Keep sealed in pouch.',
    shelfLife: '90 Days',
    tags: ['Nimki', 'Tangy', 'Kalonji', 'Spicy'],
    reviews: []
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'SWAD100',
    discountType: 'flat',
    discountValue: 100,
    minOrderValue: 499,
    description: 'Flat ₹100 OFF on orders above ₹499',
    isActive: true
  },
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 299,
    description: '10% OFF on your first purchase',
    isActive: true
  },
  {
    code: 'FESTIVE20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 999,
    description: 'Festive Special: 20% OFF on orders above ₹999',
    isActive: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'AS-84920',
    trackingNumber: 'DEL-8392019482',
    date: '2026-10-02T14:32:00Z',
    items: [
      {
        id: 'cart-1',
        productId: 'thekua-traditional-khajoor',
        product: INITIAL_PRODUCTS[3],
        selectedWeight: '400g Box',
        price: 280,
        quantity: 2
      },
      {
        id: 'cart-2',
        productId: 'makhana-himalayan-salt',
        product: INITIAL_PRODUCTS[0],
        selectedWeight: '150g',
        price: 199,
        quantity: 1
      }
    ],
    shippingAddress: {
      fullName: 'Abhishek Jaiswal',
      phone: '+91 98765 43210',
      email: 'abhishek@example.com',
      addressLine1: 'Flat 402, Royal Palms Residency',
      addressLine2: 'Linking Road, Bandra West',
      landmark: 'Near Nature Basket',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050'
    },
    subtotal: 759,
    discount: 100,
    deliveryCharge: 0,
    total: 659,
    appliedCoupon: 'SWAD100',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Shipped',
    courierPartner: 'Delhivery Express',
    estimatedDelivery: 'Tomorrow by 4:00 PM',
    statusHistory: [
      {
        status: 'Confirmed',
        timestamp: '2026-10-02T14:35:00Z',
        message: 'Order received and confirmed. Payment verified via UPI.'
      },
      {
        status: 'Processing',
        timestamp: '2026-10-02T16:10:00Z',
        message: 'Fresh snacks packed with love in vacuum seal packaging.'
      },
      {
        status: 'Shipped',
        timestamp: '2026-10-03T09:30:00Z',
        message: 'Dispatched via Delhivery Express. In transit to Mumbai hub.'
      }
    ]
  }
];

export const INITIAL_BANNER: BannerAnnouncement = {
  id: 'b-1',
  text: '✨ Special Launch Offer: Use code SWAD100 for Flat ₹100 OFF on orders above ₹499 | Free Express Delivery across India!',
  linkText: 'Claim Offer',
  linkUrl: '#special-offer',
  couponCode: 'SWAD100',
  isActive: true
};

export const DEMO_USER: UserProfile = {
  id: 'usr-1',
  name: 'Abhishek Jaiswal',
  email: 'abhishek@example.com',
  phone: '+91 98765 43210',
  role: 'customer',
  addresses: [
    {
      fullName: 'Abhishek Jaiswal',
      phone: '+91 98765 43210',
      email: 'abhishek@example.com',
      addressLine1: 'Flat 402, Royal Palms Residency',
      addressLine2: 'Linking Road, Bandra West',
      landmark: 'Near Nature Basket',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050'
    }
  ]
};

export const DEMO_ADMIN: UserProfile = {
  id: 'adm-1',
  name: 'Aayusha Swad Master Admin',
  email: 'admin@aayushaswad.com',
  phone: '+91 99999 88888',
  role: 'admin',
  addresses: []
};

export const FAQS = [
  {
    q: 'What ingredients are used in Aayusha Swad snacks?',
    a: 'We take pride in our uncompromising ingredient standard. All our snacks are prepared using 100% pure cow desi ghee, stone-milled whole wheat grains, organic jaggery, mineral Himalayan pink rock salt, and authentic whole spices like green cardamom, fennel, and ajwain. We never use palm oil, dalda, artificial colors, or chemical preservatives.'
  },
  {
    q: 'How fresh are the products when delivered?',
    a: 'We follow a small-batch fresh kitchen preparation cycle. Snacks are prepared fresh every 48 hours and packaged immediately using high-grade food nitrogen flush packaging that locks in the crispy crunch and aroma without preservatives.'
  },
  {
    q: 'How should I store the snacks once opened?',
    a: 'Transfer the snacks into a clean, dry airtight container or reseal our zip-lock freshness pouch tightly. Keep in a cool, dry place away from direct sunlight and humidity. Refrigeration is not needed for any of our dry snacks.'
  },
  {
    q: 'What are the available pack sizes?',
    a: 'Most snacks are offered in multiple convenient sizes: 150g / 300g / 500g pouches for Makhana; 400g / 800g / 1.2kg gift boxes for Thekua; 300g / 600g tins for Cookies; and 350g / 700g / 1kg packs for Namak Paare.'
  },
  {
    q: 'How long does delivery take across India?',
    a: 'Metro cities receive delivery within 24 to 48 hours via express courier. Tier-2 and Tier-3 cities receive delivery within 3 to 4 business days. You receive live tracking updates on WhatsApp and SMS at every step.'
  },
  {
    q: 'Do you offer bulk orders or corporate gifting?',
    a: 'Yes! We offer customized gift hampers, festive wedding boxes, and corporate snack boxes with custom branding and volume discounts. Please reach out via our Contact page or WhatsApp support for custom bulk quotes.'
  },
  {
    q: 'Can I order custom snacks for special occasions and festivals?',
    a: 'Absolutely. For festivals like Chhath Puja, Diwali, Holi, Rakshabandhan, and Eid, we accept pre-orders for specialized fresh Thekua batches and festive cookie platters prepared under strict traditional rituals.'
  }
];

export const TESTIMONIALS = [
  {
    id: 't-1',
    name: 'Meera Sengupta',
    location: 'Kolkata',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    product: 'Traditional Desi Ghee Thekua',
    quote: 'As someone living away from Bihar, finding authentic Thekua with the exact homemade Khajoor texture seemed impossible until I tried Aayusha Swad. You can smell the pure cow ghee the moment you unseal the box. Simply sensational!'
  },
  {
    id: 't-2',
    name: 'Rajeev Singhal',
    location: 'New Delhi',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    product: 'Himalayan Pink Salt Makhana',
    quote: 'Hands down the crispiest makhana I have bought online. No chewy pieces, uniformly sized, and lightly seasoned with pink salt. My daily 4 PM office craving solver.'
  },
  {
    id: 't-3',
    name: 'Dr. Neha Saxena',
    location: 'Bengaluru',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    product: 'Pistachio Elaichi Royal Nankhatai',
    quote: 'The shortbread melts in your mouth exactly like the old Parsi and royal bakery biscuits. Knowing that it is made with pure desi ghee and whole grains makes guilt-free snacking a joy.'
  },
  {
    id: 't-4',
    name: 'Karan Mehra',
    location: 'Pune',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    product: 'Crispy Ajwain Namak Paare',
    quote: 'Crunchy, flaky, and fragrant with ajwain. My family finished the entire 700g pack over two evening tea sittings. Highly recommended!'
  }
];
