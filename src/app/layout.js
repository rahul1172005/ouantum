import "./globals.css";

export const metadata = {
  title: "Ouantum — AI Infrastructure Intelligence CRM & 3D Twin System",
  description: "Next-generation corporate platform for real-time sensor streams, material concrete audits, structural mapping, risk prediction, and compliance pipeline tracking using advanced Artificial Intelligence.",
  keywords: "Ouantum, Infrastructure CRM, Structural Health Monitoring, Digital Twin, Predictive Maintenance, NDT Auditing, Smart Cities",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-[#f0f2f5] text-[#2d2d2d]">
        {children}
      </body>
    </html>
  );
}
