import type { ContactInquiry, Order, Product } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddProductMutation,
  useDeleteProductMutation,
  useInquiries,
  useIsAdmin,
  useOrders,
  useProducts,
  useUpdateOrderStatusMutation,
  useUpdateProductMutation,
} from "@/hooks/useShopQueries";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Inbox,
  Loader2,
  Package,
  Pencil,
  Plus,
  Save,
  Settings,
  ShieldAlert,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ── Types ────────────────────────────────────────────────────────────────────

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
}

const EMPTY_FORM: ProductFormData = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  category: "",
  inStock: true,
};

// ── Product Form Modal ────────────────────────────────────────────────────────

function ProductFormModal({
  initial,
  title,
  onSave,
  onClose,
  isSaving,
}: {
  initial: ProductFormData;
  title: string;
  onSave: (data: ProductFormData) => void;
  onClose: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<ProductFormData>(initial);

  const set =
    (field: keyof ProductFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price.trim() || !form.category.trim()) {
      toast.error("Name, price, and category are required.");
      return;
    }
    onSave(form);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="pname" className="text-sm font-semibold">
                Product Name <span className="text-cyan-brand">*</span>
              </Label>
              <Input
                id="pname"
                value={form.name}
                onChange={set("name")}
                placeholder="Handcrafted Ceramic Mug"
                className="bg-background border-border"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pprice" className="text-sm font-semibold">
                Price <span className="text-cyan-brand">*</span>
              </Label>
              <Input
                id="pprice"
                value={form.price}
                onChange={set("price")}
                placeholder="$38.00"
                className="bg-background border-border"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pcat" className="text-sm font-semibold">
                Category <span className="text-cyan-brand">*</span>
              </Label>
              <Input
                id="pcat"
                value={form.category}
                onChange={set("category")}
                placeholder="Home & Kitchen"
                className="bg-background border-border"
                required
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="pdesc" className="text-sm font-semibold">
                Description
              </Label>
              <Textarea
                id="pdesc"
                value={form.description}
                onChange={set("description")}
                placeholder="Describe your product..."
                className="bg-background border-border min-h-[90px] resize-y"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="pimage" className="text-sm font-semibold">
                Image URL
              </Label>
              <Input
                id="pimage"
                value={form.imageUrl}
                onChange={set("imageUrl")}
                placeholder="https://example.com/image.jpg"
                className="bg-background border-border"
              />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <Switch
                id="pinstock"
                checked={form.inStock}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, inStock: checked }))
                }
                className="data-[state=checked]:bg-success"
              />
              <Label
                htmlFor="pinstock"
                className="cursor-pointer text-sm font-medium"
              >
                In Stock
              </Label>
            </div>
          </div>
          <DialogFooter className="gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-cyan-brand text-ink hover:bg-cyan-light"
            >
              {isSaving ? (
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              ) : null}
              {isSaving ? "Saving..." : "Save Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Delete Confirm ────────────────────────────────────────────────────────────

function DeleteConfirmModal({
  product,
  onConfirm,
  onClose,
  isDeleting,
}: {
  product: Product;
  onConfirm: () => void;
  onClose: () => void;
  isDeleting: boolean;
}) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <DialogTitle className="font-display text-lg font-bold">
              Delete Product
            </DialogTitle>
          </div>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Are you sure you want to delete{" "}
          <strong className="text-foreground">"{product.name}"</strong>? This
          action cannot be undone.
        </p>
        <DialogFooter className="gap-2 mt-4">
          <Button variant="outline" onClick={onClose} className="border-border">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 w-4 h-4" />
            )}
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Products Tab ──────────────────────────────────────────────────────────────

