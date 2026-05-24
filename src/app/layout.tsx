// import type { Metadata } from 'next';
// import { ThemeProvider } from 'next-themes';
// import { Toaster } from 'react-hot-toast';
// import '@/styles/globals.css';

// export const metadata: Metadata = {
//   title: 'Worknoon Chat',
//   description: 'Real-time eCommerce messaging platform',
//   icons: { icon: '/favicon.ico' },
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body>
//         <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
//           {children}
//           <Toaster
//             position="bottom-right"
//             toastOptions={{
//               style: {
//                 background: '#222736',
//                 color: '#f1f0ff',
//                 border: '1px solid rgba(255,255,255,0.14)',
//                 borderRadius: '12px',
//                 fontSize: '13px',
//               },
//               success: { iconTheme: { primary: '#22d3a4', secondary: '#0d0f14' } },
//               error: { iconTheme: { primary: '#f87171', secondary: '#0d0f14' } },
//             }}
//           />
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }