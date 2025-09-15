import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Save, 
  LogOut, 
  Package, 
  TrendingUp, 
  Users, 
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react';
import ProductForm from './ProductForm';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

// Import the product types and data
import { Product, StockType } from '@/data/products';

interface DashboardProps {
  onLogout: () => void;
}

const ProductDashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  // Load products data
  useEffect(() => {
    loadProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product =>
        product.category.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    // Apply stock filter
    if (stockFilter !== 'all') {
      filtered = filtered.filter(product => {
        const inStock = product.stock === true || product.stock === 'unlimited' || (typeof product.stock === 'number' && product.stock > 0);
        return stockFilter === 'in-stock' ? inStock : !inStock;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'price':
          aValue = a.price.monthly || a.price.yearly || 0;
          bValue = b.price.monthly || b.price.yearly || 0;
          break;
        case 'created':
          aValue = new Date(a.createdAt || '').getTime();
          bValue = new Date(b.createdAt || '').getTime();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, stockFilter, sortBy, sortOrder]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      // Load from local data
      const { products: localProducts } = await import('@/data/products');
      setProducts(localProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProducts = async () => {
    try {
      setSaveStatus('saving');
      
      // Generate TypeScript code for products.ts file
      const productsCode = generateProductsFile(products);
      
      // In a real implementation, this would save to your server/file
      // For demo purposes, we'll download the file
      downloadProductsFile(productsCode);
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving products:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const generateProductsFile = (productsData: Product[]) => {
    const fileContent = `// src/data/products.ts

export interface PlanDuration {
  duration: string;
  price: number;
  original?: number;
}

export interface PlanOption {
  type: string;
  description?: string;
  durations: PlanDuration[];
}

export type StockType = boolean | number | "unlimited";

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  images?: string[];
  features: string[];
  price: {
    monthly?: number;
    yearly?: number;
    original?: number;
  };
  plans?: PlanOption[];
  description?: string;
  longDescription?: string;
  badge?: string;
  stock: StockType;
  stockHistory?: Array<{ date: string; stock: StockType; previousStock?: StockType; reason?: string }>;
  rating?: number;
  popular?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export function getProductImage(image?: string): string {
  return image && image.length > 5 ? image : "/images/DefaultImage.jpg";
}

export function getStockLabel(stock: StockType): string {
  if (stock === false || stock === 0) return "Out of Stock";
  if (stock === true || stock === "unlimited") return "In Stock";
  if (typeof stock === "number" && stock > 0) return \`\${stock} left\`;
  return "Unknown";
}

export function isProductInStock(stock: StockType): boolean {
  if (stock === false || stock === 0) return false;
  if (stock === true || stock === "unlimited") return true;
  if (typeof stock === "number" && stock > 0) return true;
  return false;
}

export const products: Product[] = ${JSON.stringify(productsData, null, 2)};

export const categories = [
    { id: "all", name: "All", count: products.length },
    { id: "entertainment", name: "Entertainment", count: products.filter(p => p.category.includes("Entertainment")).length },
    { id: "streaming", name: "Streaming", count: products.filter(p => p.category.includes("Streaming")).length },
    { id: "music", name: "Music", count: products.filter(p => p.category.includes("Music")).length },
    { id: "gaming", name: "Gaming", count: products.filter(p => p.category.includes("Gaming")).length },
    { id: "ai-tools", name: "AI Tools", count: products.filter(p => p.category.includes("AI Tools")).length },
    { id: "seo-tools", name: "SEO Tools", count: products.filter(p => p.category.includes("SEO Tools")).length },
    { id: "study-tools", name: "Study Tools", count: products.filter(p => p.category.includes("Study Tools")).length },
    { id: "writer-tools", name: "Writer Tools", count: products.filter(p => p.category.includes("Writer Tools")).length },
    { id: "social-media-services", name: "Social Media", count: products.filter(p => p.category.includes("Social Media")).length },
    { id: "vpn", name: "VPN", count: products.filter(p => p.category.includes("VPN")).length },
    { id: "software", name: "Software", count: products.filter(p => p.category.includes("Software")).length },
    { id: "productivity", name: "Productivity", count: products.filter(p => p.category.includes("Productivity")).length },
    { id: "courses", name: "Courses", count: products.filter(p => p.category.includes("Courses")).length },
    { id: "graphics-creative", name: "Graphics/Creative", count: products.filter(p => p.category.includes("Graphics/Creative")).length },
    { id: "business", name: "Business", count: products.filter(p => p.category.includes("Business")).length },
    { id: "services", name: "Services", count: products.filter(p => p.category.includes("Services")).length },
];`;
    return fileContent;
  };

  const downloadProductsFile = (content: string) => {
    const blob = new Blob([content], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStockStatus = (stock: StockType) => {
    if (stock === false || stock === 0) return { label: 'Out of Stock', color: 'destructive' as const };
    if (stock === true || stock === 'unlimited') return { label: 'In Stock', color: 'default' as const };
    if (typeof stock === 'number' && stock > 0) return { label: `${stock} left`, color: stock < 5 ? 'secondary' as const : 'default' as const };
    return { label: 'Unknown', color: 'secondary' as const };
  };

  const getUniqueCategories = () => {
    const categories = new Set<string>();
    products.forEach(product => {
      product.category.split(',').forEach(cat => {
        categories.add(cat.trim());
      });
    });
    return Array.from(categories);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedProducts.length === 0) return;

    switch (action) {
      case 'delete':
        if (window.confirm(`Delete ${selectedProducts.length} selected products?`)) {
          setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)));
          setSelectedProducts([]);
        }
        break;
      case 'in-stock':
        setProducts(prev => prev.map(p => 
          selectedProducts.includes(p.id) ? { ...p, stock: true } : p
        ));
        setSelectedProducts([]);
        break;
      case 'out-stock':
        setProducts(prev => prev.map(p => 
          selectedProducts.includes(p.id) ? { ...p, stock: false } : p
        ));
        setSelectedProducts([]);
        break;
    }
  };

  const deleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const duplicateProduct = (product: Product) => {
    const newProduct: Product = {
      ...product,
      id: `${product.id}-copy-${Date.now()}`,
      name: `${product.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } else {
      setProducts(prev => [...prev, product]);
    }
    setEditingProduct(null);
    setShowCreateForm(false);
  };

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.stock !== false && p.stock !== 0).length,
    outOfStock: products.filter(p => p.stock === false || p.stock === 0).length,
    popular: products.filter(p => p.popular).length,
    categories: getUniqueCategories().length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Package className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">KINGS SUBS WEB Controller</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Advanced Product Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={saveProducts}
                disabled={saveStatus === 'saving'}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveStatus === 'saving' ? 'Saving...' : 'Save to Server'}
              </Button>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {saveStatus !== 'idle' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Alert className={saveStatus === 'success' ? 'border-green-500 bg-green-50' : saveStatus === 'error' ? 'border-red-500 bg-red-50' : ''}>
            {saveStatus === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
            {saveStatus === 'error' && <XCircle className="w-4 h-4 text-red-600" />}
            <AlertDescription>
              {saveStatus === 'success' && 'Products file downloaded successfully! Replace your original products.ts file with the downloaded version.'}
              {saveStatus === 'error' && 'Failed to save products. Please try again.'}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Products Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics & Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Package className="w-8 h-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">In Stock</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.inStock}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <XCircle className="w-8 h-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.outOfStock}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="w-8 h-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Popular</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.popular}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Categories</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Products Management</CardTitle>
                    <CardDescription>
                      View, edit, and manage all your products from one place
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {getUniqueCategories().map(category => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={stockFilter} onValueChange={setStockFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by stock" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stock Status</SelectItem>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="out-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                    const [field, order] = value.split('-');
                    setSortBy(field);
                    setSortOrder(order as 'asc' | 'desc');
                  }}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                      <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                      <SelectItem value="category-asc">Category (A-Z)</SelectItem>
                      <SelectItem value="price-asc">Price (Low-High)</SelectItem>
                      <SelectItem value="price-desc">Price (High-Low)</SelectItem>
                      <SelectItem value="created-desc">Newest First</SelectItem>
                      <SelectItem value="created-asc">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedProducts.length > 0 && (
                  <div className="flex items-center gap-4 mb-4 p-4 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">
                      {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction('in-stock')}>
                        Mark In Stock
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction('out-stock')}>
                        Mark Out of Stock
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                        Delete Selected
                      </Button>
                    </div>
                  </div>
                )}

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500">Loading products...</div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => {
                        const stockStatus = getStockStatus(product.stock);
                        return (
                          <TableRow key={product.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedProducts.includes(product.id)}
                                onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <img
                                  src={product.image || '/images/DefaultImage.jpg'}
                                  alt={product.name}
                                  className="w-10 h-10 rounded-lg object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/images/DefaultImage.jpg';
                                  }}
                                />
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-gray-500">{product.id}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{product.category.split(',')[0].trim()}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {product.price.monthly && `PKR ${product.price.monthly}/mo`}
                                {product.price.yearly && `PKR ${product.price.yearly}/yr`}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={stockStatus.color}>{stockStatus.label}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {product.popular && <Badge className="bg-yellow-100 text-yellow-800">Popular</Badge>}
                                {product.badge && <Badge variant="secondary">{product.badge}</Badge>}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingProduct(product)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => duplicateProduct(product)}
                                >
                                  Copy
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteProduct(product.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}

                {filteredProducts.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || categoryFilter !== 'all' || stockFilter !== 'all'
                        ? 'No products match your current filters.'
                        : 'Get started by adding your first product.'}
                    </p>
                    {searchTerm || categoryFilter !== 'all' || stockFilter !== 'all' ? (
                      <Button variant="outline" onClick={() => {
                        setSearchTerm('');
                        setCategoryFilter('all');
                        setStockFilter('all');
                      }}>
                        Clear Filters
                      </Button>
                    ) : (
                      <Button onClick={() => setShowCreateForm(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>

      <ProductForm
        product={editingProduct}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={handleSaveProduct}
      />
      
      <ProductForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default ProductDashboard;