import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { CartProvider } from '@/context/CartContext';
import { CompareProvider } from '@/context/CompareContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Tools from './pages/Tools';
import About from './pages/About';
import WhyUs from './pages/WhyUs';
import Compare from './pages/Compare';
import Testimonials from './pages/Testimonials';
import NotFound from './pages/NotFound';
import AllProducts from "./pages/AllProducts";
import ProductDetail from "./pages/ProductDetail";

// Additional pages
import Blog from './pages/Blog';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import DMCA from './pages/DMCA';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProductController from './pages/ProductController';
import Contact from './pages/Contact';
import TermsConditions from './pages/TermsConditions';
import PurchaseNotifications from './components/PurchaseNotifications';
import FloatingElements from './components/FloatingElements';
import FloatingCart from './components/FloatingCart';
import ProductDashboard from './pages/ProductDashboard';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CurrencyProvider>
      <CartProvider>
        <CompareProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
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
                </main>
                <Footer />
                <PurchaseNotifications />
                <FloatingElements />
                <FloatingCart />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </CompareProvider>
      </CartProvider>
    </CurrencyProvider>
  </QueryClientProvider>
);

export default App;