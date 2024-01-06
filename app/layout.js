import './globals.css';

export const metadata = {
  title: 'Pragati 2024',
  description: 'Web App for Pragati 2024',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}