
// Service Catalog - Comprehensive pricing and service definitions

export interface ServiceItem {
  id: string;
  name: string;
  category: 'STANDARD' | 'PREMIUM';
  description: string;
  detailedDescription: string;
  includes: string[];
  pricing: {
    basePrice: number;
    unit: 'sq_ft' | 'lin_ft' | 'stall' | 'hour' | 'flat';
    minCharge?: number;
  };
  estimatedDuration: string;
  materials: string[];
  warranty: string;
}

export const SERVICE_CATALOG: ServiceItem[] = [
  // STANDARD SERVICES
  {
    id: 'standard-sealcoating',
    name: 'Standard Sealcoating',
    category: 'STANDARD',
    description: 'Professional coal tar emulsion sealcoating application',
    detailedDescription: 'Our standard sealcoating service provides a protective barrier against water, oils, and UV damage. We use commercial-grade coal tar emulsion sealant that penetrates deep into asphalt pores, preventing oxidation and extending pavement life by 3-5 years.',
    includes: [
      'Surface cleaning and debris removal',
      'Crack filling up to 1/4"',
      'Two coats of coal tar emulsion',
      'Professional spray or squeegee application',
      'Traffic control setup',
      'Cure time marking',
    ],
    pricing: {
      basePrice: 0.15,
      unit: 'sq_ft',
      minCharge: 300,
    },
    estimatedDuration: '1-2 days',
    materials: ['Coal tar emulsion', 'Crack filler', 'Sand additive'],
    warranty: '1 year workmanship',
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
