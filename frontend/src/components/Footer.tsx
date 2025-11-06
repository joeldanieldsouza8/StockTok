export default function Footer() {
  return (
    <footer className="border-t mt-12 py-6">
      <div className="container mx-auto px-4 text-center text-sm text-muted">
        <div>© {new Date().getFullYear()} StockTok — Built with Auth0 & Next.js</div>
        <div className="mt-2">Made for demoing JWT + session flows.</div>
      </div>
    </footer>
  );
}
