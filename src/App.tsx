import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { ProductsProvider } from '@/context/ProductsContext';
import { BlogProvider } from '@/context/BlogContext';
import { PopupProvider } from '@/context/PopupContext';
import { SeoProvider } from '@/context/SeoContext';
import { CartProvider } from '@/context/CartContext';
import { CompareProvider } from '@/context/CompareContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { lazy, Suspense } from 'react';
const Home = lazy(() => import('./pages/Home'));
const Tools = lazy(() => import('./pages/Tools'));
const About = lazy(() => import('./pages/About'));
const WhyUs = lazy(() => import('./pages/WhyUs'));
const Compare = lazy(() => import('./pages/Compare'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AllProducts = lazy(() => import('./pages/AllProducts'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));

// Additional pages
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const DMCA = lazy(() => import('./pages/DMCA'));
const Admin = lazy(() => import('./pages/Admin'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProductController = lazy(() => import('./pages/ProductController'));
const Contact = lazy(() => import('./pages/Contact'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
import PurchaseNotifications from './components/PurchaseNotifications';
import FloatingElements from './components/FloatingElements';
import FloatingCart from './components/FloatingCart';
import PopupAnnouncement from './components/PopupAnnouncement';
import ProductDashboard from './pages/ProductDashboard';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ProductsProvider>
      <BlogProvider>
        <PopupProvider>
          <SeoProvider>
            <SettingsProvider>
              <CurrencyProvider>
          <CartProvider>
            <CompareProvider>
              <TooltipProvider>
                <Toaster />
                <BrowserRouter>
                  <ScrollToTop />
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1" id="main">
                      <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>}>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/tools" element={<Tools />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/why-us" element={<WhyUs />} />
                          <Route path="/compare" element={<Compare />} />
                          <Route path="/testimonials" element={<Testimonials />} />
                          <Route path="/products" element={<AllProducts />} />
                          <Route path="/product/:id" element={<ProductDetail />} />

                          {/* Additional routes */}
                          <Route path="/blog" element={<Blog />} />
                          <Route path="/blog/:slug" element={<BlogPost />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                          <Route path="/terms-conditions" element={<TermsConditions />} />
                          <Route path="/refund-policy" element={<RefundPolicy />} />
                          <Route path="/dmca" element={<DMCA />} />
                          <Route path="/admin" element={<Admin />} />
                          <Route path="/admin/login" element={<AdminLogin />} />
                          <Route path="/admin/dashboard" element={<AdminDashboard />} />
                          <Route path="/product-controller" element={<ProductController />} />
                          <Route path="/productcontroller" element={<ProductController />} />
                          <Route path="/productdashboard" element={<ProductDashboard onLogout={() => {}} />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Suspense>
                    </main>
                    <Footer />
                    <PurchaseNotifications />
                    <PopupAnnouncement />
                    <FloatingElements />
                    <FloatingCart />
                  </div>
                </BrowserRouter>
              </TooltipProvider>
            </CompareProvider>
          </CartProvider>
        </CurrencyProvider>
      </SettingsProvider>
    </SeoProvider>
  </PopupProvider>
</BlogProvider>
</ProductsProvider>
</QueryClientProvider>
);

export default App;
