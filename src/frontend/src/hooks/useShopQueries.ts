import type { ContactInquiry, Order, Product } from "@/backend.d";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

// ── Products ──────────────────────────────────────────────────────────────────

export function useProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useProduct(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product | null>({
    queryKey: ["product", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && id !== null,
    staleTime: 30_000,
  });
}

export function useAddProductMutation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<
    bigint,
    Error,
    {
      name: string;
      description: string;
      price: string;
      imageUrl: string;
      category: string;
    }
  >({
    mutationFn: async ({ name, description, price, imageUrl, category }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addProduct(name, description, price, imageUrl, category);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProductMutation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    {
      id: bigint;
      name: string;
      description: string;
      price: string;
      imageUrl: string;
      category: string;
      inStock: boolean;
    }
  >({
    mutationFn: async ({
      id,
      name,
      description,
      price,
      imageUrl,
      category,
      inStock,
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateProduct(
        id,
        name,
        description,
        price,
        imageUrl,
        category,
        inStock,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProductMutation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteProduct(id);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ── Inquiries ────────────────────────────────────────────────────────────────

export function useSubmitInquiryMutation() {
  const { actor } = useActor();

  return useMutation<
    void,
    Error,
    { name: string; email: string; message: string }
  >({
    mutationFn: async ({ name, email, message }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitInquiry(name, email, message);
    },
  });
}

export function useInquiries() {
  const { actor, isFetching } = useActor();
  return useQuery<ContactInquiry[]>({
    queryKey: ["inquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInquiries();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ── Orders ────────────────────────────────────────────────────────────────────

export function useOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrders();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function usePlaceOrderMutation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<
    bigint,
    Error,
    {
      productId: bigint;
      productName: string;
      productPrice: string;
      customerName: string;
      customerPhone: string;
      customerAddress: string;
    }
  >({
    mutationFn: async ({
      productId,
      productName,
      productPrice,
      customerName,
      customerPhone,
      customerAddress,
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.placeOrder(
        productId,
        productName,
        productPrice,
        customerName,
        customerPhone,
        customerAddress,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useUpdateOrderStatusMutation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { orderId: bigint; status: string }>({
    mutationFn: async ({ orderId, status }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateOrderStatus(orderId, status);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// ── Admin check ───────────────────────────────────────────────────────────────

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}
