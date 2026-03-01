import type { Product } from "@/backend.d";
import OrderCheckoutDialog from "@/components/OrderCheckoutDialog";
import ProductDetailModal from "@/components/ProductDetailModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useShopQueries";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  Shield,
  ShoppingBag,
  Truck,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const WHATSAPP_URL =
  "https://wa.me/919813983483?text=Hi%20Waris%20Bhai%2C%20I%20am%20interested%20in%20buying%20a%20mobile.%20Can%20you%20share%20the%20latest%20prices%3F";

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: BigInt(0),
    name: "iPhone 15 Pro",
    description:
      "A17 Pro chip, titanium design, 48MP camera system. The most powerful iPhone ever.",
    price: "₹1,19,900",
    imageUrl: "/assets/generated/phone-iphone15pro.dim_400x400.jpg",
    category: "Smartphones",
    inStock: true,
  },
  {
    id: BigInt(1),
    name: "Samsung Galaxy S24",
    description:
      "Snapdragon 8 Gen 3, Galaxy AI features, 200MP camera. Next-gen Android flagship.",
    price: "₹74,999",
    imageUrl: "/assets/generated/phone-samsung-s24.dim_400x400.jpg",
    category: "Smartphones",
    inStock: true,
  },
  {
    id: BigInt(2),
    name: "OnePlus 12",
    description:
      "Hasselblad cameras, 100W SUPERVOOC charging, Snapdragon 8 Gen 3 power.",
    price: "₹64,999",
    imageUrl: "/assets/generated/phone-oneplus12.dim_400x400.jpg",
    category: "Smartphones",
    inStock: true,
  },
  {
    id: BigInt(3),
    name: "Vivo V30",
    description:
      '6.78" AMOLED display, 50MP portrait camera with Aura light, slim 7.46mm design.',
    price: "₹33,999",
    imageUrl: "/assets/generated/phone-vivo-v30.dim_400x400.jpg",
    category: "Smartphones",
    inStock: true,
  },
  {
    id: BigInt(4),
    name: "Realme GT 5",
    description:
      "240W ultra-fast charging, Snapdragon 8 Gen 2, gaming-grade performance beast.",
    price: "₹29,999",
    imageUrl: "/assets/generated/phone-realme-gt5.dim_400x400.jpg",
    category: "Smartphones",
    inStock: true,
  },
  {
    id: BigInt(5),
    name: "Redmi Note 13 Pro",
    description:
      "200MP OIS camera, 120Hz AMOLED, Snapdragon 7s Gen 2. Best camera in budget.",
    price: "₹26,999",
    imageUrl: "/assets/generated/phone-redmi-note13.dim_400x400.jpg",
    category: "Smartphones",
    inStock: true,
  },
];

const BRANDS = ["All", "Samsung", "Apple", "Vivo", "Oppo", "Xiaomi"];

const TRUST_BADGES = [
  {
    icon: Shield,
    label: "Verified Seller",
    desc: "Govt. authorised dealer",
    color: "text-cyan-brand",
    bg: "bg-cyan-brand/10",
    border: "border-cyan-brand/20",
  },
  {
    icon: Truck,
    label: "Fast Delivery",
    desc: "Same day in Mewat",
    color: "text-orange-brand",
    bg: "bg-orange-brand/10",
    border: "border-orange-brand/20",
  },
  {
    icon: CheckCircle,
    label: "100% Genuine",
    desc: "All phones with warranty",
    color: "text-whatsapp",
    bg: "bg-whatsapp/10",
    border: "border-whatsapp/20",
  },
  {
    icon: Zap,
    label: "Best Price",
    desc: "Price match guarantee",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
  },
];

function filterByBrand(products: Product[], brand: string): Product[] {
  if (brand === "All") return products;
  const b = brand.toLowerCase();
  if (b === "xiaomi") {
    return products.filter((p) => {
      const name = p.name.toLowerCase();
      return (
        name.includes("xiaomi") ||
        name.includes("redmi") ||
        name.includes("poco")
      );
    });
  }
  return products.filter((p) => p.name.toLowerCase().includes(b));
}

function ProductSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border">
      <Skeleton className="h-52 w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2 mt-3">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}

