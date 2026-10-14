import { createContext, useContext, useEffect, useMemo, useState } from "react";

import api from "../api/api";


const dictionaries = {
  fa: {
    searchPlaceholder: "جست‌وجوی محصول...",
    cart: "سبد خرید",
    loginRegister: "ورود / ثبت‌نام",
    logout: "خروج از حساب",
    myOrders: "سفارش‌های من",
    galleryEyebrow: "مجموعه فروشگاه",
    galleryTitle: "محصولات منتخب برای فضای شما",
    gallerySubtitle: "با فیلترهای دقیق، انتخاب مناسب خانه‌تان را سریع‌تر پیدا کنید.",
    filterTitle: "فیلتر محصولات",
    category: "دسته‌بندی",
    allProducts: "همه محصولات",
    priceRange: "محدوده قیمت",
    minPrice: "حداقل قیمت",
    maxPrice: "حداکثر قیمت",
    applyPrice: "اعمال محدوده قیمت",
    sort: "مرتب‌سازی",
    newest: "جدیدترین",
    cheapest: "ارزان‌ترین",
    mostExpensive: "گران‌ترین",
    productName: "نام محصول",
    mostStock: "بیشترین موجودی",
    resetFilters: "پاک کردن فیلترها",
    loadingProducts: "در حال دریافت محصولات...",
    productsError: "دریافت محصولات انجام نشد.",
    noProducts: "محصولی با این مشخصات پیدا نشد.",
    noImage: "بدون تصویر",
    productsCount: "محصول",
    latestProducts: "جدیدترین محصولات",
    latestSubtitle: "تازه‌ترین انتخاب‌ها برای یک فضای مدرن و آرام",
    viewAllProducts: "مشاهده همه محصولات",
    viewProducts: "مشاهده محصولات",
    categories: "دسته‌بندی‌های محبوب",
    categoriesSubtitle: "از میان مجموعه‌های منتخب، سبک مناسب خانه‌تان را پیدا کنید.",
    contact: "ارتباط با ما",
    quickAccess: "دسترسی سریع",
    newsletter: "خبرنامه",
    newsletterText: "برای دریافت تازه‌ترین محصولات و پیشنهادها عضو شوید.",
    emailPlaceholder: "ایمیل شما",
    subscribe: "عضویت",
    rights: "تمام حقوق محفوظ است.",
    toman: "تومان",
    previous: "قبلی",
    next: "بعدی",
    loginTitle: "ورود به حساب کاربری",
    registerTitle: "ساخت حساب کاربری",
    loginSubtitle: "برای ادامه خرید وارد حساب خود شوید.",
    registerSubtitle: "برای ثبت سفارش یک حساب کاربری بسازید.",
    username: "نام کاربری",
    email: "ایمیل",
    password: "رمز عبور",
    passwordConfirm: "تکرار رمز عبور",
    pleaseWait: "لطفاً صبر کنید...",
    login: "ورود",
    register: "ثبت‌نام",
    alreadyRegistered: "قبلاً ثبت‌نام کرده‌اید؟",
    noAccount: "هنوز حساب ندارید؟",
    signIn: "وارد شوید",
    signUp: "ثبت‌نام کنید",
    passwordMismatch: "تکرار رمز عبور با رمز عبور یکسان نیست.",
    checkingAccount: "در حال بررسی حساب کاربری...",
    checkoutTitle: "تکمیل و ثبت سفارش",
    deliveryInfo: "اطلاعات تحویل",
    firstName: "نام",
    lastName: "نام خانوادگی",
    phone: "شماره تماس",
    fullAddress: "نشانی کامل",
    postalCode: "کد پستی",
    orderNotes: "توضیحات سفارش",
    submitOrder: "ثبت نهایی سفارش",
    submittingOrder: "در حال ثبت سفارش...",
    orderSummary: "خلاصه سفارش",
    totalAmount: "مبلغ کل",
    emptyCart: "سبد خرید شما خالی است.",
    continueShopping: "مشاهده محصولات",
    continueCheckout: "ادامه و ثبت سفارش",
    quantity: "تعداد",
    stock: "موجودی",
    sum: "جمع",
    removedFromCart: "محصول از سبد خرید حذف شد.",
    stockLimit: "بیشتر از موجودی محصول نمی‌توانید اضافه کنید.",
    orderSuccess: "سفارش شما با موفقیت ثبت شد",
    orderNumber: "شماره سفارش",
    finalAmount: "مبلغ نهایی",
    viewMyOrders: "مشاهده سفارش‌های من",
    ordersTitle: "سفارش‌های من",
    noOrders: "هنوز سفارشی ثبت نکرده‌اید.",
    loadingOrders: "در حال دریافت سفارش‌ها...",
    addToCart: "افزودن به سبد خرید",
    addedToCart: "محصول به سبد خرید اضافه شد.",
    productUnavailable: "محصول در دسترس نیست.",
    productNotFound: "محصول مورد نظر پیدا نشد.",
    loadingProduct: "در حال دریافت اطلاعات محصول...",
    productCategory: "دسته‌بندی",
    noProductImage: "تصویری برای این محصول ثبت نشده است.",
    notFoundTitle: "صفحه مورد نظر پیدا نشد",
    backHome: "بازگشت به صفحه اصلی",
    contactTitle: "تماس با ما",
    message: "پیام",
    sendMessage: "ارسال پیام",
    freeShipping: "ارسال رایگان",
    freeShippingText: "ارسال سریع و مطمئن سفارش‌ها به سراسر کشور.",
    guarantee: "ضمانت بازگشت وجه",
    guaranteeText: "خریدی امن با امکان بازگشت مطابق شرایط فروشگاه.",
    customerSupport: "پشتیبانی همیشه همراه",
    customerSupportText: "پاسخ‌گویی و راهنمایی در تمام مراحل خرید.",
    registerFailed: "ثبت‌نام انجام نشد.",
    loginFailed: "نام کاربری یا رمز عبور نادرست است.",
    orderFailed: "ثبت سفارش انجام نشد.",
    ordersFailed: "دریافت سفارش‌ها انجام نشد.",
  },
  en: {
    searchPlaceholder: "Search products...",
    cart: "Cart",
    loginRegister: "Login / Register",
    logout: "Sign out",
    myOrders: "My orders",
    galleryEyebrow: "Shop collection",
    galleryTitle: "Curated products for your space",
    gallerySubtitle: "Use precise filters to find the right piece for your home faster.",
    filterTitle: "Product filters",
    category: "Category",
    allProducts: "All products",
    priceRange: "Price range",
    minPrice: "Minimum price",
    maxPrice: "Maximum price",
    applyPrice: "Apply price range",
    sort: "Sort by",
    newest: "Newest",
    cheapest: "Lowest price",
    mostExpensive: "Highest price",
    productName: "Product name",
    mostStock: "Most in stock",
    resetFilters: "Reset filters",
    loadingProducts: "Loading products...",
    productsError: "Could not load products.",
    noProducts: "No products match these filters.",
    noImage: "No image",
    productsCount: "products",
    latestProducts: "Latest products",
    latestSubtitle: "Fresh selections for a calm, modern space",
    viewAllProducts: "View all products",
    viewProducts: "View products",
    categories: "Popular categories",
    categoriesSubtitle: "Browse curated collections and find your home's style.",
    contact: "Contact",
    quickAccess: "Quick links",
    newsletter: "Newsletter",
    newsletterText: "Join to receive new products and special offers.",
    emailPlaceholder: "Your email",
    subscribe: "Subscribe",
    rights: "All rights reserved.",
    toman: "Toman",
    previous: "Previous",
    next: "Next",
    loginTitle: "Sign in to your account",
    registerTitle: "Create an account",
    loginSubtitle: "Sign in to continue your purchase.",
    registerSubtitle: "Create an account to place your order.",
    username: "Username",
    email: "Email",
    password: "Password",
    passwordConfirm: "Confirm password",
    pleaseWait: "Please wait...",
    login: "Login",
    register: "Register",
    alreadyRegistered: "Already have an account?",
    noAccount: "Don't have an account?",
    signIn: "Sign in",
    signUp: "Register",
    passwordMismatch: "The password confirmation does not match.",
    checkingAccount: "Checking your account...",
    checkoutTitle: "Complete your order",
    deliveryInfo: "Delivery information",
    firstName: "First name",
    lastName: "Last name",
    phone: "Phone",
    fullAddress: "Full address",
    postalCode: "Postal code",
    orderNotes: "Order notes",
    submitOrder: "Place order",
    submittingOrder: "Placing order...",
    orderSummary: "Order summary",
    totalAmount: "Total",
    emptyCart: "Your cart is empty.",
    continueShopping: "Browse products",
    continueCheckout: "Continue to checkout",
    quantity: "Quantity",
    stock: "Stock",
    sum: "Subtotal",
    removedFromCart: "Product removed from your cart.",
    stockLimit: "You cannot add more than the available stock.",
    orderSuccess: "Your order was placed successfully",
    orderNumber: "Order number",
    finalAmount: "Final amount",
    viewMyOrders: "View my orders",
    ordersTitle: "My orders",
    noOrders: "You have not placed an order yet.",
    loadingOrders: "Loading orders...",
    addToCart: "Add to cart",
    addedToCart: "Product added to your cart.",
    productUnavailable: "Product is unavailable.",
    productNotFound: "The requested product was not found.",
    loadingProduct: "Loading product details...",
    productCategory: "Category",
    noProductImage: "No image is available for this product.",
    notFoundTitle: "The page could not be found",
    backHome: "Back to home",
    contactTitle: "Contact us",
    message: "Message",
    sendMessage: "Send message",
    freeShipping: "Free shipping",
    freeShippingText: "Fast and reliable delivery across the country.",
    guarantee: "Money-back guarantee",
    guaranteeText: "Shop safely with returns under store policy.",
    customerSupport: "Dedicated support",
    customerSupportText: "Guidance and support throughout your purchase.",
    registerFailed: "Registration failed.",
    loginFailed: "The username or password is incorrect.",
    orderFailed: "The order could not be placed.",
    ordersFailed: "Orders could not be loaded.",
  },
};


