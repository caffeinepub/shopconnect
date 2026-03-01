import type { Product } from "@/backend.d";
import OrderCheckoutDialog from "@/components/OrderCheckoutDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, ShoppingBag, XCircle } from "lucide-react";
import { useState } from "react";

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

const WA_SVG = (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function ProductDetailModal({
  product,
  onClose,
}: ProductDetailModalProps) {
  const [showCheckout, setShowCheckout] = useState(false);

  if (showCheckout) {
    return (
      <OrderCheckoutDialog
        product={product}
        onClose={() => {
          setShowCheckout(false);
          onClose();
        }}
      />
    );
  }

  const whatsappMsg = encodeURIComponent(
    `Hi Waris Bhai, I am interested in buying ${product.name} (${product.price}). Can you please share the latest price and availability?`,
  );

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-card border-border">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="sm:w-2/5 bg-secondary shrink-0">
            <img
              src={
                product.imageUrl ||
                "/assets/generated/phone-iphone15pro.dim_400x400.jpg"
              }
              alt={product.name}
              className="w-full h-56 sm:h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <DialogHeader className="mb-4">
              <div className="flex items-start justify-between gap-2">
                <DialogTitle className="font-display text-2xl font-bold text-foreground leading-tight">
                  {product.name}
                </DialogTitle>
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge className="bg-cyan-brand/15 text-cyan-brand border-cyan-brand/25 text-xs">
                  {product.category}
                </Badge>
                {product.inStock ? (
                  <Badge className="bg-whatsapp/15 text-whatsapp border-whatsapp/25 text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    In Stock
                  </Badge>
                ) : (
                  <Badge className="bg-muted text-muted-foreground border-border text-xs flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Out of Stock
                  </Badge>
                )}
              </div>
            </DialogHeader>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="mb-6">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">
                Price
              </p>
              <p className="font-display text-3xl font-bold text-cyan-brand">
                {product.price}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {product.inStock && (
                <Button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-cyan-brand text-ink hover:bg-cyan-light font-semibold"
                >
                  <ShoppingBag className="mr-2 w-4 h-4" />
                  Buy Now
                </Button>
              )}
              <a
                href={`https://wa.me/919813983483?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-whatsapp/10 border border-whatsapp/30 text-whatsapp hover:bg-whatsapp hover:text-white transition-all font-semibold text-sm"
              >
                {WA_SVG}
                Chat on WhatsApp
              </a>
              <Button
                variant="ghost"
                onClick={onClose}
                className="border-border text-muted-foreground hover:text-foreground"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
