import './globals.css'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Prompt Library - 探索AI提示的艺术',
  description: '探索、使用并分享经过精心策划的提示词库，释放AI的全部潜力',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </head>
      <body>
        <div className="container">
          <Header />
          {children}
          <Footer />
        </div>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js" />
      </body>
    </html>
  )
}