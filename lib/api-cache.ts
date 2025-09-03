// Global singleton cache for API responses to prevent duplicate calls
class ApiCache {
  private static instance: ApiCache
  private cache = new Map<string, { data: any, timestamp: number, promise?: Promise<any> }>()
  private readonly CACHE_DURATION = 30000 // 30 seconds

  static getInstance(): ApiCache {
    if (!ApiCache.instance) {
      ApiCache.instance = new ApiCache()
    }
    return ApiCache.instance
  }

  async get<T>(key: string, fetcher: () => Promise<T>, forceRefresh = false): Promise<T> {
    const now = Date.now()
    const cached = this.cache.get(key)

    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && cached && (now - cached.timestamp < this.CACHE_DURATION)) {
      // If there's a promise, wait for it (ongoing request)
      if (cached.promise) {
        return cached.promise
      }
      return cached.data
    }

    // If there's already a request in progress, return that promise
    if (cached?.promise) {
      return cached.promise
    }

    // Start new request
    const promise = fetcher()
    
    // Store the promise immediately to prevent duplicate requests
    this.cache.set(key, { 
      data: null, 
      timestamp: now, 
      promise 
    })

    try {
      const data = await promise
      
      // Update cache with data and remove promise
      this.cache.set(key, { 
        data, 
        timestamp: now 
      })
      
      return data
    } catch (error) {
      // Remove failed request from cache
      this.cache.delete(key)
      throw error
    }
  }

  // Force clear cache for a specific key
  invalidate(key: string): void {
    this.cache.delete(key)
  }

  // Clear all cache
  clear(): void {
    this.cache.clear()
  }
}

export const apiCache = ApiCache.getInstance()
