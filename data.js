/* =============================================================
   Costco Family List — shared data layer ("the database")
   -------------------------------------------------------------
   One canonical catalog used by both index.html (select) and
   list.html (shop), plus a compact URL encoder so shared links
   stay short. No backend required — everything is encoded into
   a ~30-character code carried in the link.
   ============================================================= */
(function (root) {
  'use strict';

  /* ---- Catalog -------------------------------------------------
     Categories are listed in a logical "food type" order for the
     person SELECTING items. Each category has a stable key, EN/PT
     names, a zone emoji, and its items (EN/PT).
     IMPORTANT: never reorder existing items/categories — the URL
     code maps to positions here. Add new items at the END of a
     category, and new categories at the END of the list.
  --------------------------------------------------------------- */
  var CATALOG = [
    { key: 'bars', emoji: '🥜', en: 'Protein Bars & Nuts', pt: 'Barras e Castanhas', items: [
      { en: 'Work Bars', pt: 'Barrinhas Trabalho' },
      { en: 'Fiber Bars (Chocolate)', pt: 'Barra cereal chocolate' },
      { en: 'Rice Krispies Bars', pt: 'Barrinha Rice Krispies' },
      { en: 'Kirkland Protein Bar', pt: 'Barra Proteína Kirkland' },
      { en: 'Pumpkin Seeds', pt: 'Sementes abóbora' },
      { en: 'Cashews', pt: 'Castanhas' },
      { en: 'Raisins', pt: 'Uvas passas' },
      { en: 'Sesame Seeds', pt: 'Gergelim' }
    ]},
    { key: 'bakery', emoji: '🥖', en: 'Bakery', pt: 'Padaria', items: [
      { en: 'Cake', pt: 'Bolo' },
      { en: 'Ginger Cookies', pt: 'Ginger Cookies' },
      { en: 'Small Oat Muffins', pt: 'Bolinho aveia' },
      { en: 'Hot Dog Buns', pt: 'Pão hot dog' },
      { en: 'Whole Wheat Tortillas', pt: 'Tortillas integral' },
      { en: 'Sandwich Bread', pt: 'Pão Sanduíche' },
      { en: 'Texas Bread (2 packs)', pt: 'Pão Texas (2 pacotes)' },
      { en: 'Frozen Croissants', pt: 'Croissant congelados' },
      { en: 'Frozen Breads', pt: 'Pães congelados' }
    ]},
    { key: 'meat', emoji: '🥩', en: 'Meat & Deli', pt: 'Carnes', items: [
      { en: 'Smoked Turkey Breast', pt: 'Peito Peru defumado' },
      { en: 'Bacon', pt: 'Bacon' },
      { en: 'Chicken Thighs', pt: 'Coxas Frango' },
      { en: 'Ground Beef', pt: 'Carne Moída' },
      { en: 'Tilapia', pt: 'Tilápia' }
    ]},
    { key: 'produce', emoji: '🍎', en: 'Fruits & Vegetables', pt: 'Frutas e Vegetais', items: [
      { en: 'Lemon', pt: 'Limão' },
      { en: 'Apples', pt: 'Maçã' },
      { en: 'Bananas', pt: 'Banana' },
      { en: 'Tangerines', pt: 'Tangerina' },
      { en: 'Papaya', pt: 'Mamão' },
      { en: 'Prunes', pt: 'Ameixas' },
      { en: 'Yellow Potatoes (8)', pt: 'Batata amarela (8)' },
      { en: 'Sweet Potatoes (6)', pt: 'Batata doce (6)' },
      { en: 'Carrots (4)', pt: 'Cenoura (4)' },
      { en: 'Beets (2)', pt: 'Beterraba (2)' },
      { en: 'Pumpkin', pt: 'Jerimum' },
      { en: 'Cassava', pt: 'Macaxeira' },
      { en: 'Red Onions (2)', pt: 'Cebola roxa (2)' },
      { en: 'Corn', pt: 'Milho' }
    ]},
    { key: 'cheese', emoji: '🧀', en: 'Cheese', pt: 'Queijos', items: [
      { en: 'Goat Cheese', pt: 'Queijo cabra' },
      { en: 'Feta Cheese', pt: 'Queijo fetta' },
      { en: 'Coalho Cheese', pt: 'Queijo coalho' }
    ]},
    { key: 'freshveg', emoji: '🥦', en: 'Fresh Vegetables', pt: 'Vegetais Frescos', items: [
      { en: 'Mushrooms', pt: 'Cogumelos' },
      { en: 'Cucumber', pt: 'Pepino' },
      { en: 'Tomatoes', pt: 'Tomates' },
      { en: 'Cherry Tomatoes', pt: 'Tomates cerejas' },
      { en: 'Bell Peppers', pt: 'Pimentão' },
      { en: 'Broccoli', pt: 'Brócolis' },
      { en: 'Avocado', pt: 'Abacate' },
      { en: 'Brussels Sprouts', pt: 'Couve Bruxelas' },
      { en: 'Asparagus', pt: 'Aspargos' },
      { en: 'Red Cabbage', pt: 'Couve roxa' },
      { en: 'Garlic', pt: 'Alho' },
      { en: 'Spinach', pt: 'Espinafre' }
    ]},
    { key: 'dairy', emoji: '🥛', en: 'Milk & Eggs', pt: 'Leite e Ovos', items: [
      { en: 'Milk', pt: 'Leite' },
      { en: 'Yogurt', pt: 'Iogurte' },
      { en: 'Greek Yogurt', pt: 'Iogurte grego' },
      { en: 'Kids Yogurt', pt: 'Iogurte Infantil' },
      { en: 'Butter', pt: 'Manteiga' },
      { en: 'Ghee', pt: 'Manteiga terra' },
      { en: 'Coconut Oil', pt: 'Óleo coco' },
      { en: 'Heavy Cream', pt: 'Creme leite' },
      { en: 'Eggs (2 packs)', pt: 'Ovos (2 pacotes)' },
      { en: 'Sliced Cheese', pt: 'Queijo fatias' },
      { en: 'Cheese', pt: 'Queijo' },
      { en: 'Cream Cheese LIGHT', pt: 'Cream cheese LIGHT' },
      { en: 'Grated Cheese', pt: 'Queijo ralado' },
      { en: 'Hummus', pt: 'Hummus' }
    ]},
    { key: 'cleaning', emoji: '🧻', en: 'Cleaning & Paper', pt: 'Limpeza e Papel', items: [
      { en: 'Lysol Wipes', pt: 'Lenços Lysol' },
      { en: 'Toilet Bowl Cleaner', pt: 'Limpador vaso' },
      { en: 'Clorox Spray', pt: 'Spray Clorox' },
      { en: 'Windex', pt: 'Windex' },
      { en: 'Dawn Dish Soap', pt: 'Detergente dawn' },
      { en: 'Dish Gloves', pt: 'Luvas' },
      { en: 'Sponges', pt: 'Esponjas' },
      { en: 'Duster Refills', pt: 'Refil espanador' },
      { en: 'Laundry Detergent', pt: 'Sabão roupas' },
      { en: 'Scent Boosters', pt: 'Pedrinhas cheirosas' },
      { en: 'Floor Wipes', pt: 'Lenços chão' },
      { en: 'Kitchen Cloth', pt: 'Paninho pia' },
      { en: 'Hand Soap', pt: 'Sabonete líquido' },
      { en: 'Aluminum Foil', pt: 'Papel alumínio' },
      { en: 'Toilet Paper', pt: 'Papel higiênico' },
      { en: 'Paper Towels', pt: 'Papel toalha' },
      { en: 'Plastic Wrap', pt: 'Papel filme' },
      { en: 'White Trash Bags', pt: 'Sacos brancos' },
      { en: 'Black Trash Bags', pt: 'Sacos pretos' },
      { en: 'Organic Bags', pt: 'Sacos orgânicos' }
    ]},
    { key: 'snacks', emoji: '🍿', en: 'Snacks', pt: 'Lanches', items: [
      { en: 'Que Pasa Chips', pt: 'Que Pasa Chips' },
      { en: 'Pringles', pt: 'Pringles' },
      { en: 'Goldfish', pt: 'Goldfish' },
      { en: 'Red Box Cookies', pt: 'Biscoito vermelho' },
      { en: 'Lotus Cookies', pt: 'Biscoito Lotus' },
      { en: 'Oreos', pt: 'Oreo' },
      { en: 'Maria Cookies', pt: 'Bolacha Maria' },
      { en: 'School Cakes', pt: 'Bolinho escola' }
    ]},
    { key: 'frozen', emoji: '🧊', en: 'Frozen', pt: 'Congelados', items: [
      { en: 'Frozen Corn', pt: 'Milho congelado' },
      { en: 'Frozen Fries', pt: 'Batata frita' },
      { en: 'Frozen Strawberries', pt: 'Morangos' },
      { en: 'Chicken Nuggets', pt: 'Nuggets' },
      { en: 'Cheese Bread', pt: 'Pão queijo' },
      { en: 'Pizza', pt: 'Pizza calabresa' }
    ]},
    { key: 'oils', emoji: '🫒', en: 'Oils', pt: 'Óleos', items: [
      { en: 'Olive Oil', pt: 'Azeite' },
      { en: 'Vinegar', pt: 'Vinagre' },
      { en: 'Mayonnaise', pt: 'Maionese' },
      { en: 'Ketchup', pt: 'Ketchup' },
      { en: 'Mustard', pt: 'Mostarda' },
      { en: 'Tomato Sauce', pt: 'Molho tomate' },
      { en: 'Soy Sauce', pt: 'Shoyu' }
    ]},
    { key: 'canned', emoji: '🥫', en: 'Canned', pt: 'Enlatados', items: [
      { en: 'Canned Tuna', pt: 'Atum lata' }
    ]},
    { key: 'spices', emoji: '🧂', en: 'Spices', pt: 'Temperos', items: [
      { en: 'Sea Salt', pt: 'Sal marinho' },
      { en: 'Garlic Granulated', pt: 'Alho granulado' },
      { en: 'Paprika', pt: 'Páprica' },
      { en: 'Thyme', pt: 'Tomilho' },
      { en: 'Lemon Pepper', pt: 'Lemon Pepper' },
      { en: 'Ginger', pt: 'Gengibre pó' },
      { en: 'Turmeric', pt: 'Cúrcuma' },
      { en: 'Knorr', pt: 'Knorr' },
      { en: 'Black Pepper', pt: 'Pimenta reino' },
      { en: 'Oregano', pt: 'Orégano' },
      { en: 'Cinnamon', pt: 'Canela' },
      { en: 'Green Onions', pt: 'Cebolinha' },
      { en: 'Fines Herbes', pt: 'Ervas finas' }
    ]},
    { key: 'bathroom', emoji: '🚿', en: 'Bathroom', pt: 'Higiene', items: [
      { en: 'Shampoo', pt: 'Shampoo' },
      { en: 'Conditioner', pt: 'Condicionador' },
      { en: 'Bar Soap', pt: 'Sabonetes' },
      { en: 'Body Lotion', pt: 'Hidratante' },
      { en: 'Toothpaste', pt: 'Pasta dentes' },
      { en: 'Kids Toothpaste', pt: 'Pasta Infantil' },
      { en: 'Dental Floss', pt: 'Fio dental' },
      { en: 'Mouthwash', pt: 'Enxaguante' },
      { en: 'Wet Wipes', pt: 'Lenço umedecido' },
      { en: 'Sanitary Pads', pt: 'Absorvente' }
    ]},
    { key: 'vitamins', emoji: '💊', en: 'Vitamins', pt: 'Vitaminas', items: [
      { en: 'Vitamin B12', pt: 'Vitamina B12' },
      { en: 'Magnesium', pt: 'Magnésio' },
      { en: 'Zinc', pt: 'Zinco' },
      { en: 'Omega-3', pt: 'Ômega' },
      { en: 'Vitamin D', pt: 'Vitamina D' },
      { en: 'Vitamin C', pt: 'Vitamina C' },
      { en: "Children's Multivitamin", pt: 'Polivitamínico infantil' }
    ]},
    { key: 'kids', emoji: '🧸', en: 'Kids Items', pt: 'Itens Infantis', items: [
      { en: 'Farinha Láctea', pt: 'Farinha Láctea' },
      { en: 'Kids Cereal', pt: 'Cereal Infantil' },
      { en: 'Apple Juice', pt: 'Suco maçã escola' }
    ]},
    { key: 'pasta', emoji: '🍝', en: 'Pasta & Grains', pt: 'Massas e Grãos', items: [
      { en: 'Pasta', pt: 'Macarrão' },
      { en: 'Brown Rice', pt: 'Arroz integral' },
      { en: 'Quinoa', pt: 'Quinoa' },
      { en: 'White Rice', pt: 'Arroz branco' },
      { en: 'Oats', pt: 'Aveia' },
      { en: 'Flour', pt: 'Farinha trigo' },
      { en: 'Corn Starch', pt: 'Amido milho' },
      { en: 'Baking Soda', pt: 'Bicarbonato' },
      { en: 'Baking Powder', pt: 'Fermento' },
      { en: 'Popcorn', pt: 'Pipoca' },
      { en: 'Corn Couscous', pt: 'Cuscuz' },
      { en: 'Tapioca', pt: 'Tapioca' }
    ]},
    { key: 'beverages', emoji: '☕', en: 'Beverages', pt: 'Bebidas', items: [
      { en: 'Coffee', pt: 'Café' },
      { en: 'Decaf Instant Coffee', pt: 'Café descafeinado' },
      { en: 'Decaf Ground Coffee', pt: 'Nescafé descafeinado' },
      { en: 'Chamomile Tea', pt: 'Chá camomila' },
      { en: 'Orange Juice', pt: 'Suco laranja' },
      { en: 'Sparkling Water', pt: 'Água gás' },
      { en: 'Zero Soda', pt: 'Refrigerante ZERO' }
    ]},
    { key: 'sweets', emoji: '🍰', en: 'Sweets', pt: 'Doces', items: [
      { en: 'Cheese Bread', pt: 'Pão queijo' },
      { en: 'Ice Cream', pt: 'Sorvete' },
      { en: 'Strawberry Jam', pt: 'Geleia morango' },
      { en: 'Pancake Mix', pt: 'Panqueca' },
      { en: 'Maple Syrup', pt: 'Maple Syrup' },
      { en: 'Dulce de Leche', pt: 'Doce leite' },
      { en: 'Condensed Milk', pt: 'Leite condensado' },
      { en: 'Honey', pt: 'Mel' },
      { en: 'Granola', pt: 'Granola' },
      { en: 'Demerara Sugar', pt: 'Açúcar demerara' },
      { en: 'White Sugar', pt: 'Açúcar branco' },
      { en: 'Hot Chocolate', pt: 'Chocolate quente' },
      { en: 'Stevia', pt: 'Stevia' }
    ]}
  ];

  /* ---- Optimized Costco Ancaster shopping route ----------------
     Costco Ancaster (100 Legend Court) is a standard-format
     warehouse with Bakery, Fresh Deli/Meat and Fresh Produce
     departments (per Costco's public warehouse listing); no floor
     map is published. This order blends the standard Costco
     counterclockwise traffic pattern with the route inferred from
     the owner's own proven sequence:
       • fresh perimeter first (bakery → deli/meat → cheese →
         produce → dairy), with cheese moved next to the deli and
         the two produce groups kept together to cut zig-zag;
       • frozen pulled up beside dairy so all cold items are picked
         in one pass (less backtracking, better cold-chain);
       • a single straight sweep of the centre dry-grocery aisles;
       • bulk paper/household and health & beauty last, near the
         checkout.
     Values are category keys — edit this array after checking the
     real aisle path on the ground.
  --------------------------------------------------------------- */
  var ROUTE_KEYS = [
    'bars', 'bakery', 'meat', 'cheese', 'produce', 'freshveg', 'dairy', 'frozen',
    'snacks', 'pasta', 'canned', 'oils', 'spices', 'sweets', 'beverages', 'kids',
    'cleaning', 'bathroom', 'vitamins'
  ];

  /* ---- Derived lookups ----------------------------------------- */
  var FLAT = [];   // global index -> { gi, cat, item, key, en, pt }
  var ID_TO_GI = {};
  (function build() {
    var gi = 0;
    for (var c = 0; c < CATALOG.length; c++) {
      var cat = CATALOG[c];
      for (var i = 0; i < cat.items.length; i++) {
        var entry = { gi: gi, cat: c, item: i, key: cat.key, en: cat.items[i].en, pt: cat.items[i].pt };
        FLAT.push(entry);
        ID_TO_GI['en-' + c + '-' + i] = gi;
        ID_TO_GI['pt-' + c + '-' + i] = gi;
        gi++;
      }
    }
  })();
  var N = FLAT.length;

  var ROUTE_POS = {};   // category index -> position in walk order
  (function () {
    var keyToCat = {};
    for (var c = 0; c < CATALOG.length; c++) keyToCat[CATALOG[c].key] = c;
    for (var r = 0; r < ROUTE_KEYS.length; r++) {
      if (ROUTE_KEYS[r] in keyToCat) ROUTE_POS[keyToCat[ROUTE_KEYS[r]]] = r;
    }
    // any category missing from the route falls to the end, in catalog order
    for (var c2 = 0; c2 < CATALOG.length; c2++) {
      if (!(c2 in ROUTE_POS)) ROUTE_POS[c2] = ROUTE_KEYS.length + c2;
    }
  })();

  /* ---- base64url over byte arrays (no btoa/atob dependency) ----- */
  var B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  function bytesToB64u(bytes) {
    var out = '', i;
    for (i = 0; i + 2 < bytes.length; i += 3) {
      var n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
      out += B64[(n >> 18) & 63] + B64[(n >> 12) & 63] + B64[(n >> 6) & 63] + B64[n & 63];
    }
    var rem = bytes.length - i;
    if (rem === 1) {
      var a = bytes[i] << 16;
      out += B64[(a >> 18) & 63] + B64[(a >> 12) & 63];
    } else if (rem === 2) {
      var b = (bytes[i] << 16) | (bytes[i + 1] << 8);
      out += B64[(b >> 18) & 63] + B64[(b >> 12) & 63] + B64[(b >> 6) & 63];
    }
    return out;
  }
  function b64uToBytes(str) {
    var lookup = {}, i;
    for (i = 0; i < B64.length; i++) lookup[B64[i]] = i;
    var bytes = [];
    for (i = 0; i < str.length; i += 4) {
      var c0 = lookup[str[i]], c1 = lookup[str[i + 1]];
      var c2 = lookup[str[i + 2]], c3 = lookup[str[i + 3]];
      if (c0 === undefined || c1 === undefined) break;
      bytes.push(((c0 << 2) | (c1 >> 4)) & 255);
      if (c2 !== undefined) bytes.push(((c1 << 4) | (c2 >> 2)) & 255);
      if (c3 !== undefined) bytes.push(((c2 << 6) | c3) & 255);
    }
    return bytes;
  }

  /* ---- Encode / decode a selection -----------------------------
     encode(ids, qtys) -> short code string
       ids  : array of catalog ids ("en-5-0" / "pt-5-0")
       qtys : optional map id -> quantity (defaults to 1)
     decode(code) -> array of { gi, cat, item, key, en, pt, qty }
  --------------------------------------------------------------- */
  var VERSION = 1;
  function encode(ids, qtys) {
    qtys = qtys || {};
    var maskLen = Math.ceil(N / 8);
    var mask = new Array(maskLen);
    for (var m = 0; m < maskLen; m++) mask[m] = 0;
    var overrides = [];
    for (var k = 0; k < ids.length; k++) {
      var gi = ID_TO_GI[ids[k]];
      if (gi === undefined) continue;
      mask[gi >> 3] |= (1 << (gi & 7));
      var q = parseInt(qtys[ids[k]], 10);
      if (q && q !== 1) overrides.push({ gi: gi, q: Math.max(1, Math.min(255, q)) });
    }
    var bytes = [VERSION].concat(mask);
    bytes.push(overrides.length & 255);
    for (var o = 0; o < overrides.length; o++) {
      bytes.push((overrides[o].gi >> 8) & 255, overrides[o].gi & 255, overrides[o].q & 255);
    }
    return bytesToB64u(bytes);
  }
  function decode(code) {
    var out = [];
    if (!code) return out;
    var bytes = b64uToBytes(code);
    if (!bytes.length || bytes[0] !== VERSION) return out;
    var maskLen = Math.ceil(N / 8);
    var qtyMap = {};
    var p = 1 + maskLen;
    var oc = bytes[p] || 0; p += 1;
    for (var i = 0; i < oc; i++) {
      var gi = ((bytes[p] || 0) << 8) | (bytes[p + 1] || 0);
      qtyMap[gi] = bytes[p + 2] || 1;
      p += 3;
    }
    for (var g = 0; g < N; g++) {
      if (bytes[1 + (g >> 3)] & (1 << (g & 7))) {
        var f = FLAT[g];
        out.push({ gi: g, cat: f.cat, item: f.item, key: f.key, en: f.en, pt: f.pt, qty: qtyMap[g] || 1 });
      }
    }
    return out;
  }

  /* ---- Custom (free-text) items, only added to a link when used */
  function encodeCustom(arr) {
    if (!arr || !arr.length) return '';
    var json = JSON.stringify(arr);
    var bytes = [];
    for (var i = 0; i < json.length; i++) {
      var cp = json.charCodeAt(i);
      if (cp < 128) { bytes.push(cp); }
      else if (cp < 2048) { bytes.push(192 | (cp >> 6), 128 | (cp & 63)); }
      else { bytes.push(224 | (cp >> 12), 128 | ((cp >> 6) & 63), 128 | (cp & 63)); }
    }
    return bytesToB64u(bytes);
  }
  function decodeCustom(code) {
    if (!code) return [];
    try {
      var bytes = b64uToBytes(code), str = '', i = 0;
      while (i < bytes.length) {
        var b = bytes[i++];
        if (b < 128) { str += String.fromCharCode(b); }
        else if (b < 224) { str += String.fromCharCode(((b & 31) << 6) | (bytes[i++] & 63)); }
        else { str += String.fromCharCode(((b & 15) << 12) | ((bytes[i++] & 63) << 6) | (bytes[i++] & 63)); }
      }
      var arr = JSON.parse(str);
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  /* ---- Per-item emoji (keyword match, first hit wins) ---------- */
  var EMOJI = [
    ['protein bar', '💪'], ['kirkland protein', '💪'],
    ['bar', '🍫'], ['barr', '🍫'], ['cereal chocolate', '🍫'], ['rice krispies', '🍫'],
    ['pumpkin seed', '🌻'], ['semente', '🌻'], ['sesame', '🌰'], ['gergelim', '🌰'],
    ['cashew', '🥜'], ['castanha', '🥜'], ['raisin', '🍇'], ['uvas', '🍇'],
    ['cake', '🎂'], ['bolo', '🎂'], ['cookie', '🍪'], ['muffin', '🧁'], ['bolinho', '🧁'],
    ['hot dog', '🌭'], ['tortilla', '🌯'], ['croissant', '🥐'],
    ['bread', '🍞'], ['pão', '🍞'], ['pães', '🍞'],
    ['turkey', '🦃'], ['peru', '🦃'], ['bacon', '🥓'],
    ['chicken thigh', '🍗'], ['coxas', '🍗'], ['ground beef', '🥩'], ['carne', '🥩'],
    ['tilapia', '🐟'], ['tilápia', '🐟'],
    ['lemon', '🍋'], ['limão', '🍋'], ['apple', '🍎'], ['maçã', '🍎'], ['banana', '🍌'],
    ['tangerine', '🍊'], ['tangerina', '🍊'], ['papaya', '🥭'], ['mamão', '🥭'],
    ['prune', '🍑'], ['ameixa', '🍑'], ['potato', '🥔'], ['batata', '🥔'],
    ['carrot', '🥕'], ['cenoura', '🥕'], ['beet', '🟣'], ['beterraba', '🟣'],
    ['pumpkin', '🎃'], ['jerimum', '🎃'], ['cassava', '🥔'], ['macaxeira', '🥔'],
    ['onion', '🧅'], ['cebola', '🧅'], ['corn', '🌽'], ['milho', '🌽'],
    ['goat cheese', '🧀'], ['queijo', '🧀'], ['cheese', '🧀'],
    ['mushroom', '🍄'], ['cogumelo', '🍄'], ['cucumber', '🥒'], ['pepino', '🥒'],
    ['cherry tomato', '🍅'], ['tomato', '🍅'], ['tomate', '🍅'],
    ['pepper', '🫑'], ['pimentão', '🫑'], ['broccoli', '🥦'], ['brócolis', '🥦'],
    ['avocado', '🥑'], ['abacate', '🥑'], ['brussel', '🥬'], ['couve', '🥬'],
    ['asparagus', '🌿'], ['aspargo', '🌿'], ['garlic', '🧄'], ['alho', '🧄'],
    ['spinach', '🥬'], ['espinafre', '🥬'],
    ['milk', '🥛'], ['leite', '🥛'], ['yogurt', '🥛'], ['iogurte', '🥛'],
    ['butter', '🧈'], ['manteiga', '🧈'], ['ghee', '🧈'], ['coconut', '🥥'], ['coco', '🥥'],
    ['cream', '🥛'], ['creme', '🥛'], ['egg', '🥚'], ['ovo', '🥚'], ['hummus', '🫘'],
    ['wipe', '🧻'], ['lenço', '🧻'], ['cleaner', '🧼'], ['limpador', '🧼'],
    ['clorox', '🧴'], ['windex', '🧴'], ['dish soap', '🧴'], ['detergente', '🧴'],
    ['glove', '🧤'], ['luva', '🧤'], ['sponge', '🧽'], ['esponja', '🧽'],
    ['laundry', '🧺'], ['sabão', '🧺'], ['scent', '🌸'], ['pedrinha', '🌸'],
    ['cloth', '🧽'], ['paninho', '🧽'], ['hand soap', '🧼'], ['sabonete líquido', '🧼'],
    ['foil', '🟫'], ['alumínio', '🟫'], ['toilet paper', '🧻'], ['papel higiênico', '🧻'],
    ['paper towel', '🧻'], ['papel toalha', '🧻'], ['plastic wrap', '📦'], ['papel filme', '📦'],
    ['bag', '🛍️'], ['saco', '🛍️'],
    ['chip', '🍟'], ['pringles', '🥔'], ['goldfish', '🐠'], ['oreo', '🍪'],
    ['fries', '🍟'], ['batata frita', '🍟'], ['nugget', '🍗'], ['pizza', '🍕'],
    ['strawberr', '🍓'], ['morango', '🍓'], ['olive oil', '🫒'], ['azeite', '🫒'],
    ['vinegar', '🧴'], ['vinagre', '🧴'], ['mayo', '🥚'], ['maionese', '🥚'],
    ['ketchup', '🍅'], ['mustard', '🌭'], ['mostarda', '🌭'],
    ['tomato sauce', '🥫'], ['molho', '🥫'], ['soy', '🍶'], ['shoyu', '🍶'],
    ['tuna', '🐟'], ['atum', '🐟'], ['salt', '🧂'], ['sal ', '🧂'],
    ['paprika', '🌶️'], ['páprica', '🌶️'], ['thyme', '🌿'], ['tomilho', '🌿'],
    ['lemon pepper', '🌶️'], ['ginger', '🫚'], ['gengibre', '🫚'],
    ['turmeric', '🟡'], ['cúrcuma', '🟡'], ['knorr', '🧂'],
    ['black pepper', '🌶️'], ['pimenta', '🌶️'], ['oregano', '🌿'], ['orégano', '🌿'],
    ['cinnamon', '🟤'], ['canela', '🟤'], ['green onion', '🌿'], ['cebolinha', '🌿'],
    ['herb', '🌿'], ['erva', '🌿'],
    ['shampoo', '🧴'], ['conditioner', '🧴'], ['condicionador', '🧴'],
    ['bar soap', '🧼'], ['sabonete', '🧼'], ['lotion', '🧴'], ['hidratante', '🧴'],
    ['toothpaste', '🪥'], ['pasta', '🪥'], ['floss', '🦷'], ['fio dental', '🦷'],
    ['mouthwash', '🪥'], ['enxaguante', '🪥'], ['pad', '🩹'], ['absorvente', '🩹'],
    ['vitamin', '💊'], ['vitamina', '💊'], ['magnesium', '💊'], ['magnésio', '💊'],
    ['zinc', '💊'], ['zinco', '💊'], ['omega', '💊'], ['ômega', '💊'],
    ['multivitamin', '💊'], ['polivitam', '💊'],
    ['farinha láctea', '🍼'], ['cereal', '🥣'], ['juice', '🧃'], ['suco', '🧃'],
    ['rice', '🍚'], ['arroz', '🍚'], ['quinoa', '🌾'], ['oat', '🌾'], ['aveia', '🌾'],
    ['flour', '🌾'], ['farinha', '🌾'], ['starch', '🌽'], ['amido', '🌽'],
    ['baking soda', '🧂'], ['bicarbonato', '🧂'], ['baking powder', '🧂'], ['fermento', '🧂'],
    ['popcorn', '🍿'], ['pipoca', '🍿'], ['couscous', '🌾'], ['cuscuz', '🌾'],
    ['tapioca', '⚪'], ['macarrão', '🍝'],
    ['coffee', '☕'], ['café', '☕'], ['nescafé', '☕'], ['tea', '🍵'], ['chá', '🍵'],
    ['water', '💧'], ['água', '💧'], ['soda', '🥤'], ['refrigerante', '🥤'],
    ['ice cream', '🍨'], ['sorvete', '🍨'], ['jam', '🍓'], ['geleia', '🍓'],
    ['pancake', '🥞'], ['panqueca', '🥞'], ['maple', '🍁'], ['syrup', '🍯'],
    ['dulce', '🍮'], ['doce leite', '🍮'], ['condensed', '🥫'], ['condensado', '🥫'],
    ['honey', '🍯'], ['mel', '🍯'], ['granola', '🥣'],
    ['sugar', '🍬'], ['açúcar', '🍬'], ['chocolate', '🍫'], ['stevia', '🌿']
  ];
  function itemEmoji(name) {
    if (!name) return '';
    var n = name.toLowerCase();
    for (var i = 0; i < EMOJI.length; i++) {
      if (n.indexOf(EMOJI[i][0]) !== -1) return EMOJI[i][1];
    }
    return '🛒';
  }

  /* ---- Public API ---------------------------------------------- */
  var COSTCO = {
    catalog: CATALOG,
    flat: FLAT,
    count: N,
    routeKeys: ROUTE_KEYS,
    routePos: function (catIndex) { return ROUTE_POS[catIndex]; },
    name: function (entry, lang) { return lang === 'pt' ? entry.pt : entry.en; },
    catName: function (catIndex, lang) { var c = CATALOG[catIndex]; return c ? (lang === 'pt' ? c.pt : c.en) : ''; },
    catEmoji: function (catIndex) { var c = CATALOG[catIndex]; return c ? c.emoji : '🛒'; },
    id: function (catIndex, itemIndex, lang) { return (lang || 'en') + '-' + catIndex + '-' + itemIndex; },
    idToGi: function (id) { return ID_TO_GI[id]; },
    encode: encode,
    decode: decode,
    encodeCustom: encodeCustom,
    decodeCustom: decodeCustom,
    itemEmoji: itemEmoji
  };

  root.COSTCO = COSTCO;
  if (typeof module !== 'undefined' && module.exports) module.exports = COSTCO;
})(typeof window !== 'undefined' ? window : this);
