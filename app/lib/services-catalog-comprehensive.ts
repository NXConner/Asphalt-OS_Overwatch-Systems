// Comprehensive Services Catalog - All Services with Detailed Application Methods

export interface ApplicationMethod {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  priceModifier?: number;
}

export interface StencilItem {
  id: string;
  name: string;
  category: 'STANDARD' | 'PREMIUM';
  price: number;
  description: string;
}

export interface PaintProduct {
  id: string;
  name: string;
  pricePerGallon: number;
  coverage: string;
  dryTime: string;
  durability: string;
  features: string[];
}

export interface CurbStopOption {
  id: string;
  type: 'CONCRETE' | 'RUBBER';
  specs: string;
  priceInstalled: number;
  weight: string;
  pros: string[];
  cons: string[];
  bestFor: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'STANDARD' | 'PREMIUM';
  description: string;
  detailedDescription: string;
  includes: string[];
  pricing: {
    basePrice: number;
    unit: 'sq_ft' | 'lin_ft' | 'stall' | 'hour' | 'flat' | 'each';
    minCharge?: number;
  };
  estimatedDuration: string;
  materials: string[];
  warranty: string;
  applicationMethods?: ApplicationMethod[];
  coatOptions?: {
    coats: number;
    pricePerSqFt: number;
    description: string;
    recommendedFor: string;
  }[];
  benefits?: string[];
}

// Stencil Catalog
export const STENCIL_CATALOG: StencilItem[] = [
  { id: 'stencil-handicap', name: 'Handicap Symbol', category: 'STANDARD', price: 45, description: 'ADA-compliant handicap parking symbol' },
  { id: 'stencil-arrow', name: 'Directional Arrow', category: 'STANDARD', price: 35, description: 'Single directional arrow' },
  { id: 'stencil-stopbar', name: 'Stop Bar', category: 'STANDARD', price: 75, description: '12" wide stop bar marking' },
  { id: 'stencil-crosswalk', name: 'Crosswalk', category: 'STANDARD', price: 125, description: 'Standard crosswalk pattern' },
  { id: 'stencil-firelane', name: 'Fire Lane Text', category: 'STANDARD', price: 55, description: 'NO PARKING FIRE LANE text' },
  { id: 'stencil-reserved', name: 'Reserved Parking', category: 'STANDARD', price: 40, description: 'RESERVED text marking' },
  { id: 'stencil-numbers', name: 'Numbers (0-9)', category: 'STANDARD', price: 25, description: 'Individual number stencils' },
  { id: 'stencil-letters', name: 'Letters (A-Z)', category: 'STANDARD', price: 30, description: 'Individual letter stencils' },
  { id: 'stencil-custom-logo', name: 'Custom Logo', category: 'PREMIUM', price: 350, description: 'Custom company logo stencil' },
  { id: 'stencil-company-name', name: 'Company Name', category: 'PREMIUM', price: 300, description: 'Custom company name text' },
  { id: 'stencil-safety', name: 'Safety Message', category: 'PREMIUM', price: 75, description: 'Custom safety messages' },
  { id: 'stencil-specialty', name: 'Specialty Symbol', category: 'PREMIUM', price: 85, description: 'Custom specialty symbols' },
];

// Paint Products Catalog
export const PAINT_CATALOG: PaintProduct[] = [
  {
    id: 'paint-standard-traffic',
    name: 'Standard Traffic Paint',
    pricePerGallon: 45,
    coverage: '200-250 sq ft per gallon',
    dryTime: '20-30 minutes',
    durability: '6-12 months',
    features: ['Water-based', 'VOC compliant', 'Fast drying', 'Available in white/yellow'],
  },
  {
    id: 'paint-high-performance',
    name: 'High-Performance Paint',
    pricePerGallon: 75,
    coverage: '200-250 sq ft per gallon',
    dryTime: '15-20 minutes',
    durability: '12-18 months',
    features: ['Superior adhesion', 'UV resistant', 'High-traffic formula', 'Brighter colors'],
  },
  {
    id: 'paint-reflective',
    name: 'Reflective Paint with Glass Beads',
    pricePerGallon: 95,
    coverage: '200-250 sq ft per gallon',
    dryTime: '25-35 minutes',
    durability: '18-24 months',
    features: ['Glass beads included', 'High nighttime visibility', 'DOT approved', 'All-weather'],
  },
  {
    id: 'paint-fast-dry',
    name: 'Fast-Dry Traffic Paint',
    pricePerGallon: 85,
    coverage: '200-250 sq ft per gallon',
    dryTime: '10-15 minutes',
    durability: '12-18 months',
    features: ['Quick traffic return', 'Low VOC', 'All-weather', 'Excellent adhesion'],
  },
];