function PhoneCard({
  product,
  onViewDetails,
  onBuyNow,
  index,
}: {
  product: Product;
  onViewDetails: (p: Product) => void;
  onBuyNow: (p: Product) => void;
  index: number;
}) {
  const whatsappMsg = encodeURIComponent(
    `Hi Waris Bhai, I am interested in buying ${product.name} (${product.price}). Can you please share the latest price and availability?`,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="product-card glow-card bg-card rounded-2xl overflow-hidden border border-border group cursor-pointer"
      onClick={() => onViewDetails(product)}
    >
      <div className="relative overflow-hidden h-52 bg-secondary">
        <img
          src={
            product.imageUrl ||
            "/assets/generated/phone-iphone15pro.dim_400x400.jpg"
          }
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <Badge className="bg-muted text-muted-foreground border-border text-sm px-4 py-1">
              Out of Stock
            </Badge>
          </div>
        )}
        <Badge className="absolute top-3 left-3 bg-cyan-brand/90 text-ink font-semibold text-xs border-none">
          {product.category}
        </Badge>
        {product.inStock && (
          <Badge className="absolute top-3 right-3 bg-whatsapp/90 text-white border-none text-xs">
            In Stock
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-bold text-foreground text-lg leading-tight mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3 leading-relaxed">
          {product.description}
        </p>
        <div className="flex items-center justify-between gap-2">
          <span className="font-display font-bold text-xl text-cyan-brand shrink-0">
            {product.price}
          </span>
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation wrapper only */}
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <a
              href={`https://wa.me/919813983483?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-semibold rounded-md bg-whatsapp/10 text-whatsapp hover:bg-whatsapp hover:text-white transition-all border border-whatsapp/30"
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
            {product.inStock && (
              <Button
                size="sm"
                onClick={() => onBuyNow(product)}
                className="bg-cyan-brand text-ink hover:bg-cyan-light font-semibold h-9"
              >
                <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                Buy Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ShopHome() {
  const { data: backendProducts, isLoading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [activeBrand, setActiveBrand] = useState("All");

  const allProducts =
    backendProducts && backendProducts.length > 0
      ? backendProducts.slice(0, 6)
      : SAMPLE_PRODUCTS;

  const displayProducts = filterByBrand(allProducts, activeBrand);

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="relative h-[460px] sm:h-[520px] lg:h-[580px]">
          <img
            src="/assets/generated/hero-mobiles.dim_1400x560.jpg"
            alt="Waris Bhai Mobiles - Latest smartphones"
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="hero-overlay absolute inset-0" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
              <motion.div
                initial={{ opacity: 0, x: -32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65 }}
                className="max-w-2xl"
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-cyan-brand/15 border border-cyan-brand/30 text-cyan-brand text-xs font-semibold uppercase tracking-widest"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Verified Seller · Mewat, Haryana
                </motion.div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                  Premium Used Mobiles
                </h1>

                <p className="text-white/75 text-base sm:text-lg mb-8 leading-relaxed max-w-lg">
                  Buy quality second-hand and new smartphones at unbeatable
                  prices. Samsung, Apple, Vivo, Oppo, Xiaomi — all available.
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="flex flex-wrap gap-3"
                >
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-whatsapp text-white font-semibold text-sm hover:bg-whatsapp-dark transition-all shadow-wa-glow"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5 fill-current"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                  <Button
                    size="lg"
                    onClick={() =>
                      document
                        .getElementById("featured-phones")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="h-12 px-6 bg-cyan-brand text-ink hover:bg-cyan-light font-semibold border-none"
                  >
                    Shop Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Fast Delivery Banner ──────────────────────────────────── */}
      <div className="delivery-banner py-3 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 text-white text-sm font-semibold">
          <Truck className="w-4 h-4 shrink-0" />
          <span>
            🚀 Fast Delivery Available · Same Day in Mewat · Free Home Delivery
            on Orders Above ₹10,000
          </span>
          <Truck className="w-4 h-4 shrink-0" />
        </div>
      </div>

      {/* ── Trust Badges ──────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST_BADGES.map(
            ({ icon: Icon, label, desc, color, bg, border }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`trust-badge rounded-xl p-4 flex items-start gap-3 ${border}`}
              >
                <div
                  className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p
                    className={`font-display font-bold text-sm ${color} mb-0.5`}
                  >
                    {label}
                  </p>
                  <p className="text-muted-foreground text-xs">{desc}</p>
                </div>
              </motion.div>
            ),
          )}
        </div>
      </section>

      {/* ── Brand Filter ──────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-6">
        <div
          className="flex gap-2 overflow-x-auto py-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {BRANDS.map((brand) => {
            const isActive = activeBrand === brand;
            return (
              <button
                key={brand}
                type="button"
                onClick={() => setActiveBrand(brand)}
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-transparent text-foreground border-border hover:border-blue-400 hover:text-blue-600"
                }`}
              >
                {brand}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Featured Phones ───────────────────────────────────────── */}
      <section
        id="featured-phones"
        className="max-w-6xl mx-auto px-4 sm:px-6 pb-16"
      >
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-cyan-brand text-sm font-semibold uppercase tracking-widest mb-2">
              Our Collection
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Featured Phones
            </h2>
          </div>
          <Link to="/products">
            <Button
              variant="ghost"
              className="text-cyan-brand hover:text-cyan-light hover:bg-cyan-brand/5 font-semibold hidden sm:flex"
            >
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2, 3, 4, 5].map((k) => (
              <ProductSkeleton key={k} />
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-7 h-7 text-blue-400" />
            </div>
            <p className="text-foreground font-semibold mb-1">
              No {activeBrand} phones listed yet
            </p>
            <p className="text-muted-foreground text-sm">
              Chat with us on WhatsApp to ask for availability.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayProducts.map((product, i) => (
              <PhoneCard
                key={product.id.toString()}
                product={product}
                onViewDetails={setSelectedProduct}
                onBuyNow={setCheckoutProduct}
                index={i}
              />
            ))}
          </div>
        )}

        <div className="mt-10 text-center sm:hidden">
          <Link to="/products">
            <Button className="bg-cyan-brand text-ink hover:bg-cyan-light font-semibold">
              View All Products <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── WhatsApp CTA ──────────────────────────────────────────── */}
      <section className="bg-secondary border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 rounded-full bg-whatsapp/15 border border-whatsapp/30 flex items-center justify-center mx-auto mb-5">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 fill-whatsapp"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Want the Best Price on Any Phone?
            </h2>
            <p className="text-muted-foreground mb-2">
              Chat with Waris Bhai directly on WhatsApp for latest prices,
              offers & availability.
            </p>
            <p className="text-whatsapp font-semibold text-sm mb-8">
              ⚡ We respond within 1 hour!
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 h-13 px-8 py-3.5 rounded-xl bg-whatsapp text-white font-semibold text-base hover:bg-whatsapp-dark transition-all shadow-wa-glow"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-current"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp Now
            </a>
          </motion.div>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Order Checkout Dialog */}
      {checkoutProduct && (
        <OrderCheckoutDialog
          product={checkoutProduct}
          onClose={() => setCheckoutProduct(null)}
        />
      )}
    </main>
  );
}
