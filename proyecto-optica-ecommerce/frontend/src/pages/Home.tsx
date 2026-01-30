import { useEffect, useState } from 'react';
import { productsApi } from '../api/products';
import type { Product, Category } from '../types';
import {
  HeroSection,
  CategoriesSection,
  FeaturedProductsSection,
  FindGlassesSection,
  ServicesSection,
  SocialProofSection,
  Footer,
} from '../components/landing';

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsApi.getAll({ limit: 8 }),
          productsApi.getCategories(),
        ]);
        if (productsRes.success) {
          setFeaturedProducts(productsRes.data);
        }
        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0c10] overflow-x-hidden">
      <HeroSection />
      <CategoriesSection categories={categories} isLoading={isLoading} />
      <FeaturedProductsSection products={featuredProducts} isLoading={isLoading} />
      <FindGlassesSection />
      <ServicesSection />
      <SocialProofSection />
      <Footer />
    </div>
  );
}