// Curb Stop Options
export const CURB_STOP_CATALOG: CurbStopOption[] = [
  {
    id: 'curb-concrete',
    type: 'CONCRETE',
    specs: '6ft L x 9" W x 6" H',
    priceInstalled: 95,
    weight: '275-300 lbs',
    pros: [
      'Extremely durable (20+ year lifespan)',
      'Will not move or shift once installed',
      'Cost-effective long-term solution',
      'No maintenance required',
      'Heavy weight provides stability',
    ],
    cons: [
      'Very heavy (difficult to install/move)',
      'Can crack or chip over time',
      'Harder to remove if relocation needed',
      'Can damage vehicles in hard impacts',
    ],
    bestFor: 'High-traffic commercial areas, permanent installations, budget-conscious projects',
  },
  {
    id: 'curb-rubber',
    type: 'RUBBER',
    specs: '6ft L x 10" W x 4" H',
    priceInstalled: 135,
    weight: '65-75 lbs',
    pros: [
      'Easier to install and relocate',
      'Will not crack or chip',
      'Better vehicle impact absorption',
      'Available in bright yellow for visibility',
      'Made from recycled materials',
      'Flexible in temperature extremes',
    ],
    cons: [
      'Can shift if not properly anchored',
      'Higher upfront cost',
      'May degrade in extreme UV exposure',
      'Requires quality anchoring hardware',
    ],
    bestFor: 'Temporary locations, cold climates, premium appearance, areas requiring relocation flexibility',
  },
];


