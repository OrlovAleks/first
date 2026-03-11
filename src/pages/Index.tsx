import { useState, useMemo } from "react";
import { ShoppingCart, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";
import FilterSidebar, { type Filters, defaultFilters } from "@/components/FilterSidebar";
import QuickViewDialog from "@/components/QuickViewDialog";
import { products, type Product } from "@/data/products";

const matchWeight = (weight: number, range: string) => {
  if (range === "< 1.3 кг") return weight < 1.3;
  if (range === "1.3–1.8 кг") return weight >= 1.3 && weight <= 1.8;
  if (range === "1.8–2.5 кг") return weight > 1.8 && weight <= 2.5;
  if (range === "> 2.5 кг") return weight > 2.5;
  return false;
};

const applyFilters = (filters: Filters) => {
  return products.filter(p => {
    if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false;
    if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
    if (p.rating < filters.minRating) return false;
    if (filters.cpus.length && !filters.cpus.includes(p.cpu)) return false;
    if (filters.cpuFrequencies.length && !filters.cpuFrequencies.includes(p.cpuFrequency)) return false;
    if (filters.cores.length && !filters.cores.includes(p.cores)) return false;
    if (filters.rams.length && !filters.rams.includes(p.ram)) return false;
    if (filters.ramTypes.length && !filters.ramTypes.includes(p.ramType)) return false;
    if (filters.storages.length && !filters.storages.includes(p.storage)) return false;
    if (filters.storageTypes.length && !filters.storageTypes.includes(p.storageType)) return false;
    if (p.screenSize < filters.screenMin || p.screenSize > filters.screenMax) return false;
    if (filters.resolutions.length && !filters.resolutions.includes(p.resolution)) return false;
    if (filters.panelTypes.length && !filters.panelTypes.includes(p.panelType)) return false;
    if (filters.refreshRates.length && !filters.refreshRates.includes(p.refreshRate)) return false;
    if (filters.gpuTypes.length && !filters.gpuTypes.includes(p.gpuType)) return false;
    if (filters.gpuBrands.length && !filters.gpuBrands.includes(p.gpuBrand)) return false;
    if (filters.vrams.length && !filters.vrams.includes(p.vram)) return false;
    if (filters.weights.length && !filters.weights.some(w => matchWeight(p.weight, w))) return false;
    if (filters.thicknesses.length && !filters.thicknesses.includes(p.thickness)) return false;
    if (filters.batteries.length && !filters.batteries.includes(p.battery)) return false;
    if (filters.oses.length && !filters.oses.includes(p.os)) return false;
    if (filters.touchscreen === "yes" && !p.touchscreen) return false;
    if (filters.touchscreen === "no" && p.touchscreen) return false;
    if (filters.backlitKeyboard === "yes" && !p.backlitKeyboard) return false;
    if (filters.backlitKeyboard === "no" && p.backlitKeyboard) return false;
    if (filters.fingerprint === "yes" && !p.fingerprint) return false;
    if (filters.fingerprint === "no" && p.fingerprint) return false;
    return true;
  });
};

const Index = () => {
  const [pendingFilters, setPendingFilters] = useState<Filters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(defaultFilters);
  const [sortBy, setSortBy] = useState("default");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [cartCount, setCartCount] = useState(0);

  // Preview count updates live as user changes filters
  const previewCount = useMemo(() => applyFilters(pendingFilters).length, [pendingFilters]);

  // Applied results only update on "Apply"
  const filtered = useMemo(() => {
    let result = applyFilters(appliedFilters);
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [appliedFilters, sortBy]);

  const handleApplyFilters = () => {
    setAppliedFilters(pendingFilters);
    toast.success("Фильтры применены");
  };

  const handleResetFilters = (f: Filters) => {
    setPendingFilters(f);
    setAppliedFilters(f);
  };

  const handleAddToCart = (product: Product) => {
    setCartCount(c => c + 1);
    toast.success(`${product.name} добавлен в корзину`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold text-primary">TechStore</h1>
          <Button variant="outline" size="sm" className="relative">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Корзина
            {cartCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                {cartCount}
              </Badge>
            )}
          </Button>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex gap-8">
          <FilterSidebar
            filters={pendingFilters}
            onChange={setPendingFilters}
            onApply={handleApplyFilters}
            resultCount={previewCount}
          />

          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Показано <strong className="text-foreground">{filtered.length}</strong> из {products.length}
              </p>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Сортировка" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">По умолчанию</SelectItem>
                    <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
                    <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
                    <SelectItem value="rating">По рейтингу</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20">
                <p className="text-lg font-medium text-foreground">Ничего не найдено</p>
                <p className="text-sm text-muted-foreground mt-1">Попробуйте изменить параметры фильтров</p>
                <Button variant="outline" className="mt-4" onClick={() => handleResetFilters(defaultFilters)}>
                  Сбросить фильтры
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <QuickViewDialog
        product={quickViewProduct}
        open={!!quickViewProduct}
        onOpenChange={(open) => !open && setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default Index;
