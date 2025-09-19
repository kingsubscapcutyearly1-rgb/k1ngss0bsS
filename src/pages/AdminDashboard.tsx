import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Crown,
  BookOpen,
  FilePlus2,
  Clock
} from 'lucide-react';
import { useProductsContext } from '@/context/ProductsContext';
import { useSettings } from '@/context/SettingsContext';
import { useBlogContext } from '@/context/BlogContext';
import { usePopup, POPUP_PAGE_OPTIONS, type PopupSettings } from '@/context/PopupContext';
import { useSeoContext, type PageSeo, type SeoPageKey } from '@/context/SeoContext';

type BlogFormState = {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string;
  coverImage: string;
  content: string;
  readTime: string;
  metaTitle: string;
  metaDescription: string;
  published: boolean;
};

const formatBlogDate = (value?: string) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }
  return parsed.toLocaleDateString();
};

const AdminDashboard: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const { products } = useProductsContext();
  const { posts: blogPosts, createPost, updatePost, deletePost, togglePublished, categories: blogCategories } = useBlogContext();

  const makeEmptyBlogForm = (): BlogFormState => ({
    title: '',
    slug: '',
    excerpt: '',
    author: '',
    category: '',
    tags: '',
    coverImage: '',
    content: '',
    readTime: '5 min read',
    metaTitle: '',
    metaDescription: '',
    published: false,
  });

  const [blogForm, setBlogForm] = useState<BlogFormState>(() => makeEmptyBlogForm());
  const [editingBlogSlug, setEditingBlogSlug] = useState<string | null>(null);
  const [blogMessage, setBlogMessage] = useState('');

  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [supportEmail, setSupportEmail] = useState('itxahmadjan@gmail.com');
  const [siteLogo, setSiteLogo] = useState('');
  const [heroTitle, setHeroTitle] = useState('STOP BLEEDING MONEY On Overpriced Software!');
  const [heroSubtitle, setHeroSubtitle] = useState('10,000+ Smart Entrepreneurs have already ditched expensive subscriptions...');

  // Site Settings
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'King Subscription',
    tagline: 'Premium AI & SEO Tools at 50% OFF',
    metaDescription: 'Get premium AI & SEO tools at 50% OFF! ChatGPT Plus, Canva Pro, Adobe Creative Suite & 15+ tools. Instant access, 24/7 support.',
    enablePurchaseNotifications: settings.enablePurchaseNotifications,
    enableFloatingCart: settings.enableFloatingCart,
    enablePopups: true,
    currencyDisplay: 'USD',
    showDiscountBadges: settings.showDiscountBadges,
    maintenanceMode: false,
  });

  const [whatsappDirectOrder, setWhatsappDirectOrder] = useState<boolean>(settings.whatsappDirectOrder);

  useEffect(() => {
    setWhatsappDirectOrder(settings.whatsappDirectOrder);
    setWhatsappNumber(settings.whatsappNumber);
    setSiteSettings((prev) => ({
      ...prev,
      enablePurchaseNotifications: settings.enablePurchaseNotifications,
      enableFloatingCart: settings.enableFloatingCart,
      showDiscountBadges: settings.showDiscountBadges,
    }));
  }, [settings]);