function ProductsTab() {
  const { data: products, isLoading } = useProducts();
  const addMutation = useAddProductMutation();
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();

  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const handleAdd = async (data: ProductFormData) => {
    try {
      await addMutation.mutateAsync(data);
      toast.success("Product added successfully!");
      setShowAdd(false);
    } catch {
      toast.error("Failed to add product.");
    }
  };

  const handleEdit = async (data: ProductFormData) => {
    if (!editProduct) return;
    try {
      await updateMutation.mutateAsync({ id: editProduct.id, ...data });
      toast.success("Product updated!");
      setEditProduct(null);
    } catch {
      toast.error("Failed to update product.");
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;
    try {
      await deleteMutation.mutateAsync(deleteProduct.id);
      toast.success("Product deleted.");
      setDeleteProduct(null);
    } catch {
      toast.error("Failed to delete product.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">
          Products ({products?.length ?? 0})
        </h2>
        <Button
          onClick={() => setShowAdd(true)}
          className="bg-cyan-brand text-ink hover:bg-cyan-light"
          size="sm"
        >
          <Plus className="mr-2 w-4 h-4" />
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {["sk-1", "sk-2", "sk-3", "sk-4"].map((k) => (
            <Skeleton key={k} className="h-14 w-full" />
          ))}
        </div>
      ) : !products || products.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-semibold mb-1">No products yet</p>
          <p className="text-muted-foreground text-sm mb-4">
            Add your first product to get started.
          </p>
          <Button
            onClick={() => setShowAdd(true)}
            variant="outline"
            className="border-cyan-brand text-cyan-brand hover:bg-cyan-brand hover:text-ink"
            size="sm"
          >
            <Plus className="mr-2 w-4 h-4" />
            Add Product
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden shadow-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 border-border hover:bg-muted/50">
                <TableHead className="font-semibold text-foreground">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-foreground hidden sm:table-cell">
                  Category
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Price
                </TableHead>
                <TableHead className="font-semibold text-foreground hidden md:table-cell">
                  Stock
                </TableHead>
                <TableHead className="font-semibold text-foreground text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.id.toString()}
                  className="border-border hover:bg-muted/20"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary overflow-hidden shrink-0">
                        <img
                          src={
                            product.imageUrl ||
                            "https://placehold.co/40x40?text=P"
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-muted-foreground text-xs line-clamp-1 hidden sm:block">
                          {product.description.slice(0, 50)}...
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge className="bg-cyan-brand/10 text-cyan-brand border-cyan-brand/20 text-xs">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-display font-bold text-cyan-brand">
                    {product.price}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.inStock ? (
                      <Badge className="bg-success/10 text-success border-success/20 text-xs">
                        In Stock
                      </Badge>
                    ) : (
                      <Badge className="bg-muted text-muted-foreground border-border text-xs">
                        Out of Stock
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditProduct(product)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteProduct(product)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {showAdd && (
        <ProductFormModal
          initial={EMPTY_FORM}
          title="Add New Product"
          onSave={handleAdd}
          onClose={() => setShowAdd(false)}
          isSaving={addMutation.isPending}
        />
      )}

      {editProduct && (
        <ProductFormModal
          initial={{
            name: editProduct.name,
            description: editProduct.description,
            price: editProduct.price,
            imageUrl: editProduct.imageUrl,
            category: editProduct.category,
            inStock: editProduct.inStock,
          }}
          title="Edit Product"
          onSave={handleEdit}
          onClose={() => setEditProduct(null)}
          isSaving={updateMutation.isPending}
        />
      )}

      {deleteProduct && (
        <DeleteConfirmModal
          product={deleteProduct}
          onConfirm={handleDelete}
          onClose={() => setDeleteProduct(null)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}

// ── Inquiries Tab ─────────────────────────────────────────────────────────────

function InquiriesTab() {
  const { data: inquiries, isLoading } = useInquiries();

  const formatDate = (ts: bigint) => {
    const ms = Number(ts) / 1_000_000; // nanoseconds → ms
    const date = new Date(ms);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-6">
        Customer Inquiries ({inquiries?.length ?? 0})
      </h2>

      {isLoading ? (
        <div className="space-y-3">
          {["sk-1", "sk-2", "sk-3"].map((k) => (
            <Skeleton key={k} className="h-20 w-full" />
          ))}
        </div>
      ) : !inquiries || inquiries.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <Inbox className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-semibold mb-1">No inquiries yet</p>
          <p className="text-muted-foreground text-sm">
            Customer messages will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {[...inquiries]
            .sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1))
            .map((inquiry: ContactInquiry) => (
              <div
                key={inquiry.id.toString()}
                className="bg-card rounded-xl border border-border shadow-card p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-semibold text-foreground">
                      {inquiry.name}
                    </p>
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="text-cyan-brand text-sm hover:underline"
                    >
                      {inquiry.email}
                    </a>
                  </div>
                  <span className="text-muted-foreground text-xs shrink-0">
                    {formatDate(inquiry.timestamp)}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {inquiry.message}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// ── Orders Tab ────────────────────────────────────────────────────────────────

function OrderStatusBadge({ status }: { status: string }) {
  if (status === "confirmed") {
    return (
      <Badge className="bg-whatsapp/10 text-whatsapp border-whatsapp/20 text-xs flex items-center gap-1 w-fit">
        <CheckCircle2 className="w-3 h-3" />
        Confirmed
      </Badge>
    );
  }
  if (status === "rejected") {
    return (
      <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs flex items-center gap-1 w-fit">
        <XCircle className="w-3 h-3" />
        Rejected
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs flex items-center gap-1 w-fit">
      <Loader2 className="w-3 h-3" />
      Pending
    </Badge>
  );
}

function OrdersTab() {
  const { data: orders, isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatusMutation();

  const formatDate = (ts: bigint) => {
    const ms = Number(ts) / 1_000_000;
    const date = new Date(ms);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleUpdateStatus = async (order: Order, status: string) => {
    try {
      await updateStatus.mutateAsync({ orderId: order.id, status });
      toast.success(
        `Order #${order.id} ${status === "confirmed" ? "confirmed" : "rejected"}!`,
      );
    } catch {
      toast.error("Failed to update order status.");
    }
  };

  const sortedOrders = orders
    ? [...orders].sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1))
    : [];

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-6">
        Orders ({orders?.length ?? 0})
      </h2>

      {isLoading ? (
        <div className="space-y-3">
          {["sk-1", "sk-2", "sk-3"].map((k) => (
            <Skeleton key={k} className="h-16 w-full" />
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <ClipboardList className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-semibold mb-1">No orders yet</p>
          <p className="text-muted-foreground text-sm">
            Customer orders will appear here once they start buying.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 border-border hover:bg-muted/50">
                  <TableHead className="font-semibold text-foreground w-20">
                    Order #
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Product
                  </TableHead>
                  <TableHead className="font-semibold text-foreground hidden sm:table-cell">
                    Customer
                  </TableHead>
                  <TableHead className="font-semibold text-foreground hidden md:table-cell">
                    Address
                  </TableHead>
                  <TableHead className="font-semibold text-foreground hidden lg:table-cell">
                    Date
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrders.map((order: Order) => (
                  <TableRow
                    key={order.id.toString()}
                    className="border-border hover:bg-muted/20"
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{order.id.toString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-foreground text-sm line-clamp-1">
                          {order.productName}
                        </p>
                        <p className="font-display font-bold text-cyan-brand text-sm">
                          {order.productPrice}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {order.customerName}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {order.customerPhone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <p className="text-muted-foreground text-xs max-w-[180px] line-clamp-2">
                        {order.customerAddress}
                      </p>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">
                      {formatDate(order.timestamp)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {order.status !== "confirmed" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdateStatus(order, "confirmed")
                            }
                            disabled={updateStatus.isPending}
                            className="h-7 px-2.5 text-xs bg-whatsapp text-white hover:bg-whatsapp-dark font-semibold"
                          >
                            {updateStatus.isPending ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                            )}
                            Confirm
                          </Button>
                        )}
                        {order.status !== "rejected" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateStatus(order, "rejected")
                            }
                            disabled={updateStatus.isPending}
                            className="h-7 px-2.5 text-xs border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Settings Tab ──────────────────────────────────────────────────────────────

function SettingsTab() {
  return (
    <div className="max-w-xl">
      <h2 className="font-display text-xl font-bold text-foreground mb-6">
        Settings
      </h2>

      <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-5">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-whatsapp/10 border border-whatsapp/25">
          <div className="w-9 h-9 rounded-full bg-whatsapp/20 flex items-center justify-center shrink-0">
            <Save className="w-4 h-4 text-whatsapp" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm mb-1">
              WhatsApp Number is Pre-Configured
            </p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              All order notifications go to{" "}
              <strong className="text-foreground font-mono">
                +91 98139 83483
              </strong>{" "}
              (Waris Bhai). This is hardcoded in the app for security.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            Active WhatsApp Number
          </Label>
          <Input
            value="919813983483"
            readOnly
            className="bg-background border-border font-mono text-cyan-brand"
          />
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed bg-muted/50 rounded-lg px-3 py-2.5">
          To change the WhatsApp number, contact your developer to update the
          configuration. Customers who place orders will always be redirected to
          this number.
        </p>
      </div>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────

export default function ShopAdmin() {
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();

  if (isCheckingAdmin) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Checking permissions...</span>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-3">
          Access Denied
        </h1>
        <p className="text-muted-foreground max-w-sm mx-auto text-sm">
          You don't have permission to view this page. Please log in with an
          admin account to access the dashboard.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-cyan-brand text-sm font-semibold uppercase tracking-widest mb-2">
          Dashboard
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
          Admin Panel
        </h1>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="bg-secondary border border-border mb-8 flex-wrap h-auto gap-1">
          <TabsTrigger
            value="products"
            className="data-[state=active]:bg-cyan-brand data-[state=active]:text-ink font-semibold"
          >
            <Package className="mr-2 w-4 h-4" />
            Products
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="data-[state=active]:bg-cyan-brand data-[state=active]:text-ink font-semibold"
          >
            <ClipboardList className="mr-2 w-4 h-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger
            value="inquiries"
            className="data-[state=active]:bg-cyan-brand data-[state=active]:text-ink font-semibold"
          >
            <Inbox className="mr-2 w-4 h-4" />
            Inquiries
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-cyan-brand data-[state=active]:text-ink font-semibold"
          >
            <Settings className="mr-2 w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductsTab />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>

        <TabsContent value="inquiries">
          <InquiriesTab />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </main>
  );
}
