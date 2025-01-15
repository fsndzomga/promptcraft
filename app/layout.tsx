import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PromptCraft - Create Perfect Text-to-Image Prompts',
  description: 'Generate detailed prompts for text-to-image AI models with our step-by-step guide',
}

function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="ml-2 text-xl font-semibold text-gray-900">PromptCraft</span>
        </Link>
        <Link href="https://nebius.com/services/studio-inference-service?utm_source=handscribe_fsndzomga" target="_blank" className="flex items-center" rel="noopener">
          <span className="ml-2 text-xl font-semibold text-gray-600">Powered By <span className='text-blue-600'>Nebius AI</span></span>
        </Link>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  )
}
