import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  ShieldCheck, 
  Star, 
  CheckCircle, 
  ShoppingCart, 
  Tag, 
  Zap, 
  AlertCircle,
  Clock,
  Users,
  Shield,
  Truck
} from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { useSettings } from '@/context/SettingsContext';
import { getProductImage, getStockLabel, isProductInStock } from "@/data/products";

/* ---------- Helper Functions & Hooks ---------- */
function safeNum(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function useSafeCurrency() {
  try {
    const currencyCtx = useCurrency();
    if (!currencyCtx) throw new Error();
    return currencyCtx;
  } catch {
    return {
      formatPrice: (x: number) => `PKR ${Number(x || 0).toLocaleString()}`,
    };
  }
}

function useSafeCart() {
  try {
    const cartCtx = useCart();
    if (!cartCtx) throw new Error();
    return cartCtx;
  } catch {
    return { addToCart: (_: unknown) => console.error("Cart context not found.") };
  }
}

/* ---------- Custom Hooks ---------- */
function useProductPricing(price: AnyProduct['price']) {
  return useMemo(() => {
    const current = safeNum(price?.monthly) || safeNum(price?.yearly) || 0;
    let original = safeNum(price?.original) || 0;
    
    if (original > 0 && current > 0 && original <= current) {
      original = current * 1.5;
    } else if (original === 0 && current > 0) {
      original = current * 2;
    }
    
    const savings = Math.max(original - current, 0);
    const discount = original > 0 ? Math.round((savings / original) * 100) : 0;
    
    return { current, original, savings, discount };
  }, [price]);
}

function useStockInfo(stock: AnyProduct['stock']) {
  return useMemo(() => {
    const isInStock = isProductInStock(stock);
    const label = getStockLabel(stock);
    let quantity = 0;
    
    if (typeof stock === 'number') {
      quantity = stock;
    }
    
    return { isInStock, label, quantity };
  }, [stock]);
}

/* ---------- Data Type for Product ---------- */
type AnyProduct = {
  id: string;
  name: string;
  category: string;
  image?: string;
  features?: string[];
  rating?: number;
  price?: { monthly?: number; yearly?: number; original?: number };
  stockStatus?: "in_stock" | "out_of_stock";
  badge?: string;
  stock?: boolean | number | "unlimited";
};

type WhatsAppOrderForm = {
  name: string;
  email: string;
  phone: string;
  city: string;
};

interface WhatsAppOrderPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: AnyProduct;
  price: number;
  onOrder: (form: WhatsAppOrderForm) => void;
  idPrefix: string;
}

import { useSettings } from '@/context/SettingsContext';

