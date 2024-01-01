import './globals.css';

export const metadata = {
  title: 'Pragathi 2024',
  description: 'Web App for Pragathi 2024',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}