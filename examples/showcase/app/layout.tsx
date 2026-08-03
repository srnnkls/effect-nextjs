import type { ReactNode } from "react"

export const metadata = {
  title: "effect-nextjs showcase",
  description: "Every effect-nextjs wrapper, exercised in one Next.js app"
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          margin: 0,
          padding: "2rem",
          lineHeight: 1.6,
          maxWidth: "48rem"
        }}
      >
        <header style={{ marginBottom: "2rem" }}>
          <a href="/" style={{ fontWeight: 600, textDecoration: "none" }}>
            effect-nextjs showcase
          </a>
        </header>
        {children}
      </body>
    </html>
  )
}
