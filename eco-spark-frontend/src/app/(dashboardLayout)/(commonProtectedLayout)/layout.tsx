export default function CommonProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="space-y-6">{children}</div>
}
