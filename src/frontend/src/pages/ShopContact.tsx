import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitInquiryMutation } from "@/hooks/useShopQueries";
import { useSearch } from "@tanstack/react-router";
import { Clock, Loader2, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Route search params type
interface ContactSearch {
  product?: string;
}

const WHATSAPP_URL =
  "https://wa.me/919813983483?text=Hi%20Waris%20Bhai%2C%20I%20am%20interested%20in%20buying%20a%20mobile.%20Can%20you%20share%20the%20latest%20prices%3F";

export default function ShopContact() {
  const { mutateAsync: submitInquiry, isPending } = useSubmitInquiryMutation();

  const search = useSearch({ strict: false }) as ContactSearch;
  const productParam = search?.product ?? "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: productParam
      ? `Hi Waris Bhai, I'm interested in the "${productParam}". Can you share the latest price and availability?`
      : "",
  });

  useEffect(() => {
    if (productParam) {
      setForm((prev) => ({
        ...prev,
        message: `Hi Waris Bhai, I'm interested in the "${productParam}". Can you share the latest price and availability?`,
      }));
    }
  }, [productParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      await submitInquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      toast.success("Message sent! Waris Bhai will get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <p className="text-cyan-brand text-sm font-semibold uppercase tracking-widest mb-2">
          Get in Touch
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
          Contact Waris Bhai
        </h1>
        <p className="text-muted-foreground max-w-lg">
          Looking for a specific phone or the best price? Reach out directly —
          we respond within 1 hour!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-3"
        >
          <div className="bg-card rounded-2xl border border-border shadow-card p-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">
              Send a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-foreground"
                  >
                    Your Name <span className="text-cyan-brand">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    placeholder="Ahmed Khan"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="bg-background border-border focus-visible:ring-cyan-brand/30"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-foreground"
                  >
                    Email Address <span className="text-cyan-brand">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="ahmed@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="bg-background border-border focus-visible:ring-cyan-brand/30"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-sm font-semibold text-foreground"
                >
                  Message <span className="text-cyan-brand">*</span>
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us which phone you're looking for, your budget, etc..."
                  value={form.message}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, message: e.target.value }))
                  }
                  className="bg-background border-border focus-visible:ring-cyan-brand/30 min-h-[140px] resize-y"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-cyan-brand text-ink hover:bg-cyan-light font-semibold py-3"
                size="lg"
              >
                {isPending ? (
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                ) : (
                  <Send className="mr-2 w-4 h-4" />
                )}
                {isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Contact Info Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-5"
        >
          {/* WhatsApp Card */}
          <div className="bg-card rounded-2xl border border-whatsapp/30 shadow-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-whatsapp/15 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-whatsapp"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <p className="font-display font-bold text-foreground">
                  WhatsApp
                </p>
                <p className="text-xs text-muted-foreground">
                  Fastest way to reach us
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-1">
              Chat directly with Waris Bhai:
            </p>
            <p className="font-display font-bold text-foreground text-lg mb-4">
              +91 98139 83483
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-whatsapp text-white font-semibold text-sm hover:bg-whatsapp-dark transition-all"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-current"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Open WhatsApp
            </a>
          </div>

          {/* Email Card */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-cyan-brand/15 flex items-center justify-center">
                <Mail className="w-5 h-5 text-cyan-brand" />
              </div>
              <div>
                <p className="font-display font-bold text-foreground">Email</p>
                <p className="text-xs text-muted-foreground">
                  Official business email
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-1">Reach us at:</p>
            <p className="font-mono text-sm text-foreground font-semibold mb-4 break-all">
              warisbhaimewati@gmail.com
            </p>
            <a
              href="mailto:warisbhaimewati@gmail.com"
              className="w-full flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-cyan-brand text-ink font-semibold text-sm hover:bg-cyan-light transition-all"
            >
              <Mail className="w-4 h-4" />
              Click to Email
            </a>
          </div>

          {/* Phone Card */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                <Phone className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">
                  Phone / WhatsApp
                </p>
                <a
                  href="tel:+919813983483"
                  className="text-cyan-brand text-sm hover:text-cyan-light transition-colors"
                >
                  +91 98139 83483
                </a>
              </div>
            </div>
          </div>

          {/* Response time */}
          <div className="flex items-start gap-3 bg-whatsapp/5 rounded-2xl border border-whatsapp/20 p-5">
            <Clock className="w-5 h-5 text-whatsapp shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm mb-1">
                We respond within 1 hour!
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Business hours: 9 AM – 9 PM, 7 days a week. WhatsApp is the
                fastest way to reach us for quick replies.
              </p>
            </div>
          </div>

          {/* Contact form link */}
          <div className="flex items-start gap-3 bg-secondary rounded-2xl border border-border p-5">
            <MessageCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm mb-1">
                Location
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Waris Bhai Mobiles, Main Market, Mewat (Nuh), Haryana – India
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
