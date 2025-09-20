import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface AdminSettings {
  id?: number
  whatsapp_number?: string
  whatsapp_direct_order?: boolean
  enable_purchase_notifications?: boolean
  enable_floating_cart?: boolean
  show_discount_badges?: boolean
  show_breadcrumbs?: boolean
  popup_settings?: any
  updated_at?: string
}

export interface ProductData {
  id: string
  name: string
  category: string
  description?: string
  features?: string[] // JSON array
  image?: string
  popular?: boolean
  badge?: string
  price?: any // JSON object
  stock?: any // JSON - can be boolean, number, or string
  created_at?: string
  updated_at?: string
}

// Admin settings service
export class AdminSettingsService {
  private static readonly TABLE_NAME = 'admin_settings'

  static async getSettings(): Promise<AdminSettings | null> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching admin settings:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getSettings:', error)
      return null
    }
  }

  static async updateSettings(settings: Partial<AdminSettings>): Promise<boolean> {
    try {
      // First, try to get existing settings
      const existing = await this.getSettings()

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from(this.TABLE_NAME)
          .update({
            ...settings,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)

        if (error) {
          console.error('Error updating admin settings:', error)
          return false
        }
      } else {
        // Insert new record
        const { error } = await supabase
          .from(this.TABLE_NAME)
          .insert({
            ...settings,
            updated_at: new Date().toISOString()
          })

        if (error) {
          console.error('Error inserting admin settings:', error)
          return false
        }
      }

      return true
    } catch (error) {
      console.error('Error in updateSettings:', error)
      return false
    }
  }

  static subscribeToChanges(callback: (settings: AdminSettings) => void) {
    const subscription = supabase
      .channel('admin_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: this.TABLE_NAME
        },
        (payload) => {
          console.log('🔄 Admin settings changed in database:', payload)
          if (payload.new) {
            callback(payload.new as AdminSettings)
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }
}

// Products service
export class ProductsService {
  private static readonly TABLE_NAME = 'products'

  static async getProducts(): Promise<ProductData[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getProducts:', error)
      return []
    }
  }

  static async updateProducts(products: ProductData[]): Promise<boolean> {
    try {
      // First, delete all existing products
      const { error: deleteError } = await supabase
        .from(this.TABLE_NAME)
        .delete()
        .neq('id', 'impossible-id') // Delete all rows

      if (deleteError) {
        console.error('Error deleting existing products:', deleteError)
        return false
      }

      // Then insert all new products
      if (products.length > 0) {
        const productsToInsert = products.map(product => ({
          ...product,
          features: JSON.stringify(product.features || []),
          price: JSON.stringify(product.price || {}),
          stock: JSON.stringify(product.stock || false),
          updated_at: new Date().toISOString()
        }))

        const { error: insertError } = await supabase
          .from(this.TABLE_NAME)
          .insert(productsToInsert)

        if (insertError) {
          console.error('Error inserting products:', insertError)
          return false
        }
      }

      return true
    } catch (error) {
      console.error('Error in updateProducts:', error)
      return false
    }
  }

  static async addProduct(product: ProductData): Promise<boolean> {
    try {
      const productToInsert = {
        ...product,
        features: JSON.stringify(product.features || []),
        price: JSON.stringify(product.price || {}),
        stock: JSON.stringify(product.stock || false),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from(this.TABLE_NAME)
        .insert([productToInsert])

      if (error) {
        console.error('Error adding product:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in addProduct:', error)
      return false
    }
  }

  static async updateProduct(product: ProductData): Promise<boolean> {
    try {
      const productToUpdate = {
        ...product,
        features: JSON.stringify(product.features || []),
        price: JSON.stringify(product.price || {}),
        stock: JSON.stringify(product.stock || false),
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from(this.TABLE_NAME)
        .update(productToUpdate)
        .eq('id', product.id)

      if (error) {
        console.error('Error updating product:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in updateProduct:', error)
      return false
    }
  }

  static async deleteProduct(productId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(this.TABLE_NAME)
        .delete()
        .eq('id', productId)

      if (error) {
        console.error('Error deleting product:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in deleteProduct:', error)
      return false
    }
  }

  static subscribeToChanges(callback: (products: ProductData[]) => void) {
    const subscription = supabase
      .channel('products_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: this.TABLE_NAME
        },
        async (payload) => {
          console.log('🔄 Products changed in database:', payload)
          // Reload all products when any change occurs
          const products = await this.getProducts()
          callback(products)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  // Convert database product to client format
  static convertToClientFormat(dbProduct: ProductData): any {
    return {
      ...dbProduct,
      features: typeof dbProduct.features === 'string' 
        ? JSON.parse(dbProduct.features) 
        : dbProduct.features || [],
      price: typeof dbProduct.price === 'string' 
        ? JSON.parse(dbProduct.price) 
        : dbProduct.price || {},
      stock: typeof dbProduct.stock === 'string' 
        ? JSON.parse(dbProduct.stock) 
        : dbProduct.stock || false,
      createdAt: dbProduct.created_at,
      updatedAt: dbProduct.updated_at
    }
  }

  // Convert client product to database format
  static convertToDatabaseFormat(clientProduct: any): ProductData {
    return {
      id: clientProduct.id,
      name: clientProduct.name,
      category: clientProduct.category,
      description: clientProduct.description,
      features: clientProduct.features || [],
      image: clientProduct.image,
      popular: clientProduct.popular || false,
      badge: clientProduct.badge,
      price: clientProduct.price || {},
      stock: clientProduct.stock || false,
      created_at: clientProduct.createdAt || new Date().toISOString(),
      updated_at: clientProduct.updatedAt || new Date().toISOString()
    }
  }
}
