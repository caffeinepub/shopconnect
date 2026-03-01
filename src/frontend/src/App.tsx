import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { useIsAdmin } from "@/hooks/useShopQueries";
import ShopAdmin from "@/pages/ShopAdmin";
import ShopContact from "@/pages/ShopContact";
import ShopHome from "@/pages/ShopHome";
import ShopProducts from "@/pages/ShopProducts";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import {
  LayoutDashboard,
  Menu,
  MessageCircle,
  Package,
  Phone,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const WHATSAPP_URL =
  "https://wa.me/919813983483?text=Hi%20Waris%20Bhai%2C%20I%20am%20interested%20in%20buying%20a%20mobile.%20Can%20you%20share%20the%20latest%20prices%3F";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Phone },
  { to: "/products", label: "Products", icon: Package },
  { to: "/contact", label: "Contact", icon: MessageCircle },
];

function AdminNavItem() {
  const { data: isAdmin } = useIsAdmin();
  if (!isAdmin) return null;
  return (
    <Link to="/admin">
      {({ isActive }) => (
        <span
          className={`flex items-center gap-1.5 h-9 px-3 text-sm font-semibold rounded-md transition-all ${
            isActive
              ? "text-cyan-brand bg-cyan-brand/10"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Admin
        </span>
      )}
    </Link>
  );
}

function AdminMobileNavItem({ onClick }: { onClick: () => void }) {
  const { data: isAdmin } = useIsAdmin();
  if (!isAdmin) return null;
  return (
    <Link to="/admin" onClick={onClick}>
      {({ isActive }) => (
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
            isActive
              ? "text-cyan-brand bg-cyan-brand/10"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Admin
        </div>
      )}
    </Link>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-cyan-brand flex items-center justify-center transition-all group-hover:shadow-glow">
              <Phone className="w-4 h-4 text-ink fill-current" />
            </div>
            <span className="font-display font-bold text-lg text-foreground tracking-tight">
              Waris Bhai <span className="text-cyan-brand">Mobiles</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}>
                {({ isActive }) => (
                  <span
                    className={`flex items-center gap-1.5 h-9 px-3 text-sm font-semibold rounded-md transition-all cursor-pointer ${
                      isActive
                        ? "text-cyan-brand bg-cyan-brand/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </span>
                )}
              </Link>
            ))}
            <AdminNavItem />
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 flex items-center gap-1.5 h-9 px-4 text-sm font-semibold rounded-md bg-whatsapp text-white hover:bg-whatsapp-dark transition-all"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-current"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-md bg-whatsapp text-white hover:bg-whatsapp-dark transition-all"
              aria-label="Chat on WhatsApp"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 fill-current"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat
            </a>
            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden sticky top-16 z-40 border-b border-border bg-background/98 backdrop-blur-md overflow-hidden"
          >
            <nav
              className="flex flex-col gap-1 p-3"
              aria-label="Mobile navigation"
            >
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} onClick={() => setMobileOpen(false)}>
                  {({ isActive }) => (
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "text-cyan-brand bg-cyan-brand/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </div>
                  )}
                </Link>
              ))}
              <AdminMobileNavItem onClick={() => setMobileOpen(false)} />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function RefundPolicyModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            Refund Policy
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-3 mt-1">
          <p>
            All sales are final. If you receive a defective or incorrect
            product, please contact us within 24 hours via WhatsApp or email.
          </p>
          <p>
            Refunds are processed within 7 business days after verification.
          </p>
          <div className="rounded-lg bg-muted/50 border border-border px-4 py-3 space-y-1">
            <p className="font-semibold text-foreground text-sm">Contact Us:</p>
            <a
              href="https://wa.me/919813983483"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[#25D366] hover:underline"
            >
              WhatsApp: +91 98139 83483
            </a>
            <a
              href="mailto:warisbhaimewati@gmail.com"
              className="block text-cyan-brand hover:underline"
            >
              warisbhaimewati@gmail.com
            </a>
          </div>
        </div>
        <Button
          type="button"
          onClick={onClose}
          className="mt-2 w-full bg-cyan-brand text-ink hover:bg-cyan-light font-semibold"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);
  const [refundOpen, setRefundOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-border mt-20 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-brand flex items-center justify-center">
                  <Phone className="w-4 h-4 text-ink fill-current" />
                </div>
                <span className="font-display font-bold text-xl text-foreground">
                  Waris Bhai <span className="text-cyan-brand">Mobiles</span>
                </span>
              </div>
              <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                Your trusted destination for the latest smartphones and
                accessories in Mewat.
              </p>
            </div>

            {/* Nav + Contact */}
            <div className="flex flex-col sm:flex-row gap-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Pages
                </p>
                <nav className="flex flex-col gap-2 text-sm">
                  {NAV_ITEMS.map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      className="text-muted-foreground hover:text-cyan-brand transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Quick Links */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Quick Links
                </p>
                <div className="flex flex-col gap-2 text-sm">
                  <Link
                    to="/contact"
                    search={{ product: "" }}
                    className="text-muted-foreground hover:text-cyan-brand transition-colors"
                  >
                    Contact Us
                  </Link>
                  <button
                    type="button"
                    onClick={() => setRefundOpen(true)}
                    className="text-left text-muted-foreground hover:text-cyan-brand transition-colors"
                  >
                    Refund Policy
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Contact
                </p>
                <div className="flex flex-col gap-2 text-sm">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-whatsapp hover:text-white transition-colors"
                  >
                    +91 98139 83483
                  </a>
                  <a
                    href="mailto:warisbhaimewati@gmail.com"
                    className="text-muted-foreground hover:text-cyan-brand transition-colors"
                  >
                    warisbhaimewati@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="section-rule mb-6" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-whatsapp/20 flex items-center justify-center">
                <span className="text-whatsapp">✓</span>
              </span>
              <span>Verified Seller · Mewat, Haryana</span>
            </div>
            <p>
              © {year}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-brand hover:text-cyan-light transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      <RefundPolicyModal
        open={refundOpen}
        onClose={() => setRefundOpen(false)}
      />
    </>
  );
}

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

// Router setup
const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: ShopHome,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  component: ShopProducts,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ShopContact,
  validateSearch: (search: Record<string, unknown>) => ({
    product: (search.product as string | undefined) ?? "",
  }),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: ShopAdmin,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  contactRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  );
}
