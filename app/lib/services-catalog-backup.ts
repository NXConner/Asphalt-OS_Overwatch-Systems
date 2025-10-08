
// Service Catalog - Comprehensive pricing and service definitions

export interface ApplicationMethod {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  priceModifier?: number; // Multiplier for base price
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
}

export const SERVICE_CATALOG: ServiceItem[] = [
  // ==================== ASPHALT REPAIR SERVICES ====================
  {
    id: 'standard-asphalt-repair',
    name: 'Asphalt Repair & Patching',
    category: 'STANDARD',
    description: 'Professional asphalt repair for damaged pavement sections',
    detailedDescription: 'Comprehensive asphalt repair service addressing various pavement failures including potholes, edge deterioration, alligator cracking, and surface depressions. We remove all damaged material, prepare the base properly, and install new hot mix asphalt compacted to specifications for a lasting repair.',
    includes: [
      'Complete damage assessment',
      'Removal of failed asphalt material',
      'Base repair and stabilization',
      'Proper drainage consideration',
      'Hot mix asphalt installation',
      'Multi-pass compaction',
      'Tack coat for bonding',
      'Surface leveling and grading',
      'Clean-up and debris removal',
    ],
    pricing: {
      basePrice: 0.75,
      unit: 'sq_ft',
      minCharge: 400,
    },
    estimatedDuration: '1 day',
    materials: ['Hot mix asphalt', 'Tack coat', 'Aggregate base', 'Edge sealant'],
    warranty: '1 year structural integrity',
  },
  {
    id: 'standard-pothole-repair',
    name: 'Pothole Repair Service',
    category: 'STANDARD',
    description: 'Fast, permanent pothole repair solutions',
    detailedDescription: 'Pothole repair using either hot mix asphalt (permanent) or cold patch (temporary/emergency). Our permanent repairs include proper preparation, quality hot mix, and adequate compaction. We offer same-day service for emergency repairs to keep your property safe and accessible.',
    includes: [
      'Pothole cleaning and preparation',
      'Water and debris removal',
      'Square cutting of edges',
      'Tack coat application',
      'Hot or cold mix installation',
      'Tamping and compaction',
      'Surface finishing',
      'Immediate traffic readiness',
    ],
    pricing: {
      basePrice: 125,
      unit: 'each',
      minCharge: 250,
    },
    estimatedDuration: '2-4 hours',
    materials: ['Hot mix asphalt or cold patch', 'Tack coat', 'Edge sealant'],
    warranty: '1 year (hot mix), 90 days (cold patch)',
  },

  // ==================== SEALCOATING SERVICES ====================
  {
    id: 'standard-sealcoating',
    name: 'Professional Sealcoating',
    category: 'STANDARD',
    description: 'Coal tar or asphalt emulsion sealcoating with flexible application options',
    detailedDescription: 'Our professional sealcoating service provides a protective barrier against water, oils, UV rays, and chemical damage. Choose from 1, 2, or 3 coat applications depending on your pavement condition and traffic levels. We use commercial-grade sealant that penetrates asphalt pores, prevents oxidation, and extends pavement life by 3-5 years per application.',
    includes: [
      'Thorough surface cleaning',
      'Oil spot treatment',
      'Crack filling up to 1/4"',
      'Edge detail work',
      'Traffic control setup',
      'Cure time barricading',
      'Clean line edges',
      'Post-application inspection',
    ],
    pricing: {
      basePrice: 0.14,
      unit: 'sq_ft',
      minCharge: 350,
    },
    estimatedDuration: '1-2 days',
    materials: ['Coal tar or asphalt emulsion', 'Crack filler', 'Sand additive', 'Additives'],
    warranty: '1 year workmanship',
    coatOptions: [
      {
        coats: 1,
        pricePerSqFt: 0.10,
        description: 'Single coat application - Economy option',
        recommendedFor: 'New asphalt (1-2 years old), light traffic areas, budget-conscious projects',
      },
      {
        coats: 2,
        pricePerSqFt: 0.14,
        description: 'Two coat application - Standard protection',
        recommendedFor: 'Most residential and commercial properties, 3-10 year old asphalt, moderate traffic',
      },
      {
        coats: 3,
        pricePerSqFt: 0.20,
        description: 'Three coat application - Maximum protection for heavy traffic',
        recommendedFor: 'High-traffic commercial lots, gas stations, truck routes, severely weathered asphalt',
      },
    ],
    applicationMethods: [
      {
        name: 'Spray Application',
        description: 'Professional spray equipment applies sealant in uniform coats with consistent thickness',
        pros: [
          'Fastest application method',
          'Most uniform coverage',
          'Professional appearance',
          'Best for large areas',
          'Consistent mil thickness',
          'Reaches edges and corners easily',
        ],
        cons: [
          'Requires professional equipment',
          'Wind can affect application',
          'Overspray concerns near buildings/cars',
          'Equipment cleanup required',
        ],
        bestFor: 'Large parking lots (5,000+ sq ft), commercial properties, uniform surfaces',
        priceModifier: 1.0,
      },
      {
        name: 'Squeegee Application',
        description: 'Hand-applied using professional squeegees to work sealant into pavement',
        pros: [
          'Deep penetration into surface',
          'Fills small surface voids',
          'No overspray concerns',
          'Better coverage on rough surfaces',
          'Excellent edge work',
          'More material applied per coat',
        ],
        cons: [
          'Slower than spraying',
          'More labor-intensive',
          'Can leave squeegee marks if not done properly',
          'Requires skilled applicators',
        ],
        bestFor: 'Residential driveways, small lots, rough surfaces, areas near vehicles',
        priceModifier: 1.15,
      },
      {
        name: 'Brush Application',
        description: 'Applied with professional brushes for detail work and small areas',
        pros: [
          'Excellent for small areas',
          'Perfect for repairs and touch-ups',
          'Great edge detail',
          'Works sealant into cracks',
          'Minimal equipment needed',
          'Precision application',
        ],
        cons: [
          'Very slow for large areas',
          'Labor-intensive',
          'Can show brush strokes',
          'Difficult to achieve uniform thickness',
          'Best as supplemental method',
        ],
        bestFor: 'Small residential driveways, repair patches, edge work, tight spaces',
        priceModifier: 1.25,
      },
      {
        name: 'Hand Working Method',
        description: 'Combination of squeegee and hand tools to work sealant into damaged surfaces',
        pros: [
          'Maximum material penetration',
          'Excellent for rough/damaged surfaces',
          'Fills surface imperfections',
          'Therapeutic for distressed pavement',
          'Custom attention to problem areas',
        ],
        cons: [
          'Most labor-intensive',
          'Slowest application method',
          'Higher cost',
          'Best for restoration projects',
        ],
        bestFor: 'Severely weathered asphalt, restoration projects, high-value properties',
        priceModifier: 1.35,
      },
    ],
  },
  {
    id: 'standard-crack-repair',
    name: 'Standard Crack Repair',
    category: 'STANDARD',
    description: 'Hot pour crack sealing and repair',
    detailedDescription: 'Professional crack repair using hot pour rubberized crack sealant. We clean and prepare cracks, then fill with premium hot-applied flexible sealant that moves with temperature changes, preventing water infiltration and further damage.',
    includes: [
      'Crack routing and cleaning',
      'Hot pour rubberized sealant',
      'Sand blotting for traffic',
      'Linear foot measurement',
      'Quality inspection',
    ],
    pricing: {
      basePrice: 2.50,
      unit: 'lin_ft',
      minCharge: 250,
    },
    estimatedDuration: '4-8 hours',
    materials: ['Hot pour crack sealant', 'Sand', 'Primer'],
    warranty: '1 year material and workmanship',
  },
  {
    id: 'standard-line-striping',
    name: 'Standard Line Striping',
    category: 'STANDARD',
    description: 'Basic parking lot striping and marking',
    detailedDescription: 'Professional parking lot striping using commercial-grade traffic paint. We provide clear, durable markings for parking stalls, handicap spaces, fire lanes, and directional arrows. All work complies with ADA and local regulations.',
    includes: [
      'Layout and measurement',
      'Standard white or yellow paint',
      '4" line width',
      'Handicap symbols',
      'Directional arrows',
      'Fire lane markings',
    ],
    pricing: {
      basePrice: 75,
      unit: 'stall',
      minCharge: 500,
    },
    estimatedDuration: '1 day',
    materials: ['Traffic paint (white/yellow)', 'Stencils', 'Layout tools'],
    warranty: '6 months fade resistance',
  },
  {
    id: 'standard-patching',
    name: 'Standard Asphalt Patching',
    category: 'STANDARD',
    description: 'Pothole repair and surface patching',
    detailedDescription: 'Professional pothole repair and asphalt patching using hot mix asphalt. We remove damaged material, prepare the base, and install new hot mix asphalt compacted to proper density. Ideal for repairing potholes, edge failures, and surface deterioration.',
    includes: [
      'Damaged material removal',
      'Base preparation and compaction',
      'Hot mix asphalt installation',
      'Proper compaction',
      'Tack coat application',
      'Surface leveling',
    ],
    pricing: {
      basePrice: 0.75,
      unit: 'sq_ft',
      minCharge: 400,
    },
    estimatedDuration: '1 day',
    materials: ['Hot mix asphalt', 'Tack coat', 'Base material'],
    warranty: '1 year structural integrity',
  },
  {
    id: 'standard-sweeping',
    name: 'Power Sweeping',
    category: 'STANDARD',
    description: 'Professional parking lot and pavement sweeping',
    detailedDescription: 'Regular power sweeping removes debris, dirt, and contaminants that can damage asphalt surfaces. Our commercial sweepers provide thorough cleaning, improving appearance and extending pavement life.',
    includes: [
      'Complete surface sweeping',
      'Debris removal and disposal',
      'Edge and curb cleaning',
      'Storm drain cleaning',
      'Post-sweep inspection',
    ],
    pricing: {
      basePrice: 0.02,
      unit: 'sq_ft',
      minCharge: 150,
    },
    estimatedDuration: '2-4 hours',
    materials: ['Sweeping equipment', 'Disposal'],
    warranty: 'N/A - Service',
  },

  // PREMIUM SERVICES
  {
    id: 'premium-sealcoating',
    name: 'Premium Sealcoating Plus',
    category: 'PREMIUM',
    description: 'Premium blend sealcoating with enhanced additives',
    detailedDescription: 'Our premium sealcoating service uses an enhanced coal tar emulsion blend with proprietary additives for superior durability and appearance. Includes more extensive crack repair, extra coats, and longer-lasting protection. Perfect for high-traffic commercial properties.',
    includes: [
      'Comprehensive surface preparation',
      'Extended crack filling (up to 1/2")',
      'Premium additive blend sealant',
      'Three coats for maximum protection',
      'Professional spray application',
      'Edge work and detail finishing',
      'Traffic control setup',
      '72-hour cure monitoring',
      'Sand additive for traction',
    ],
    pricing: {
      basePrice: 0.25,
      unit: 'sq_ft',
      minCharge: 500,
    },
    estimatedDuration: '2-3 days',
    materials: [
      'Premium coal tar blend',
      'Advanced additives',
      'Professional-grade crack filler',
      'Silica sand',
    ],
    warranty: '2 year material and workmanship',
  },
  {
    id: 'premium-infrared-repair',
    name: 'Infrared Asphalt Repair',
    category: 'PREMIUM',
    description: 'Seamless infrared asphalt repair technology',
    detailedDescription: 'State-of-the-art infrared repair technology heats existing asphalt to 300°F, allowing us to blend new material seamlessly with old. Creates a permanent, invisible repair with no seams or edges. Ideal for high-visibility areas and structural repairs.',
    includes: [
      'Infrared heating preparation',
      'Damaged material scarification',
      'Virgin hot mix asphalt addition',
      'Seamless integration',
      'Proper compaction and rolling',
      'No cold joints or seams',
      'Same-day completion',
      'Temperature monitoring',
    ],
    pricing: {
      basePrice: 3.50,
      unit: 'sq_ft',
      minCharge: 800,
    },
    estimatedDuration: '1 day',
    materials: ['Virgin hot mix asphalt', 'Infrared heating', 'Tack coat'],
    warranty: '3 year structural integrity',
  },
  {
    id: 'premium-thermoplastic-striping',
    name: 'Thermoplastic Line Striping',
    category: 'PREMIUM',
    description: 'Long-lasting thermoplastic striping and marking',
    detailedDescription: 'Premium thermoplastic striping provides 5-10 times longer life than paint. Heat-applied thermoplastic material creates raised, highly reflective lines that are extremely durable and visible in all conditions. Perfect for high-traffic areas requiring long-term performance.',
    includes: [
      'Precision layout and measurement',
      'Surface preparation and cleaning',
      'Thermoplastic material application',
      'Embedded glass beads for reflectivity',
      'Custom colors available',
      'ADA-compliant handicap markings',
      'Custom logos and symbols',
      'Quality inspection',
    ],
    pricing: {
      basePrice: 150,
      unit: 'stall',
      minCharge: 1500,
    },
    estimatedDuration: '1-2 days',
    materials: [
      'Thermoplastic material',
      'Glass beads',
      'Primer',
      'Heat equipment',
    ],
    warranty: '3 year fade and wear resistance',
  },
  {
    id: 'premium-overlay',
    name: 'Asphalt Overlay Resurfacing',
    category: 'PREMIUM',
    description: 'Complete surface overlay and resurfacing',
    detailedDescription: 'Professional asphalt overlay adds 1.5-2" of new hot mix asphalt over existing pavement, creating a brand new driving surface. Includes milling if needed, proper preparation, and new asphalt installation. Extends pavement life by 10-15 years.',
    includes: [
      'Milling of high areas (if needed)',
      'Crack repair and patching',
      'Tack coat application',
      'Hot mix asphalt overlay (1.5-2")',
      'Proper compaction and rolling',
      'Transition tapering',
      'Grade matching',
      'Quality density testing',
    ],
    pricing: {
      basePrice: 2.50,
      unit: 'sq_ft',
      minCharge: 5000,
    },
    estimatedDuration: '3-5 days',
    materials: ['Hot mix asphalt', 'Tack coat', 'Milling', 'Base repair'],
    warranty: '5 year structural integrity',
  },
  {
    id: 'premium-decorative',
    name: 'Decorative Stamped Asphalt',
    category: 'PREMIUM',
    description: 'Custom stamped and colored asphalt surfacing',
    detailedDescription: 'Transform standard asphalt into beautiful decorative pavement with stamped patterns and custom colors. We install hot mix asphalt then use specialized equipment to imprint patterns like brick, cobblestone, or custom designs. Add color coatings for a premium aesthetic.',
    includes: [
      'Custom pattern selection',
      'Hot mix asphalt installation',
      'Stamping while hot',
      'Release agent application',
      'Custom color coating',
      'Sealer application',
      'Design consultation',
      'Quality control',
    ],
    pricing: {
      basePrice: 8.00,
      unit: 'sq_ft',
      minCharge: 3000,
    },
    estimatedDuration: '3-7 days',
    materials: [
      'Hot mix asphalt',
      'Stamping equipment',
      'Color coatings',
      'Release agents',
      'Sealer',
    ],
    warranty: '3 year material and workmanship',
  },
  {
    id: 'premium-commercial-package',
    name: 'Complete Commercial Package',
    category: 'PREMIUM',
    description: 'All-inclusive commercial property maintenance',
    detailedDescription: 'Comprehensive annual maintenance package for commercial properties. Includes multiple services throughout the year to keep your property in top condition. Perfect for property managers and business owners wanting hassle-free pavement maintenance.',
    includes: [
      'Spring power sweeping',
      'Crack repair and patching (up to 500 lin ft)',
      'Premium sealcoating application',
      'Line striping refresh',
      'Fall sweeping and prep',
      'Winter damage inspection',
      'Emergency pothole repair',
      'Priority scheduling',
      'Quarterly reports',
    ],
    pricing: {
      basePrice: 0.35,
      unit: 'sq_ft',
      minCharge: 3500,
    },
    estimatedDuration: 'Year-round service',
    materials: ['All materials included in package'],
    warranty: '1 year comprehensive coverage',
  },
];

// Service category totals
export const getServicesByCategory = (category: 'STANDARD' | 'PREMIUM') => {
  return SERVICE_CATALOG.filter(service => service.category === category);
};

// Get service by ID
export const getServiceById = (id: string) => {
  return SERVICE_CATALOG.find(service => service.id === id);
};

// Calculate price for service
export const calculateServicePrice = (
  serviceId: string,
  quantity: number
): number => {
  const service = getServiceById(serviceId);
  if (!service) return 0;

  const calculated = service.pricing.basePrice * quantity;
  return Math.max(calculated, service.pricing.minCharge || 0);
};