// Popup/Announcement Settings
  const { settings: popupSettings, updateSettings: persistPopupSettings, resetSettings: resetPopupSettings } = usePopup();
  const [popupDraft, setPopupDraft] = useState(popupSettings);
  const popupPagesSelected = useMemo(() => new Set(popupDraft.pages), [popupDraft.pages]);

  useEffect(() => {
    setPopupDraft(popupSettings);
  }, [popupSettings]);

  const togglePopupPage = useCallback((page: string) => {
    setPopupDraft((prev) => {
      if (page === '*') {
        return { ...prev, pages: prev.pages.includes('*') ? [] : ['*'] };
      }
      const currentPages = prev.pages.includes('*') ? [] : prev.pages;
      const exists = currentPages.includes(page);
      const nextPages = exists
        ? currentPages.filter((value) => value !== page)
        : [...currentPages, page];
      return {
        ...prev,
        pages: nextPages.filter((value, index, array) => array.indexOf(value) === index),
      };
    });
  }, []);

  useEffect(() => {
    if (!editingBlogSlug) {
      setBlogForm(makeEmptyBlogForm());
      return;
    }

    const post = blogPosts.find((item) => item.slug === editingBlogSlug);
    if (post) {
      setBlogForm({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        author: post.author,
        category: post.category,
        tags: post.tags.join(', '),
        coverImage: post.coverImage,
        content: post.content.join('\n\n'),

        readTime: post.readTime,
        metaTitle: post.metaTitle || '',
        metaDescription: post.metaDescription || '',
        published: post.published,
      });
      setBlogMessage('');
    }
  }, [blogPosts, editingBlogSlug]);

  const handlePopupDraftChange = useCallback((key: keyof PopupSettings, value: PopupSettings[keyof PopupSettings]) => {
    setPopupDraft((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handlePopupSave = useCallback(() => {
    const { metrics, lastDismissedAt, lastShownAt, ...plain } = popupDraft;
    persistPopupSettings(plain);
  }, [persistPopupSettings, popupDraft]);

  const handlePopupReset = useCallback(() => {
    resetPopupSettings();
  }, [resetPopupSettings]);

  // SEO configuration
  const { defaultSeo: seoDefaults, updatePageSeo, resetPageSeo, resetAll, getSeoFor } = useSeoContext();
  const seoPageOptions: { label: string; value: SeoPageKey }[] = [
    { label: 'Home', value: 'home' },
    { label: 'Tools', value: 'tools' },
    { label: 'About', value: 'about' },
    { label: 'Compare', value: 'compare' },
    { label: 'All Products', value: 'products' },
    { label: 'Product Detail', value: 'product-detail' },
    { label: 'Blog Listing', value: 'blog' },
    { label: 'Blog Post', value: 'blog-post' },
    { label: 'Contact', value: 'contact' },
    { label: 'Testimonials', value: 'testimonials' },
    { label: 'Privacy Policy', value: 'privacy-policy' },
    { label: 'Refund Policy', value: 'refund-policy' },
    { label: 'Terms & Conditions', value: 'terms-conditions' },
    { label: 'DMCA', value: 'dmca' },
  ];
  const [activeSeoPage, setActiveSeoPage] = useState<SeoPageKey>('home');
  const activeSeoConfig = useMemo(() => getSeoFor(activeSeoPage), [activeSeoPage, getSeoFor]);
  const [seoDraft, setSeoDraft] = useState<PageSeo>(activeSeoConfig);

  useEffect(() => {
    setSeoDraft(activeSeoConfig);
  }, [activeSeoConfig]);

  const handleSeoInputChange = useCallback((key: keyof PageSeo, value: string) => {
    setSeoDraft((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleSeoSave = useCallback(() => {
    updatePageSeo(activeSeoPage, {
      title: seoDraft.title.trim(),
      description: seoDraft.description.trim(),
      keywords: seoDraft.keywords?.trim() || undefined,
    });
  }, [activeSeoPage, seoDraft.description, seoDraft.keywords, seoDraft.title, updatePageSeo]);

  const handleSeoReset = useCallback(() => {
    resetPageSeo(activeSeoPage);
  }, [activeSeoPage, resetPageSeo]);

  const seoPreviewPath = useMemo(() => {
    switch (activeSeoPage) {
      case 'home':
        return '/';
      case 'product-detail':
        return '/product/demo-product';
      case 'blog-post':
        return '/blog/sample-article';
      case 'privacy-policy':
        return '/privacy-policy';
      case 'refund-policy':
        return '/refund-policy';
      case 'terms-conditions':
        return '/terms-conditions';
      default:
        return `/${activeSeoPage.replace('-', '/')}`;
    }
  }, [activeSeoPage]);


    const analytics = useMemo(() => {
    const totalProducts = products.length;
    const categorySet = new Set<string>();
    let totalOriginal = 0;
    let totalCurrent = 0;
    let discountAccumulator = 0;
    let discountCount = 0;

    const productSummaries = products.map((product) => {
      const categories = product.category.split(',').map((item) => item.trim()).filter(Boolean);
      categories.forEach((entry) => categorySet.add(entry));

      const price = product.price || {};
      const current = price.monthly ?? price.yearly ?? 0;
      const original = price.original ?? current;
      if (original > 0 && current > 0) {
        totalOriginal += original;
        totalCurrent += current;
        const discountPct = Math.max(0, Math.round(((original - current) / original) * 100));
        discountAccumulator += discountPct;
        discountCount += 1;
        return {
          id: product.id,
          name: product.name,
          discount: discountPct,
          savings: Math.max(original - current, 0),
          currentPrice: current,
        };
      }

      return {
        id: product.id,
        name: product.name,
        discount: 0,
        savings: 0,
        currentPrice: current,
      };
    });

    const topProducts = productSummaries
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 3);

    const publishedBlogPosts = blogPosts.filter((post) => post.published).length;
    const draftBlogPosts = blogPosts.length - publishedBlogPosts;
    const averageDiscount = discountCount ? Math.round(discountAccumulator / discountCount) : 0;
    const totalSavings = Math.max(totalOriginal - totalCurrent, 0);
    const popupMetrics = popupSettings.metrics;
    const popupConversion = popupMetrics.impressions > 0
      ? Math.round((popupMetrics.clicks / popupMetrics.impressions) * 100)
      : 0;

    return {
      totalProducts,
      categories: Array.from(categorySet),
      publishedBlogPosts,
      draftBlogPosts,
      averageDiscount,
      totalSavings,
      popupMetrics,
      popupConversion,
      topProducts,
    };
  }, [blogPosts, popupSettings.metrics, products]);

const handleSaveSettings = () => {
    updateSettings({
      whatsappNumber: whatsappNumber.trim(),
      whatsappDirectOrder,
      enablePurchaseNotifications: siteSettings.enablePurchaseNotifications,
      enableFloatingCart: siteSettings.enableFloatingCart,
      showDiscountBadges: siteSettings.showDiscountBadges,
    });

    // In a real app, this would also persist to a backend/database
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

  const handleResetBlogForm = () => {
    setEditingBlogSlug(null);
    setBlogForm(makeEmptyBlogForm());
    setBlogMessage('');
  };

  const handleBlogSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!blogForm.title.trim()) {
      setBlogMessage('Title is required.');
      return;
    }
    if (!blogForm.excerpt.trim()) {
      setBlogMessage('Please add a short excerpt.');
      return;
    }
    if (!blogForm.author.trim()) {
      setBlogMessage('Author name is required.');
      return;
    }

    const tags = blogForm.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    const contentParagraphs = blogForm.content
      .split(/\r?\n\s*\r?\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    const input = {
      title: blogForm.title.trim(),
      slug: blogForm.slug.trim() || undefined,
      excerpt: blogForm.excerpt.trim(),
      author: blogForm.author.trim(),
      category: blogForm.category.trim() || 'General',
      tags,
      coverImage: blogForm.coverImage.trim() || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      content: contentParagraphs.length > 0 ? contentParagraphs : [blogForm.excerpt.trim()],
      readTime: blogForm.readTime.trim() || '5 min read',
      metaTitle: blogForm.metaTitle.trim() || undefined,
      metaDescription: blogForm.metaDescription.trim() || undefined,
      published: blogForm.published,
    };

    if (editingBlogSlug) {
      const updated = updatePost(editingBlogSlug, input);
      if (!updated) {
        setBlogMessage('Unable to update blog post.');
        return;
      }
      setBlogMessage('Blog post updated successfully.');
    } else {
      createPost(input);
      setBlogMessage(blogForm.published ? 'Blog post published successfully.' : 'Blog post saved as draft.');
    }

    handleResetBlogForm();
  };

  const handleEditBlogPost = (slug: string) => {
    setEditingBlogSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteBlogPost = (slug: string) => {
    if (confirm('Delete this blog post?')) {
      deletePost(slug);
      if (editingBlogSlug === slug) {
        handleResetBlogForm();
      }
      setBlogMessage('Blog post deleted.');
    }
  };

  const handleTogglePublishBlog = (slug: string) => {
    togglePublished(slug);
    setBlogMessage('Blog post visibility updated.');
  };

  const blogStats = {
    total: blogPosts.length,
    published: blogPosts.filter((post) => post.published).length,
  };

  const blogCategoryHint = blogCategories.filter(Boolean).join(', ');

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
          <TabsList className="grid w-full grid-cols-7">
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
            <TabsTrigger value="blog" className="flex items-center">
              <BookOpen className="mr-2 h-4 w-4" />
              Blog
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
                      onBlur={() => updateSettings({ whatsappNumber: whatsappNumber.trim() })}
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
                      onCheckedChange={(checked) => {
                        const value = Boolean(checked);
                        setSiteSettings(prev => ({ ...prev, enablePurchaseNotifications: value }));
                        updateSettings({ enablePurchaseNotifications: value });
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Floating Cart</Label>
                      <p className="text-sm text-gray-500">Show floating WhatsApp cart button</p>
                    </div>
                    <Switch
                      checked={siteSettings.enableFloatingCart}
                      onCheckedChange={(checked) => {
                        const value = Boolean(checked);
                        setSiteSettings(prev => ({ ...prev, enableFloatingCart: value }));
                        updateSettings({ enableFloatingCart: value });
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Discount Badges</Label>
                      <p className="text-sm text-gray-500">Show discount percentage on product cards</p>
                    </div>
                    <Switch
                      checked={siteSettings.showDiscountBadges}
                      onCheckedChange={(checked) => {
                        const value = Boolean(checked);
                        setSiteSettings(prev => ({ ...prev, showDiscountBadges: value }));
                        updateSettings({ showDiscountBadges: value });
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>WhatsApp Direct Order</Label>
                      <p className="text-sm text-gray-500">Skip form and open WhatsApp directly</p>
                    </div>
                    <Switch
                      checked={whatsappDirectOrder}
                      onCheckedChange={(checked) => {
                        setWhatsappDirectOrder(checked as boolean);
                        updateSettings({ whatsappDirectOrder: Boolean(checked) });
                      }}
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
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">SEO Management</h2>
                <p className="text-sm text-muted-foreground">Edit meta data for each page to keep search snippets sharp and consistent.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => resetAll()}>Reset All</Button>
                <Button onClick={handleSeoSave}>Save Changes</Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Page configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 md:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="seo-page">Select page</Label>
                    <Select value={activeSeoPage} onValueChange={(value) => setActiveSeoPage(value as SeoPageKey)}>
                      <SelectTrigger id="seo-page">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {seoPageOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Title length</Label>
                    <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">{seoDraft.title.length} characters</div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Description length</Label>
                    <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">{seoDraft.description.length} characters</div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="seo-title">Meta title</Label>
                  <Input
                    id="seo-title"
                    value={seoDraft.title}
                    onChange={(event) => handleSeoInputChange('title', event.target.value)}
                    placeholder="Kings Subscriptions - Premium Tools at 50% Off"
                  />
                  <p className="text-xs text-muted-foreground">Keep titles under 60 characters for best results.</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="seo-description">Meta description</Label>
                  <Textarea
                    id="seo-description"
                    rows={3}
                    value={seoDraft.description}
                    onChange={(event) => handleSeoInputChange('description', event.target.value)}
                    placeholder="Explain the value of this page in 1–2 sentences."
                  />
                  <p className="text-xs text-muted-foreground">Ideal meta descriptions are between 140–160 characters.</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="seo-keywords">Keywords (optional)</Label>
                  <Input
                    id="seo-keywords"
                    value={seoDraft.keywords ?? ''}
                    onChange={(event) => handleSeoInputChange('keywords', event.target.value)}
                    placeholder="chatgpt plus, canva pro, premium tools"
                  />
                  <p className="text-xs text-muted-foreground">Comma separated keywords help organise your content but are optional.</p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleSeoReset}>Reset page</Button>
                  <Button onClick={handleSeoSave}>Save page SEO</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Search preview</CardTitle>
                <p className="text-sm text-muted-foreground">See how this page might appear on Google.</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 rounded-xl border bg-muted/40 p-4">
                  <p className="text-xs text-green-600">kingssubs.com{seoPreviewPath}</p>
                  <p className="text-base font-semibold text-blue-700 dark:text-blue-400">{seoDraft.title || seoDefaults[activeSeoPage].title}</p>
                  <p className="text-sm text-muted-foreground">{seoDraft.description || seoDefaults[activeSeoPage].description}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Popups & Announcements Tab */}
          <TabsContent value="popups" className="space-y-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Popups & Announcements</h2>
                <p className="text-sm text-muted-foreground">Control the promotional message, targeting, and frequency without touching code.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePopupReset}>Reset</Button>
                <Button onClick={handlePopupSave}>Save Changes</Button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.7fr,1fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Popup Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="popup-enabled">Enable popup</Label>
                    <Switch
                      id="popup-enabled"
                      checked={popupDraft.enabled}
                      onCheckedChange={(checked) => handlePopupDraftChange('enabled', checked)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="popup-title">Title</Label>
                    <Input
                      id="popup-title"
                      value={popupDraft.title}
                      onChange={(event) => handlePopupDraftChange('title', event.target.value)}
                      placeholder="Unlock 10% off today"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="popup-message">Message</Label>
                    <Textarea
                      id="popup-message"
                      rows={3}
                      value={popupDraft.message}
                      onChange={(event) => handlePopupDraftChange('message', event.target.value)}
                    />
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="popup-button-text">Button label</Label>
                      <Input
                        id="popup-button-text"
                        value={popupDraft.buttonText}
                        onChange={(event) => handlePopupDraftChange('buttonText', event.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="popup-button-href">Button link</Label>
                      <Input
                        id="popup-button-href"
                        value={popupDraft.buttonHref}
                        onChange={(event) => handlePopupDraftChange('buttonHref', event.target.value)}
                        placeholder="https://wa.me/92327..."
                      />
                    </div>
                  </div>
                  <div className="grid gap-2 md:grid-cols-3">
                    <div className="grid gap-2">
                      <Label>Theme</Label>
                      <Select value={popupDraft.theme} onValueChange={(value) => handlePopupDraftChange('theme', value as PopupSettings['theme'])}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Trigger</Label>
                      <Select value={popupDraft.trigger} onValueChange={(value) => handlePopupDraftChange('trigger', value as PopupSettings['trigger'])}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="delay">After delay</SelectItem>
                          <SelectItem value="scroll">On scroll (50%)</SelectItem>
                          <SelectItem value="exit-intent">Exit intent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Frequency</Label>
                      <Select value={popupDraft.frequency} onValueChange={(value) => handlePopupDraftChange('frequency', value as PopupSettings['frequency'])}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="always">Every visit</SelectItem>
                          <SelectItem value="once-per-session">Once per session</SelectItem>
                          <SelectItem value="once-per-day">Once per day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {popupDraft.trigger === 'delay' && (
                    <div className="grid gap-2">
                      <Label htmlFor="popup-delay">Delay (seconds)</Label>
                      <Input
                        id="popup-delay"
                        type="number"
                        min={1}
                        value={popupDraft.delaySeconds}
                        onChange={(event) => handlePopupDraftChange('delaySeconds', Number(event.target.value))}
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="popup-timer">Show countdown timer</Label>
                    <Switch
                      id="popup-timer"
                      checked={popupDraft.showTimer}
                      onCheckedChange={(checked) => handlePopupDraftChange('showTimer', checked)}
                    />
                  </div>
                  {popupDraft.showTimer && (
                    <div className="grid gap-2">
                      <Label htmlFor="popup-timer-duration">Timer duration (minutes)</Label>
                      <Input
                        id="popup-timer-duration"
                        type="number"
                        min={1}
                        value={popupDraft.timerDuration}
                        onChange={(event) => handlePopupDraftChange('timerDuration', Number(event.target.value))}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Display on pages</Label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {POPUP_PAGE_OPTIONS.map((option) => {
                        const checked = popupPagesSelected.has(option.value) || (popupPagesSelected.has('*') && option.value !== '*');
                        return (
                          <label key={option.value} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Checkbox
                              checked={popupPagesSelected.has('*') ? option.value === '*' : checked}
                              onCheckedChange={() => togglePopupPage(option.value)}
                            />
                            <span>{option.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview & Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`rounded-2xl border p-5 shadow-inner ${popupDraft.theme === 'dark' ? 'bg-zinc-950 text-zinc-100 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{popupDraft.title || 'Your headline here'}</h3>
                        <p className="text-sm text-muted-foreground">{popupDraft.message || 'Add a compelling message to convert visitors.'}</p>
                      </div>
                      <Badge variant={popupDraft.enabled ? 'default' : 'secondary'}>{popupDraft.enabled ? 'Active' : 'Disabled'}</Badge>
                    </div>
                    <Button size="sm" className="mt-4 w-full">{popupDraft.buttonText || 'Call to action'}</Button>
                    {popupDraft.showTimer && (
                      <div className="mt-3 text-xs text-amber-600 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Offer ends in {popupDraft.timerDuration} minutes
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Total impressions</span>
                      <span>{popupSettings.metrics.impressions}</span>
                    </div>
                    <Progress value={popupSettings.metrics.impressions ? (popupSettings.metrics.clicks / popupSettings.metrics.impressions) * 100 : 0} />
                    <div className="flex items-center justify-between">
                      <span>Clicks</span>
                      <span>{popupSettings.metrics.clicks}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Dismissals</span>
                      <span>{popupSettings.metrics.dismissals}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Conversion rate</span>
                      <span>{analytics.popupConversion}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          {/* Blog Management Tab */}
          <TabsContent value="blog" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1.5fr,2fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FilePlus2 className="h-5 w-5" />
                    {editingBlogSlug ? 'Edit Blog Post' : 'Create Blog Post'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {blogMessage && (
                    <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-300">
                      {blogMessage}
                    </div>
                  )}
                  <form className="space-y-4" onSubmit={handleBlogSubmit}>
                    <div className="grid gap-2">
                      <Label htmlFor="blog_title">Title</Label>
                      <Input
                        id="blog_title"
                        value={blogForm.title}
                        onChange={(event) => setBlogForm((prev) => ({ ...prev, title: event.target.value }))}
                        placeholder="ChatGPT Plus vs Gemini Advanced"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="blog_slug">Slug (optional)</Label>
                      <Input
                        id="blog_slug"
                        value={blogForm.slug}
                        onChange={(event) => setBlogForm((prev) => ({ ...prev, slug: event.target.value }))}
                        placeholder="chatgpt-plus-vs-gemini"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="blog_excerpt">Excerpt</Label>
                      <Textarea
                        id="blog_excerpt"
                        rows={3}
                        value={blogForm.excerpt}
                        onChange={(event) => setBlogForm((prev) => ({ ...prev, excerpt: event.target.value }))}
                        placeholder="Short summary shown on the blog listing..."
                        required
                      />
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="blog_author">Author</Label>
                        <Input
                          id="blog_author"
                          value={blogForm.author}
                          onChange={(event) => setBlogForm((prev) => ({ ...prev, author: event.target.value }))}
                          placeholder="Ahmad Hassan"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="blog_category">Category</Label>
                        <Input
                          id="blog_category"
                          value={blogForm.category}
                          onChange={(event) => setBlogForm((prev) => ({ ...prev, category: event.target.value }))}
                          placeholder="AI Tools"
                        />
                        {blogCategoryHint && (
                          <p className="text-xs text-muted-foreground">Existing: {blogCategoryHint}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="blog_tags">Tags (comma separated)</Label>
                      <Input
                        id="blog_tags"
                        value={blogForm.tags}
                        onChange={(event) => setBlogForm((prev) => ({ ...prev, tags: event.target.value }))}
                        placeholder="ai tools, automation, growth"
                      />
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="blog_cover">Cover image URL</Label>
                        <Input
                          id="blog_cover"
                          value={blogForm.coverImage}
                          onChange={(event) => setBlogForm((prev) => ({ ...prev, coverImage: event.target.value }))}
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="blog_read_time">Read time</Label>
                        <Input
                          id="blog_read_time"
                          value={blogForm.readTime}
                          onChange={(event) => setBlogForm((prev) => ({ ...prev, readTime: event.target.value }))}
                          placeholder="6 min read"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="blog_content">Content</Label>
                      <Textarea
                        id="blog_content"
                        rows={8}
                        value={blogForm.content}
                        onChange={(event) => setBlogForm((prev) => ({ ...prev, content: event.target.value }))}
                        placeholder="Write each paragraph on a new line..."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="blog_meta_title">SEO Meta Title</Label>
                      <Input
                        id="blog_meta_title"
                        value={blogForm.metaTitle}
                        onChange={(event) => setBlogForm((prev) => ({ ...prev, metaTitle: event.target.value }))}
                        placeholder="ChatGPT Plus vs Gemini | King Subs"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="blog_meta_description">SEO Meta Description</Label>
                      <Textarea
                        id="blog_meta_description"
                        rows={3}
                        value={blogForm.metaDescription}
                        onChange={(event) => setBlogForm((prev) => ({ ...prev, metaDescription: event.target.value }))}
                        placeholder="Concise description for search engines..."
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
                      <div>
                        <p className="text-sm font-medium">Publish immediately</p>
                        <p className="text-xs text-muted-foreground">Draft posts stay hidden until you publish.</p>
                      </div>
                      <Switch
                        checked={blogForm.published}
                        onCheckedChange={(checked) => setBlogForm((prev) => ({ ...prev, published: checked }))}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button type="submit" className="flex-1">
                        {editingBlogSlug ? 'Update Post' : 'Create Post'}
                      </Button>
                      <Button type="button" variant="outline" onClick={handleResetBlogForm}>
                        Clear
                      </Button>
                    </div>
                    {editingBlogSlug && (
                      <Button type="button" variant="ghost" className="w-full text-muted-foreground" onClick={handleResetBlogForm}>
                        Cancel editing
                      </Button>
                    )}
                  </form>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Blog Posts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary">Total: {blogStats.total}</Badge>
                    <Badge variant="secondary">Published: {blogStats.published}</Badge>
                  </div>
                  {blogPosts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No blog posts yet. Start by creating your first article.</p>
                  ) : (
                    <div className="space-y-3">
                      {blogPosts.map((post) => (
                        <div key={post.slug} className="rounded-lg border bg-card/60 p-4 shadow-sm">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="font-semibold leading-snug text-sm md:text-base">{post.title}</p>
                              <p className="text-xs text-muted-foreground">/{post.slug}</p>
                            </div>
                            <Badge variant={post.published ? 'default' : 'outline'}>
                              {post.published ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span>{post.author}</span>
                            <span>{formatBlogDate(post.updatedAt || post.createdAt)}</span>
                            <span>{post.readTime}</span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditBlogPost(post.slug)}>
                              <Edit className="mr-1 h-4 w-4" /> Edit
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => handleTogglePublishBlog(post.slug)}>
                              {post.published ? 'Unpublish' : 'Publish'}
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteBlogPost(post.slug)}>
                              <Trash2 className="mr-1 h-4 w-4" /> Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
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

            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Products</p>
                      <p className="text-2xl font-bold">{analytics.totalProducts}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Published Articles</p>
                      <p className="text-2xl font-bold">{analytics.publishedBlogPosts}</p>
                      <p className="text-xs text-muted-foreground">{analytics.draftBlogPosts} drafts pending</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Average Discount</p>
                      <p className="text-2xl font-bold">{analytics.averageDiscount}%</p>
                      <p className="text-xs text-muted-foreground">Across individual plan pricing</p>
                    </div>
                    <BarChart className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Popup Conversion</p>
                      <p className="text-2xl font-bold">{analytics.popupConversion}%</p>
                      <p className="text-xs text-muted-foreground">{analytics.popupMetrics.clicks} clicks / {analytics.popupMetrics.impressions} impressions</p>
                    </div>
                    <Zap className="h-8 w-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Category coverage</CardTitle>
                <p className="text-sm text-muted-foreground">You are currently selling products across {analytics.categories.length} categories.</p>
              </CardHeader>
              <CardContent>
                {analytics.categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Add category tags to your products to see distribution here.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {analytics.categories.map((category) => (
                      <Badge key={category} variant="secondary">{category}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top saving opportunities</CardTitle>
                <p className="text-sm text-muted-foreground">Highest discount subscriptions (based on monthly plan).</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.topProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Add original pricing to products to highlight savings.</p>
                ) : (
                  analytics.topProducts.map((item) => (
                    <div key={item.id} className="rounded-lg border bg-muted/30 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Saves {item.savings.toLocaleString()} PKR</p>
                        </div>
                        <Badge variant="default">{item.discount}% OFF</Badge>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
