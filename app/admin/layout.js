export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-32">
        {children}
      </main>
    </div>
  )
}