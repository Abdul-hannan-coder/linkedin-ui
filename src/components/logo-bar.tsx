'use client';

export default function LogoBar() {
  const logos = [
    { name: 'Meta', initials: 'FB' },
    { name: 'Instagram', initials: 'IG' },
    { name: 'WhatsApp Business', initials: 'WA' },
    { name: 'Shopify', initials: 'SP' },
    { name: 'WooCommerce', initials: 'WC' },
    { name: 'HubSpot', initials: 'HS' },
  ];

  return (
    <div className="py-12 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-sm text-gray-600 mb-8 font-medium">INTEGRATES WITH POPULAR PLATFORMS</p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="w-24 h-12 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg flex items-center justify-center border border-gray-200 hover:shadow-md transition"
            >
              <span className="text-sm font-bold text-gray-500">{logo.initials}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