const defaultConfig = {
  site_name: "Nexa Home",
  logo: null,
  language: "fa",
  direction: "rtl",
  design_preset: "warm",
  announcement: "",
  carousel_configured: false,
  carousel_slides: [],
  navigation: [
    { id: "home", label: "خانه", url: "/", open_in_new_tab: false },
    { id: "shop", label: "فروشگاه", url: "/Gallery", open_in_new_tab: false },
  ],
  hero: {
    title: "خانه‌ای که شبیه شماست",
    subtitle: "مبلمان مدرن، باکیفیت و ماندگار برای ساختن فضایی آرام و متفاوت.",
    button_text: "مشاهده محصولات",
    image: null,
  },
  footer: { text: "", email: "", phone: "", address: "" },
  theme: {
    primary: "#17211B",
    secondary: "#DCE8DF",
    accent: "#D97745",
    background: "#F4F5F0",
    surface: "#FFFFFF",
    text: "#17211B",
    muted: "#6C746E",
    font_family: "IRANSansX, Tahoma, Arial, sans-serif",
    border_radius: 22,
    container_width: 1320,
  },
};


export const SiteConfigContext = createContext({
  config: defaultConfig,
  loading: true,
  t: (key) => dictionaries.fa[key] || key,
});


export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadConfig = async () => {
      try {
        const response = await api.get("/api/site/config/", {
          params: { refreshed_at: Date.now() },
        });

        if (isActive) {
          setConfig(response.data);
        }
      } catch (error) {
        console.error("Could not load site configuration:", error);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    const refreshOnVisibility = () => {
      if (document.visibilityState === "visible") {
        loadConfig();
      }
    };

    loadConfig();

    window.addEventListener("focus", loadConfig);
    document.addEventListener("visibilitychange", refreshOnVisibility);

    return () => {
      isActive = false;
      window.removeEventListener("focus", loadConfig);
      document.removeEventListener("visibilitychange", refreshOnVisibility);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const theme = config.theme || defaultConfig.theme;

    root.lang = config.language || "fa";
    root.dir = config.direction || "rtl";
    root.dataset.design = config.design_preset || "warm";
    document.title = config.site_name || "Nexa Home";

    root.style.setProperty("--color-primary", theme.primary);
    root.style.setProperty("--color-secondary", theme.secondary);
    root.style.setProperty("--color-accent", theme.accent);
    root.style.setProperty("--color-background", theme.background);
    root.style.setProperty("--color-surface", theme.surface);
    root.style.setProperty("--color-text", theme.text);
    root.style.setProperty("--color-muted", theme.muted);
    root.style.setProperty("--font-family", theme.font_family);
    root.style.setProperty("--radius", `${theme.border_radius}px`);
    root.style.setProperty("--container-width", `${theme.container_width}px`);
  }, [config]);

  const value = useMemo(() => {
    const dictionary = dictionaries[config.language] || dictionaries.fa;
    return {
      config,
      loading,
      t: (key) => dictionary[key] || key,
    };
  }, [config, loading]);

  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}


// eslint-disable-next-line react-refresh/only-export-components
export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