// Complete Service Catalog
export const SERVICE_CATALOG_COMPREHENSIVE: ServiceItem[] = [
  // ==================== ASPHALT REPAIR & PATCHING ====================
  {
    id: 'std-asphalt-repair',
    name: 'Asphalt Repair & Patching',
    category: 'STANDARD',
    description: 'Professional asphalt repair for potholes and damaged pavement',
    detailedDescription: 'Comprehensive asphalt repair addressing potholes, edge deterioration, alligator cracking, and surface depressions. We remove all damaged material, properly prepare the base, and install new hot mix asphalt compacted to specifications. Our repairs are designed to last and blend seamlessly with existing pavement.',
    includes: [
      'Complete damage assessment',
      'Removal of failed asphalt',
      'Base repair and stabilization',
      'Proper drainage consideration',
      'Hot mix asphalt installation',
      'Multi-pass compaction',
      'Tack coat for proper bonding',
      'Surface leveling and grading',
      'Clean-up and debris removal',
    ],
    pricing: { basePrice: 0.75, unit: 'sq_ft', minCharge: 400 },
    estimatedDuration: '1 day',
    materials: ['Hot mix asphalt', 'Tack coat', 'Aggregate base', 'Edge sealant'],
    warranty: '1 year structural integrity',
  },

  {
    id: 'std-pothole-repair',
    name: 'Pothole Repair Service',
    category: 'STANDARD',
    description: 'Fast, permanent pothole repair solutions',
    detailedDescription: 'Professional pothole repair using hot mix asphalt for permanent fixes or cold patch for temporary/emergency repairs. Our permanent repairs include proper preparation, quality hot mix, and adequate compaction. We offer same-day service for emergency repairs.',
    includes: [
      'Pothole cleaning and preparation',
      'Water and debris removal',
      'Square cutting of edges',
      'Tack coat application',
      'Hot or cold mix installation',
      'Tamping and proper compaction',
      'Surface finishing',
      'Immediate traffic readiness',
    ],
    pricing: { basePrice: 125, unit: 'each', minCharge: 250 },
    estimatedDuration: '2-4 hours',
    materials: ['Hot mix asphalt or cold patch', 'Tack coat', 'Edge sealant'],
    warranty: '1 year (hot mix), 90 days (cold patch)',
  },

  // ==================== CRACK REPAIR ====================
  {
    id: 'std-crack-repair',
    name: 'Professional Crack Sealing',
    category: 'STANDARD',
    description: 'Hot pour rubberized crack repair and sealing',
    detailedDescription: 'Professional crack repair using hot pour rubberized crack sealant that remains flexible through temperature changes. We properly prepare cracks through routing and cleaning, then fill with premium hot-applied sealant. This prevents water infiltration and stops crack growth, dramatically extending pavement life.',
    includes: [
      'Crack routing and preparation',
      'High-pressure air cleaning',
      'Hot pour rubberized sealant application',
      'Sand blotting for immediate traffic',
      'Precise linear foot measurement',
      'Quality control inspection',
      'Weather-appropriate timing',
    ],
    pricing: { basePrice: 2.50, unit: 'lin_ft', minCharge: 250 },
    estimatedDuration: '4-8 hours',
    materials: ['Hot pour rubberized crack sealant', 'Blotter sand', 'Primer (if needed)'],
    warranty: '1 year material and workmanship',
  },

  // ==================== SEALCOATING WITH MULTIPLE APPLICATION METHODS ====================
  {
    id: 'std-sealcoating',
    name: 'Professional Sealcoating',
    category: 'STANDARD',
    description: 'Coal tar or asphalt emulsion sealcoating - Choose your application method and number of coats',
    detailedDescription: 'Protective sealcoating creates a barrier against water, oils, UV rays, and chemicals. Choose from 1, 2, or 3 coat applications and your preferred application method based on your property type, condition, and budget. Our commercial-grade sealant penetrates asphalt pores, prevents oxidation, and extends pavement life by 3-5 years per application cycle.',
    includes: [
      'Thorough power sweeping',
      'Oil spot treatment',
      'Crack filling up to 1/4"',
      'Edge detail work',
      'Your choice of application method',
      'Traffic control setup',
      'Cure time barricading (24-48 hours)',
      'Clean professional lines',
      'Post-application inspection',
    ],
    pricing: { basePrice: 0.14, unit: 'sq_ft', minCharge: 350 },
    estimatedDuration: '1-2 days',
    materials: ['Coal tar or asphalt emulsion', 'Crack filler', 'Sand additive', 'Performance additives'],
    warranty: '1 year workmanship',
    coatOptions: [
      {
        coats: 1,
        pricePerSqFt: 0.10,
        description: 'Single Coat - Economy option for newer pavement',
        recommendedFor: 'New asphalt (1-2 years old), light traffic residential areas, budget-conscious projects, maintenance sealcoating',
      },
      {
        coats: 2,
        pricePerSqFt: 0.14,
        description: 'Two Coats - Standard professional protection (MOST POPULAR)',
        recommendedFor: 'Most residential driveways, commercial properties, asphalt 3-10 years old, moderate traffic areas',
      },
      {
        coats: 3,
        pricePerSqFt: 0.20,
        description: 'Three Coats - Maximum protection for heavy use',
        recommendedFor: 'High-traffic commercial lots, gas stations, truck routes, severely weathered asphalt, industrial properties',
      },
    ],
    applicationMethods: [
      {
        name: 'Professional Spray Application',
        description: 'High-pressure spray equipment applies sealant in uniform, consistent coats',
        pros: [
          'Fastest application method available',
          'Most uniform coverage and appearance',
          'Consistent mil thickness throughout',
          'Professional finish',
          'Best for large commercial areas',
          'Reaches edges and corners easily',
          'Ideal for smooth, even surfaces',
        ],
        cons: [
          'Requires professional spray equipment',
          'Wind conditions can affect application',
          'Overspray concerns near buildings/vehicles',
          'Equipment setup and cleanup time',
          'Not ideal for very rough surfaces',
        ],
        bestFor: 'Large parking lots (5,000+ sq ft), commercial properties, smooth uniform surfaces, properties with open areas',
        priceModifier: 1.0,
      },
      {
        name: 'Squeegee Application',
        description: 'Hand-applied using professional squeegees to work sealant into the pavement surface',
        pros: [
          'Deep penetration into pavement surface',
          'Fills small surface voids and imperfections',
          'No overspray concerns',
          'Better coverage on rough or damaged surfaces',
          'Excellent edge and detail work',
          'More material applied per coat',
          'Perfect for residential driveways',
        ],
        cons: [
          'Slower than spray application',
          'More labor-intensive process',
          'Can leave squeegee marks if not done expertly',
          'Requires highly skilled applicators',
          'Takes longer for large areas',
        ],
        bestFor: 'Residential driveways, small to medium lots, rough or damaged surfaces, areas close to vehicles or buildings',
        priceModifier: 1.15,
      },
      {
        name: 'Brush Application',
        description: 'Applied with professional brushes for small areas and detail work',
        pros: [
          'Excellent for small confined areas',
          'Perfect for repairs and touch-up work',
          'Superior edge and detail work',
          'Works sealant deep into cracks',
          'Minimal equipment requirements',
          'Precision application control',
          'Ideal for tight spaces',
        ],
        cons: [
          'Very slow for large surface areas',
          'Most labor-intensive method',
          'Can show brush stroke patterns',
          'Difficult to achieve uniform thickness',
          'Best used as supplemental method',
          'Not practical for full lot coverage',
        ],
        bestFor: 'Small residential driveways (under 1,000 sq ft), repair patches, edge work, extremely tight spaces, detailed areas',
        priceModifier: 1.25,
      },
      {
        name: 'Hand-Working Method',
        description: 'Combination of squeegee and hand tools to massage sealant into damaged surfaces',
        pros: [
          'Maximum material penetration possible',
          'Excellent for severely rough or damaged surfaces',
          'Fills all surface imperfections',
          'Therapeutic approach for distressed pavement',
          'Custom attention to all problem areas',
          'Best surface preparation integration',
        ],
        cons: [
          'Most labor-intensive method',
          'Slowest application process',
          'Highest cost option',
          'Best reserved for restoration projects',
          'Requires expert craftsmen',
        ],
        bestFor: 'Severely weathered or damaged asphalt, high-end restoration projects, historic properties, premium residential estates',
        priceModifier: 1.35,
      },
    ],
  },

  // ==================== LINE STRIPING WITH DETAILED METHODS ====================
  {
    id: 'std-line-striping',
    name: 'Parking Lot Line Striping',
    category: 'STANDARD',
    description: 'Professional parking lot striping - Choose hand application or machine striping',
    detailedDescription: 'Professional parking lot striping using commercial-grade traffic paint. We provide clear, durable, ADA-compliant markings for parking stalls, handicap spaces, fire lanes, directional arrows, and custom markings. All work meets or exceeds ADA requirements and local regulations. Choose between hand-applied or machine-striped application based on your project size and requirements.',
    includes: [
      'Professional layout and measurement',
      'Surface cleaning and preparation',
      'Standard white or yellow paint',
      '4" line width (adjustable)',
      'ADA-compliant handicap symbols',
      'Directional arrows',
      'Fire lane markings',
      'Stop bars',
      'Quality control inspection',
    ],
    pricing: { basePrice: 70, unit: 'stall', minCharge: 500 },
    estimatedDuration: '1 day',
    materials: ['Traffic paint (white/yellow)', 'Stencils', 'Layout tools', 'Reflective beads (optional)'],
    warranty: '6-12 months fade resistance',
    applicationMethods: [
      {
        name: 'Hand Line Striping',
        description: 'Manual application using hand-held striping tools and rollers',
        pros: [
          'Lower equipment investment required',
          'Good for small projects',
          'Precise control in tight areas',
          'No machine setup time',
          'Excellent for touch-up work',
          'Works in confined spaces',
        ],
        cons: [
          'Very slow application speed',
          'Inconsistent line width possible',
          'Physically demanding',
          'Limited to small projects',
          'Harder to maintain straight lines',
          'Not cost-effective for large lots',
        ],
        bestFor: 'Small parking lots (under 20 spaces), touch-ups and repairs, tight confined areas, budget projects',
        priceModifier: 1.20,
      },
      {
        name: 'Machine Line Striping',
        description: 'Professional striping machines for fast, consistent, perfectly straight lines',
        pros: [
          'Fast and highly efficient',
          'Perfectly consistent line width',
          'Professional appearance',
          'Laser-straight lines',
          'Can handle large projects easily',
          'Cost-effective for medium/large lots',
          'Less physical labor required',
        ],
        cons: [
          'Equipment investment required',
          'Setup and calibration time',
          'Requires skilled machine operator',
          'Minimum job size for efficiency',
          'Less flexible in very tight spaces',
        ],
        bestFor: 'Medium to large lots (20+ spaces), commercial properties, new construction, complete re-striping projects',
        priceModifier: 1.0,
      },
    ],
  },

  // ==================== CURB STOPS ====================
  {
    id: 'std-curb-stops-concrete',
    name: 'Concrete Curb Stop Installation',
    category: 'STANDARD',
    description: 'Heavy-duty concrete parking curb stops (bumpers) - 6ft standard',
    detailedDescription: 'Professional installation of 6-foot concrete parking curb stops (wheel stops). These durable 275-300 lb concrete units provide permanent parking guidance and protection. Ideal for high-traffic commercial areas, they offer 20+ year lifespan with zero maintenance. Each unit is properly positioned, leveled, and secured with rebar spikes or epoxy anchors.',
    includes: [
      'Quality concrete curb stops',
      'Professional positioning and layout',
      'Leveling and alignment',
      'Rebar spike anchoring',
      'Yellow reflective paint (optional)',
      'Reflective tape installation (optional)',
      'Site cleanup',
    ],
    pricing: { basePrice: 95, unit: 'each', minCharge: 285 },
    estimatedDuration: '2-4 hours',
    materials: ['6ft concrete curb stops (275-300 lbs)', 'Rebar spikes or epoxy', 'Reflective tape (optional)'],
    warranty: '2 years installation',
  },

  {
    id: 'prem-curb-stops-rubber',
    name: 'Rubber Curb Stop Installation (Premium)',
    category: 'PREMIUM',
    description: 'High-visibility recycled rubber curb stops - Easy to install and relocate',
    detailedDescription: 'Premium recycled rubber parking curb stops combining durability with flexibility. These 65-75 lb units are easier to install and relocate than concrete while providing excellent vehicle impact absorption. Available in bright safety yellow with reflective strips for maximum visibility. Made from recycled tires, these eco-friendly stops resist cracking and work perfectly in all climates.',
    includes: [
      'Premium recycled rubber curb stops',
      'Bright yellow high-visibility color',
      'Integrated reflective strips',
      'Professional positioning',
      'Quality anchor bolt installation',
      'Leveling and alignment',
      'Site cleanup',
    ],
    pricing: { basePrice: 135, unit: 'each', minCharge: 405 },
    estimatedDuration: '2-4 hours',
    materials: ['6ft rubber curb stops (65-75 lbs)', 'Anchor bolts and washers', 'Mounting hardware'],
    warranty: '3 years installation and material',
    benefits: [
      'Won\'t crack or chip like concrete',
      'Easier to relocate if needed',
      'Better vehicle impact absorption',
      'Available in high-visibility yellow',
      'Environmentally friendly recycled material',
      'Works in all temperature extremes',
    ],
  },

  // ==================== PREMIUM SERVICES ====================
  {
    id: 'prem-pressure-washing',
    name: 'Professional Pressure Washing',
    category: 'PREMIUM',
    description: 'High-pressure cleaning for optimal surface preparation',
    detailedDescription: 'Professional pressure washing service using commercial hot water pressure washers (3,000+ PSI). This premium service removes oil stains, tire marks, gum, dirt, and contaminants that prevent proper sealant adhesion. Essential for preparing severely soiled surfaces before sealcoating. The thorough cleaning significantly extends the life and performance of sealcoating applications by ensuring maximum adhesion and penetration.',
    includes: [
      'High-pressure hot water washing (3,000+ PSI)',
      'Oil stain treatment and removal',
      'Gum and debris removal',
      'Tire mark elimination',
      'Surface contaminant removal',
      'Enhanced sealant adhesion preparation',
      'Storm drain protection',
      'Complete water recovery and disposal',
      'Pre-wash and post-wash inspection',
    ],
    pricing: { basePrice: 0.10, unit: 'sq_ft', minCharge: 300 },
    estimatedDuration: '4-8 hours',
    materials: ['Hot water pressure washer', 'Industrial degreasers', 'Surface cleaners', 'Environmental containment'],
    warranty: 'N/A - Preparation service',
    benefits: [
      'Removes stubborn oil and tire stains',
      'Dramatically improves sealant adhesion (up to 200%)',
      'Extends sealcoating life by 30-50%',
      'Reveals hidden surface damage for proper repair',
      'Improves overall appearance before sealing',
      'Environmentally responsible water recovery',
      'Reduces future maintenance needs',
    ],
  },

  {
    id: 'prem-sealcoating-plus',
    name: 'Premium Sealcoating Plus',
    category: 'PREMIUM',
    description: 'Premium polymer-modified sealcoating with advanced additives - Superior protection',
    detailedDescription: 'Our premium sealcoating service uses enhanced polymer-modified coal tar emulsion with proprietary performance additives. This superior formula provides up to 50% longer life than standard sealcoating. Includes comprehensive surface preparation, extended crack repair (up to 1/2"), and three full coats for maximum protection. Perfect for high-traffic commercial properties, gas stations, and properties requiring the absolute best protection available.',
    includes: [
      'Comprehensive surface preparation',
      'Professional pressure washing included',
      'Extended crack filling (up to 1/2")',
      'Polymer-modified premium sealant',
      'Three full coats for maximum protection',
      'Professional spray application only',
      'Detailed edge work and finishing',
      'Enhanced sand additive for traction',
      'Traffic control setup',
      '72-hour cure monitoring',
      'Post-service quality inspection',
      'Maintenance recommendations',
    ],
    pricing: { basePrice: 0.25, unit: 'sq_ft', minCharge: 600 },
    estimatedDuration: '2-3 days',
    materials: [
      'Polymer-modified coal tar blend',
      'Advanced polymer additives',
      'Professional-grade crack filler',
      'Premium silica sand',
      'Surface conditioners',
    ],
    warranty: '2 year material and workmanship',
    benefits: [
      'Up to 50% longer life than standard sealcoating',
      'Superior resistance to gas, oil, and chemicals',
      'Enhanced flexibility prevents cracking',
      'Deeper, richer black color',
      'Better UV protection',
      'Faster cure time',
      'Includes pressure washing ($300+ value)',
      'Priority scheduling',
      'Extended 2-year warranty',
    ],
  },

  {
    id: 'prem-infrared-repair',
    name: 'Infrared Asphalt Repair',
    category: 'PREMIUM',
    description: 'Seamless infrared heating technology - Invisible permanent repairs',
    detailedDescription: 'State-of-the-art infrared repair technology heats existing asphalt to 300-350°F, allowing seamless blending of new material with old. Creates a permanent, virtually invisible repair with no seams, cold joints, or edges. The molecular bonding achieved through infrared heating creates repairs that are actually stronger than the original pavement. Ideal for high-visibility areas, main entrances, and areas requiring structural repairs without visible patches.',
    includes: [
      'Infrared heating preparation (300-350°F)',
      'Damaged material scarification',
      'Virgin hot mix asphalt addition',
      'Seamless molecular integration',
      'Proper density compaction and rolling',
      'No visible seams or cold joints',
      'Same-day completion',
      'Temperature monitoring throughout',
      'Stronger than original pavement',
    ],
    pricing: { basePrice: 3.50, unit: 'sq_ft', minCharge: 800 },
    estimatedDuration: '1 day',
    materials: ['Virgin hot mix asphalt', 'Infrared heating equipment', 'Tack coat', 'Compaction tools'],
    warranty: '3 year structural integrity',
    benefits: [
      'Completely seamless invisible repairs',
      'No cold joints that can fail',
      'Stronger than original asphalt',
      'Same-day completion and use',
      'Perfect for high-visibility areas',
      'Cost-effective vs. complete replacement',
      'Weather-independent (works year-round)',
      'Extends overall pavement life',
    ],
  },

  {
    id: 'prem-thermoplastic-striping',
    name: 'Thermoplastic Line Striping',
    category: 'PREMIUM',
    description: 'Long-lasting thermoplastic striping - 5-10x longer life than paint',
    detailedDescription: 'Premium thermoplastic striping provides 5-10 times longer life than standard traffic paint. This heat-applied durable material creates raised, highly reflective lines that remain visible in all weather conditions including rain and fog. Embedded glass beads provide superior nighttime reflectivity. The thermoplastic material bonds permanently to pavement, resisting wear from traffic, snowplows, and weather. Perfect for high-traffic areas, highways, and properties requiring long-term performance with minimal maintenance.',
    includes: [
      'Precision layout and measurement',
      'Surface preparation and cleaning',
      'Premium thermoplastic material application',
      'Embedded glass beads for reflectivity',
      'Custom colors available (white, yellow, blue, red)',
      'Raised profile for enhanced visibility',
      'ADA-compliant handicap markings',
      'Custom logos and symbols',
      'Reflective performance testing',
      'Quality control inspection',
    ],
    pricing: { basePrice: 150, unit: 'stall', minCharge: 1500 },
    estimatedDuration: '1-2 days',
    materials: [
      'Thermoplastic preformed material',
      'Glass beads for reflectivity',
      'Surface primer',
      'Heating equipment',
      'Custom color options',
    ],
    warranty: '3 year fade and wear resistance',
    benefits: [
      '5-10x longer life than paint (5-7 years typical)',
      'Raised profile highly visible in rain',
      'Superior nighttime reflectivity',
      'Resists snowplow damage',
      'No restriping for 5+ years',
      'Lower long-term cost vs. paint',
      'DOT and highway approved',
      'Available in multiple colors',
      'Environmentally friendly',
    ],
  },
];

// Helper functions
export const getServicesByCategory = (category: 'STANDARD' | 'PREMIUM') => {
  return SERVICE_CATALOG_COMPREHENSIVE.filter(service => service.category === category);
};

export const getServiceById = (id: string) => {
  return SERVICE_CATALOG_COMPREHENSIVE.find(service => service.id === id);
};

export const calculateServicePrice = (serviceId: string, quantity: number): number => {
  const service = getServiceById(serviceId);
  if (!service) return 0;
  const calculated = service.pricing.basePrice * quantity;
  return Math.max(calculated, service.pricing.minCharge || 0);
};

export const getStencilsByCategory = (category: 'STANDARD' | 'PREMIUM') => {
  return STENCIL_CATALOG.filter(stencil => stencil.category === category);
};

export const getCurbStopByType = (type: 'CONCRETE' | 'RUBBER') => {
  return CURB_STOP_CATALOG.find(curb => curb.type === type);
};

