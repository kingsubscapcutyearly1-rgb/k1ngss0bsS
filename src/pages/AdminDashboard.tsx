import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Package, 
  Users, 
  MessageSquare, 
  Globe, 
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Save,
  Upload,
  Eye,
  PenTool,
  BarChart,
  Zap,
  Crown
} from 'lucide-react';
import { products } from '@/data/products';
import { siteConfig } from '@/data/site-config';

// Lightweight settings persisted in localStorage to affect runtime behavior
const LS_SETTINGS_KEY = 'ks_settings_v1';
type RuntimeSettings = { whatsappDirectOrder?: boolean };
function loadSettings(): RuntimeSettings {
  try { return JSON.parse(localStorage.getItem(LS_SETTINGS_KEY) || '{}'); } catch { return {}; }
}
function saveSettings(s: RuntimeSettings) { try { localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(s)); } catch {} }

const AdminDashboard: React.FC = () => {
  const [whatsappNumber, setWhatsappNumber] = useState('+923276847960');
  const [supportEmail, setSupportEmail] = useState('itxahmadjan@gmail.com');
  const [siteLogo, setSiteLogo] = useState('');
  const [heroTitle, setHeroTitle] = useState('STOP BLEEDING MONEY On Overpriced Software!');
  const [heroSubtitle, setHeroSubtitle] = useState('🔥 10,000+ Smart Entrepreneurs have already ditched expensive subscriptions...');
  
  // Site Settings
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'King Subscription',
    tagline: 'Premium AI & SEO Tools at 50% OFF',
    metaDescription: 'Get premium AI & SEO tools at 50% OFF! ChatGPT Plus, Canva Pro, Adobe Creative Suite & 15+ tools. Instant access, 24/7 support.',
    enablePurchaseNotifications: true,
    enableFloatingCart: true,
    enablePopups: true,
    currencyDisplay: 'USD',
    showDiscountBadges: true,
    maintenanceMode: false
  });

  const [whatsappDirectOrder, setWhatsappDirectOrder] = useState<boolean>(siteConfig.whatsappDirectOrder);

  useEffect(() => {
    const s = loadSettings();
    if (typeof s.whatsappDirectOrder === 'boolean') setWhatsappDirectOrder(s.whatsappDirectOrder);
  }, []);

  // Popup/Announcement Settings
  const [popupSettings, setPopupSettings] = useState({
    enabled: true,
    title: '🔥 Limited Time Offer!',
    message: 'Get 50% OFF on all premium subscriptions. Offer ends soon!',
    buttonText: 'Claim Offer',
    showTimer: true,
    timerDuration: 24, // hours
    frequency: 'once_per_session', // once_per_session, daily, always
    position: 'center' // center, top, bottom
  });

  // SEO Settings per page
  const [seoSettings, setSeoSettings] = useState({
    home: {
      title: 'King Subscription | Premium AI & SEO Tools at 50% OFF',
      description: 'Get premium AI & SEO tools at 50% OFF! ChatGPT Plus, Canva Pro, Adobe Creative Suite & 15+ tools.',
      keywords: 'ChatGPT Plus discount, Canva Pro cheap, Adobe Creative Cloud offer'
    },
    tools: {
      title: 'Premium Tools & Subscriptions - King Subscription',
      description: 'Browse our collection of premium tools and subscriptions at unbeatable prices.',
      keywords: 'premium tools, software subscriptions, AI tools, design tools'
    },
    about: {
      title: 'About King Subscription - Your Premium Tools Partner',
      description: 'Learn about King Subscription and why thousands trust us for premium software at amazing prices.',
      keywords: 'about king subscription, premium software provider'
    }
  });

  const handleSaveSettings = () => {
    // In a real app, this would save to backend/database
    alert('Settings saved successfully!');
  };

  const handleAddProduct = () => {
    // Navigate to add product form
    alert('Add Product form would open here');
  };

  const handleEditProduct = (productId: string) => {
    alert(`Edit product ${productId} form would open here`);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      alert(`Product ${productId} would be deleted`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Crown className="mr-3 h-8 w-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your subscription business with complete control
            </p>
          </div>
          <Button onClick={handleSaveSettings} className="bg-green-600 hover:bg-green-700">
            <Save className="mr-2 h-4 w-4" />
            Save All Changes
          </Button>
        </div>

        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center">
              <Package className="mr-2 h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center">
              <Globe className="mr-2 h-4 w-4" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="popups" className="flex items-center">
              <Zap className="mr-2 h-4 w-4" />
              Popups
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center">
              <PenTool className="mr-2 h-4 w-4" />
              Pages
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Contact Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                    <Input
                      id="whatsapp"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="+923276847960"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This number will be used for all WhatsApp buttons and links
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="email">Support Email</Label>
                    <Input
                      id="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      placeholder="itxahmadjan@gmail.com"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-5 w-5" />
                    Site Branding
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={siteSettings.tagline}
                      onChange={(e) => setSiteSettings({...siteSettings, tagline: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo">Site Logo URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="logo"
                        value={siteLogo}
                        onChange={(e) => setSiteLogo(e.target.value)}
                        placeholder="/images/SiteLogo.jpg"
                      />
                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Hero Section Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="heroTitle">Hero Title</Label>
                  <Textarea
                    id="heroTitle"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Textarea
                    id="heroSubtitle"
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Site Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Purchase Notifications</Label>
                    <p className="text-sm text-gray-500">Show fake purchase notifications to visitors</p>
                  </div>
                  <Switch
                    checked={siteSettings.enablePurchaseNotifications}
                    onCheckedChange={(checked) => setSiteSettings({...siteSettings, enablePurchaseNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Floating Cart</Label>
                    <p className="text-sm text-gray-500">Show floating WhatsApp cart button</p>
                  </div>
                  <Switch
                    checked={siteSettings.enableFloatingCart}
                    onCheckedChange={(checked) => setSiteSettings({...siteSettings, enableFloatingCart: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Discount Badges</Label>
                    <p className="text-sm text-gray-500">Show discount percentage on product cards</p>
                  </div>
                  <Switch
                    checked={siteSettings.showDiscountBadges}
                    onCheckedChange={(checked) => setSiteSettings({...siteSettings, showDiscountBadges: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-gray-500 text-red-600">⚠️ Will disable the site for visitors</p>
                  </div>
                  <Switch
                    checked={siteSettings.maintenanceMode}
                    onCheckedChange={(checked) => setSiteSettings({...siteSettings, maintenanceMode: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Management Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              <h2 className="text-2xl font-bold mb-4">Product Management</h2>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg shadow-lg"
                onClick={() => window.location.href = '/productcontroller'}
              >
                Access Product Controller
              </Button>
              <p className="mt-4 text-gray-500 text-center max-w-md">
                Use the Product Controller for advanced product management, secure access, and full CRUD features.
              </p>
            </div>
          </TabsContent>

          {/* SEO Management Tab */}
          <TabsContent value="seo" className="space-y-6">
            <h2 className="text-2xl font-bold">SEO Management</h2>
            <p className="text-gray-600">Configure SEO settings for each page individually</p>
            
            <div className="space-y-6">
              {Object.entries(seoSettings).map(([page, settings]) => (
                <Card key={page}>
                  <CardHeader>
                    <CardTitle className="capitalize">{page} Page SEO</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Meta Title</Label>
                      <Input
                        value={settings.title}
                        onChange={(e) => setSeoSettings({
                          ...seoSettings,
                          [page]: { ...settings, title: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Meta Description</Label>
                      <Textarea
                        value={settings.description}
                        onChange={(e) => setSeoSettings({
                          ...seoSettings,
                          [page]: { ...settings, description: e.target.value }
                        })}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Keywords</Label>
                      <Input
                        value={settings.keywords}
                        onChange={(e) => setSeoSettings({
                          ...seoSettings,
                          [page]: { ...settings, keywords: e.target.value }
                        })}
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Popups & Announcements Tab */}
          <TabsContent value="popups" className="space-y-6">
            <h2 className="text-2xl font-bold">Popups & Announcements</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Promotional Popup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Popup</Label>
                  <Switch
                    checked={popupSettings.enabled}
                    onCheckedChange={(checked) => setPopupSettings({...popupSettings, enabled: checked})}
                  />
                </div>
                <div>
                  <Label>Popup Title</Label>
                  <Input
                    value={popupSettings.title}
                    onChange={(e) => setPopupSettings({...popupSettings, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Popup Message</Label>
                  <Textarea
                    value={popupSettings.message}
                    onChange={(e) => setPopupSettings({...popupSettings, message: e.target.value})}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Button Text</Label>
                  <Input
                    value={popupSettings.buttonText}
                    onChange={(e) => setPopupSettings({...popupSettings, buttonText: e.target.value})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Show Timer</Label>
                  <Switch
                    checked={popupSettings.showTimer}
                    onCheckedChange={(checked) => setPopupSettings({...popupSettings, showTimer: checked})}
                  />
                </div>
                {popupSettings.showTimer && (
                  <div>
                    <Label>Timer Duration (hours)</Label>
                    <Input
                      type="number"
                      value={popupSettings.timerDuration}
                      onChange={(e) => setPopupSettings({...popupSettings, timerDuration: parseInt(e.target.value)})}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Runtime Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Runtime Settings</h2>
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Order Flow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Open WhatsApp directly (skip form)</Label>
                  <Switch
                    checked={whatsappDirectOrder}
                    onCheckedChange={(checked) => {
                      setWhatsappDirectOrder(checked as boolean);
                      saveSettings({ whatsappDirectOrder: checked as boolean });
                    }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">This setting saves to your browser (localStorage) and applies immediately on this device.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pages Management Tab */}
          <TabsContent value="pages" className="space-y-6">
            <h2 className="text-2xl font-bold">Pages Management</h2>
            <p className="text-gray-600">Add, edit, or remove pages from your website</p>
            
            <Card>
              <CardHeader>
                <CardTitle>Custom Page Creator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Page Name</Label>
                  <Input placeholder="Terms of Service" />
                </div>
                <div>
                  <Label>Page URL Slug</Label>
                  <Input placeholder="terms-of-service" />
                </div>
                <div>
                  <Label>Page Content (HTML)</Label>
                  <Textarea 
                    placeholder="<h1>Terms of Service</h1><p>Content here...</p>"
                    rows={10}
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Create Page
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics Overview</h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold">{products.length}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Monthly Visitors</p>
                      <p className="text-2xl font-bold">10,234</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold">3.2%</p>
                    </div>
                    <BarChart className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="text-2xl font-bold">$12,845</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;