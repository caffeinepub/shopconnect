import type { Product } from "@/backend.d";
import OrderCheckoutDialog from "@/components/OrderCheckoutDialog";
import ProductDetailModal from "@/components/ProductDetailModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useShopQueries";
import { Search, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

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

function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border">
      <Skeleton className="h-52 w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between mt-3 gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  );
}

function PhoneCard({
  product,
  onViewDetails,
  onBuyNow,
}: {
  product: Product;
  onViewDetails: (p: Product) => void;
  onBuyNow: (p: Product) => void;
}) {
  const whatsappMsg = encodeURIComponent(
    `Hi Waris Bhai, I am interested in buying ${product.name} (${product.price}). Can you please share the latest price and availability?`,
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3 }}
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
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed">
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

export default function ShopProducts() {
  const { data: backendProducts, isLoading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const products =
    backendProducts && backendProducts.length > 0
      ? backendProducts
      : SAMPLE_PRODUCTS;

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(cats).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCat =
        activeCategory === "All" || p.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-cyan-brand text-sm font-semibold uppercase tracking-widest mb-2">
          Browse
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
          All Phones & Accessories
        </h1>
        <p className="text-muted-foreground max-w-lg">
          Latest smartphones from top brands. Click any phone to see details or
          chat with Waris Bhai on WhatsApp for the best price.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search phones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card border-border focus-visible:ring-cyan-brand/30"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={activeCategory === cat ? "default" : "outline"}
              onClick={() => setActiveCategory(cat)}
              className={
                activeCategory === cat
                  ? "bg-cyan-brand text-ink border-none font-semibold"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-cyan-brand/40"
              }
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Count */}
      {!isLoading && (
        <p className="text-muted-foreground text-sm mb-6">
          {filtered.length} phone{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <ProductCardSkeleton key={k} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display text-xl font-bold text-foreground mb-2">
            No phones found
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Try adjusting your search or filter. Or chat with us — we might have
            it!
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
              }}
              className="border-border text-muted-foreground hover:text-foreground"
            >
              Clear filters
            </Button>
            <a
              href="https://wa.me/919813983483?text=Hi%20Waris%20Bhai%2C%20I%20am%20interested%20in%20buying%20a%20mobile.%20Can%20you%20share%20the%20latest%20prices%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-9 px-4 text-sm font-semibold rounded-md bg-whatsapp text-white hover:bg-whatsapp-dark transition-all"
            >
              Ask on WhatsApp
            </a>
          </div>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((product) => (
              <PhoneCard
                key={product.id.toString()}
                product={product}
                onViewDetails={setSelectedProduct}
                onBuyNow={setCheckoutProduct}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

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
