import type { Product } from "@/backend.d";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePlaceOrderMutation } from "@/hooks/useShopQueries";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  MapPin,
  Phone,
  QrCode,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Hardcoded WhatsApp number for Waris Bhai Mobiles
const WARIS_BHAI_WA_NUMBER = "919813983483";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
}

interface OrderCheckoutDialogProps {
  product: Product;
  onClose: () => void;
}

export default function OrderCheckoutDialog({
  product,
  onClose,
}: OrderCheckoutDialogProps) {
  const [step, setStep] = useState<"details" | "payment">("details");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [savedDetails, setSavedDetails] = useState<CustomerDetails | null>(
    null,
  );

  const placeOrder = usePlaceOrderMutation();

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSavedDetails({
      name: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });
    setStep("payment");
  };

  const handleConfirmOrder = async () => {
    if (!savedDetails) return;

    try {
      const orderId = await placeOrder.mutateAsync({
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        customerName: savedDetails.name,
        customerPhone: savedDetails.phone,
        customerAddress: savedDetails.address,
      });

      const waText = encodeURIComponent(
        `Hello, I would like to confirm my order for ${product.name}. My name is ${savedDetails.name}. Here is the payment screenshot.`,
      );
      const waUrl = `https://wa.me/${WARIS_BHAI_WA_NUMBER}?text=${waText}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");

      toast.success(`Order #${orderId} placed! Waris Bhai will confirm soon.`);
      onClose();
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  const stepNumber = step === "details" ? 1 : 2;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-brand/10 flex items-center justify-center shrink-0">
                {step === "details" ? (
                  <User className="w-5 h-5 text-cyan-brand" />
                ) : (
                  <QrCode className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div>
                <DialogTitle className="font-display text-xl font-bold text-foreground">
                  {step === "details" ? "Your Details" : "Payment"}
                </DialogTitle>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Step {stepNumber} of 2
                </p>
              </div>
            </div>
            {/* Step indicators */}
            <div className="flex items-center gap-1.5">
              <div
                className={`w-8 h-1.5 rounded-full transition-colors ${
                  step === "details" ? "bg-cyan-brand" : "bg-blue-600"
                }`}
              />
              <div
                className={`w-8 h-1.5 rounded-full transition-colors ${
                  step === "payment" ? "bg-blue-600" : "bg-border"
                }`}
              />
            </div>
          </div>
        </DialogHeader>

        {/* Product summary */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-cyan-brand/5 border border-cyan-brand/20 mb-2">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
            <img
              src={
                product.imageUrl ||
                "/assets/generated/phone-iphone15pro.dim_400x400.jpg"
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-sm line-clamp-1">
              {product.name}
            </p>
            <p className="font-display font-bold text-cyan-brand text-lg">
              {product.price}
            </p>
          </div>
        </div>

        {/* ── Step 1: Details ── */}
        {step === "details" && (
          <form onSubmit={handleDetailsSubmit} className="space-y-4 mt-2">
            {/* Customer Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="order-name"
                className="text-sm font-semibold flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="order-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your full name"
                className="bg-background border-border focus-visible:ring-cyan-brand/30"
                required
                autoComplete="name"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label
                htmlFor="order-phone"
                className="text-sm font-semibold flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                Mobile Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="order-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="bg-background border-border focus-visible:ring-cyan-brand/30"
                required
                autoComplete="tel"
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label
                htmlFor="order-address"
                className="text-sm font-semibold flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                Delivery Address <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="order-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House/flat number, street, city, state, PIN code"
                className="bg-background border-border min-h-[90px] resize-y focus-visible:ring-cyan-brand/30"
                required
                autoComplete="street-address"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-1">
              <Button
                type="submit"
                className="w-full bg-cyan-brand text-ink hover:bg-cyan-light font-semibold"
              >
                Continue to Payment <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-border text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* ── Step 2: Payment ── */}
        {step === "payment" && (
          <div className="mt-2 space-y-4">
            {/* Back button */}
            <button
              type="button"
              onClick={() => setStep("details")}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {/* QR Code section */}
            <div className="rounded-2xl border-2 border-blue-500 bg-blue-50 p-5 text-center">
              <div className="flex justify-center mb-3">
                <img
                  src="/assets/uploads/WhatsApp-Image-2026-03-01-at-7.09.08-PM-1.jpeg"
                  alt="Scan QR Code to pay"
                  width={200}
                  height={200}
                  className="rounded-xl"
                />
              </div>
              <p className="font-bold text-blue-800 text-lg mb-1">
                Scan this QR Code to pay
              </p>
              <p className="text-blue-600 text-sm mb-3">
                Send screenshot for confirmation
              </p>
              <div className="inline-flex items-center gap-2 bg-white rounded-xl px-4 py-2 border border-blue-200">
                <span className="text-xs text-blue-500 font-semibold uppercase tracking-wider">
                  Amount
                </span>
                <span className="font-display font-bold text-2xl text-blue-600">
                  {product.price}
                </span>
              </div>
            </div>

            {/* Order summary */}
            {savedDetails && (
              <div className="rounded-lg bg-muted/40 border border-border px-4 py-3 space-y-1.5 text-sm">
                <p className="font-semibold text-foreground text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Order Summary
                </p>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-semibold text-foreground line-clamp-1 max-w-[60%] text-right">
                    {product.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-semibold text-foreground">
                    {savedDetails.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-display font-bold text-blue-600 text-base">
                    {product.price}
                  </span>
                </div>
              </div>
            )}

            {/* Instruction note */}
            <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 leading-relaxed">
              After scanning & paying, tap the button below. WhatsApp will open
              so you can send your payment screenshot to confirm the order.
            </p>

            {/* Confirm button */}
            <Button
              type="button"
              onClick={handleConfirmOrder}
              disabled={placeOrder.isPending}
              className="w-full bg-[#25D366] text-white hover:bg-[#1da855] font-semibold h-12 text-base"
            >
              {placeOrder.isPending ? (
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              ) : (
                <WhatsAppIcon />
              )}
              <span className="ml-2">
                {placeOrder.isPending
                  ? "Confirming..."
                  : "Confirm Order on WhatsApp"}
              </span>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
