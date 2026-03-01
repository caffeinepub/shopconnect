import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Product type and storage
  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Text;
    imageUrl : Text;
    category : Text;
    inStock : Bool;
  };

  let products = Map.empty<Nat, Product>();
  var nextProductId = 1;

  // Contact inquiry type and storage
  public type ContactInquiry = {
    id : Nat;
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
  };

  let inquiries = Map.empty<Nat, ContactInquiry>();
  var nextInquiryId = 1;

  // User profile type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Order type and storage
  public type Order = {
    id : Nat;
    productId : Nat;
    productName : Text;
    productPrice : Text;
    customerName : Text;
    customerPhone : Text;
    customerAddress : Text;
    status : Text;
    timestamp : Int;
  };

  let orders = Map.empty<Nat, Order>();
  var nextOrderId = 1;

  // User profile functions (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product management functions
  public shared ({ caller }) func addProduct(name : Text, description : Text, price : Text, imageUrl : Text, category : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    let productId = nextProductId;
    nextProductId += 1;

    let product : Product = {
      id = productId;
      name;
      description;
      price;
      imageUrl;
      category;
      inStock = true;
    };

    products.add(productId, product);
    productId;
  };

  public shared ({ caller }) func updateProduct(id : Nat, name : Text, description : Text, price : Text, imageUrl : Text, category : Text, inStock : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    switch (products.get(id)) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (?_) {
        let updatedProduct : Product = {
          id;
          name;
          description;
          price;
          imageUrl;
          category;
          inStock;
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };
    products.remove(id);
  };

  // Public product queries (no authorization needed - accessible to all including guests)
  public query func getProducts() : async [Product] {
    products.values().toArray();
  };

  public query func getProduct(id : Nat) : async ?Product {
    products.get(id);
  };

  // Contact inquiry functions
  public shared func submitInquiry(name : Text, email : Text, message : Text) : async () {
    // No authorization check - anyone including guests can submit inquiries
    let inquiryId = nextInquiryId;
    nextInquiryId += 1;

    let inquiry : ContactInquiry = {
      id = inquiryId;
      name;
      email;
      message;
      timestamp = Time.now();
    };

    inquiries.add(inquiryId, inquiry);
  };

  public query ({ caller }) func getInquiries() : async [ContactInquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view inquiries");
    };
    inquiries.values().toArray();
  };

  // Order management functions
  public shared ({ caller }) func placeOrder(
    productId : Nat,
    productName : Text,
    productPrice : Text,
    customerName : Text,
    customerPhone : Text,
    customerAddress : Text,
  ) : async Nat {
    let orderId = nextOrderId;
    nextOrderId += 1;

    let order : Order = {
      id = orderId;
      productId;
      productName;
      productPrice;
      customerName;
      customerPhone;
      customerAddress;
      status = "pending";
      timestamp = Time.now();
    };

    orders.add(orderId, order);
    orderId;
  };

  public query ({ caller }) func getOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(orderId)) {
      case (null) {
        Runtime.trap("Order not found");
      };
      case (?order) {
        let updatedOrder : Order = {
          order with
          status
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  // Admin check
  public query ({ caller }) func isAdmin() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin);
  };
};