// WhatsApp Order Popup Form
function WhatsAppOrderPopup({ open, onOpenChange, product, price, onOrder, idPrefix }: WhatsAppOrderPopupProps) {
  const [form, setForm] = useState<WhatsAppOrderForm>({ name: '', email: '', phone: '', city: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const fieldPrefix = idPrefix || (product?.id ?? "product");

  useEffect(() => {
    if (open && nameRef.current) nameRef.current.focus();
    if (!open) setForm({ name: "", email: "", phone: "", city: "" });
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Name and phone are required.");
      return;
    }
    setLoading(true);
    try {
      // Save to backend
      await fetch("/api/products/whatsapp-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          product: product.name,
          price,
        }),
      });
      setLoading(false);
      onOrder(form);
      onOpenChange(false);
    } catch (err) {
      setError("Failed to save order. Try again.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-modal="true" role="dialog" className="max-w-md w-full">
        <DialogHeader>
          <h2 className="text-lg font-bold">Order via WhatsApp</h2>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3" aria-label="WhatsApp Order Form">
          <Input
            ref={nameRef}
            id="wa_name"
            name="name"
            placeholder="Your Name*"
            value={form.name}
            onChange={handleChange}
            aria-label="Name"
            required
            autoComplete="name"
          />
          <Input
            id="wa_email"
            name="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={handleChange}
            aria-label="Email"
            type="email"
            autoComplete="email"
          />
          <Input
            id="wa_phone"
            name="phone"
            placeholder="Phone Number*"
            value={form.phone}
            onChange={handleChange}
            aria-label="Phone"
            required
            autoComplete="tel"
          />
          <Input
            id="wa_city"
            name="city"
            placeholder="City (optional)"
            value={form.city}
            onChange={handleChange}
            aria-label="City"
            autoComplete="address-level2"
          />
          {error && <div className="text-red-600 text-xs">{error}</div>}
          <DialogFooter>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading} aria-label="Submit WhatsApp Order">
              <span className="font-bold flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Place Order &amp; Open WhatsApp
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- The Optimized Component ---------- */
export default function ProductCardSimple({ product }: { product: AnyProduct }) {
  const { formatPrice } = useSafeCurrency();
  const { addToCart } = useSafeCart();
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const [waOpen, setWaOpen] = useState(false);

  const { settings } = useSettings();
  const whatsappNumberDigits = settings.whatsappNumber.replace(/\D/g, '') || '923276847960';
  const directWhatsApp = settings.whatsappDirectOrder;
  const showDiscountBadges = settings.showDiscountBadges;

  // Use utility functions for image and stock
  const imageSrc = getProductImage(product.image);
  const { current, original, savings, discount } = useProductPricing(product.price);
  const { isInStock, quantity } = useStockInfo(product.stock);
  const primaryCategory = product.category.split(',')[0].trim();

  // Generate random purchase count (for social proof)
  const randomPurchaseCount = Math.floor(Math.random() * 500) + 50;

  const handleAddToCart = () => {
    if (!isInStock) return;
    addToCart({
      id: `${product.id}-default`,
      name: product.name,
      category: product.category,
      originalPrice: original,
      currentPrice: current,
      image: product.image,
      features: product.features,
      rating: product.rating,
    });
  };

  // WhatsApp order handler
  const handleWhatsAppOrder = (form: WhatsAppOrderForm) => {
    const currentDate = new Date().toLocaleDateString();
    const limitedOffer = discount > 15 ? `*Limited Time Offer:* This ${discount}% discount is valid only until tomorrow!` : '';
    const message = `Hello! I want to order:

*Product:* ${product.name}
*Price:* ${formatPrice(current)} ${discount > 0 ? `(Save ${discount}%)` : ''}
${limitedOffer}

*Name:* ${form.name}
*Phone:* ${form.phone}
${form.email ? `*Email:* ${form.email}
` : ''}${form.city ? `*City:* ${form.city}
` : ''}
*Reference:* ${product.id}
*Date:* ${currentDate}

Please send me payment details. Thank you!`;
    const url = `https://wa.me/${whatsappNumberDigits}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <WhatsAppOrderPopup
        open={!directWhatsApp && waOpen}
        onOpenChange={setWaOpen}
        product={product}
        price={current}
        onOrder={handleWhatsAppOrder}
        idPrefix={product.id}
      />
      <Card className="group h-full flex flex-col border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-4 flex flex-col flex-1">
        {/* Image Area */}
        <div className="relative mb-4">
          <div className="aspect-square sm:aspect-[3/2] w-full relative rounded-md overflow-hidden bg-muted">
            <img
              src={imgError ? "/placeholder-image.jpg" : imageSrc}
              alt={product.name}
              className={`object-contain w-full h-full transition-transform duration-300 group-hover:scale-105 ${imgLoading ? 'blur-sm' : 'blur-0'}`}
              loading="lazy"
              onLoad={() => setImgLoading(false)}
              onError={() => setImgError(true)}
            />
          </div>
          
          {/* Product Badge */}
          {product.badge && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                {product.badge}
              </span>
            </div>
          )}
          
          {/* Verified Badge */}
          <div className="absolute top-2 right-2">
            <span className="text-xs font-semibold px-2 py-1 rounded-full text-white bg-green-600 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          </div>

          {/* Low Stock Warning */}
          {isInStock && quantity > 0 && quantity < 10 && (
            <div className="absolute bottom-2 left-2 bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium">
              Only {quantity} left!
            </div>
          )}
        </div>

        {/* Title & Category */}
        <h3 className="font-bold mb-1 line-clamp-2 text-lg">{product.name}</h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <Tag className="w-3 h-3 opacity-70" />
          <span className="truncate">{primaryCategory}</span>
        </div>

                {/* Stock Status Pill */}
        <div className="mb-3">
          {isInStock ? (
            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" /> In Stock
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
              <AlertCircle className="w-3 h-3 mr-1" /> Out of Stock
            </span>
          )}
        </div>

        {/* Rating + Social Proof */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm font-semibold">
              {(product.rating ?? 4.9).toFixed(1)}
            </span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="w-3 h-3 mr-1" />
            <span>{randomPurchaseCount.toLocaleString()} bought</span>
          </div>
        </div>
        
        {/* Features */}
        <div className="space-y-2 mb-4 text-sm">
          {(product.features?.slice(0, 3) || []).map((feature, i) => (
            <div key={i} className="flex items-center text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span className="truncate">{feature}</span>
            </div>
          ))}
        </div>

        {/* Pricing - improved for dark mode */}
        <div className="mt-auto mb-4 rounded-lg p-3 border border-blue-100 relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 dark:border-blue-900">
          {showDiscountBadges && discount > 0 && (
            <div className="absolute -top-2 -right-2">
              <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-500 text-white animate-pulse">
                {discount}% OFF
              </span>
            </div>
          )}
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-muted-foreground line-through">{formatPrice(original)}</span>
          </div>
          <div className="text-2xl font-extrabold text-primary">{formatPrice(current)}</div>
          {savings > 0 && (<div className="text-xs text-muted-foreground mt-1">You save {formatPrice(savings)}</div>)}
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            Secure
          </div>
          <div className="flex items-center">
            <Truck className="w-3 h-3 mr-1" />
            Free Delivery
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link to={`/product/${product.id}`} className="block" tabIndex={0} aria-label={`View details for ${product.name}`}> 
            <Button variant="outline" className="w-full flex items-center gap-2" disabled={!isInStock} aria-label="View Details">
              <Tag className="w-4 h-4" />
              <span>View Details & Plans</span>
            </Button>
          </Link>
<Button
  className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
  onClick={() => {
    if (directWhatsApp) {
      handleWhatsAppOrder({ name: 'Customer', phone: '', email: '', city: '' });
    } else {
      setWaOpen(true);
    }
  }}
  disabled={!isInStock}
  aria-label={`Order ${product.name} via WhatsApp`}
  tabIndex={0}
  onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!directWhatsApp && (e.key === 'Enter' || e.key === ' ')) {
      setWaOpen(true);
    }
  }}
>
  <Zap className="w-4 h-4 mr-1" />
  <span className="font-bold">Order via WhatsApp</span>
</Button>
          <Button
            variant="secondary"
            className="w-full flex items-center gap-2"
            onClick={handleAddToCart}
            disabled={!isInStock}
            aria-label="Add to Cart"
            tabIndex={0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            <span>Add to Cart</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  </>);
}

