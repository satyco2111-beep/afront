import  Header from "@/app/component/web/header"

export default function WebLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      <Header />
      {children}
      </main>
  )
}