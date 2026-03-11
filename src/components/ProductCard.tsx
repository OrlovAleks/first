import { Star, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onQuickView, onAddToCart }: ProductCardProps) => {
  return (
    <div className="group rounded-lg border border-border bg-card overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          onClick={() => onQuickView(product)}
          className="absolute top-3 right-3 rounded-full bg-background/90 p-2 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-background"
        >
          <Eye className="h-4 w-4 text-foreground" />
        </button>
      </div>
      <div className="p-4 space-y-2">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{product.brand}</p>
        <h3 className="font-semibold text-card-foreground leading-tight line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? "fill-rating text-rating" : "text-border"}`}
            />
          ))}
          <span className="ml-1 text-xs text-muted-foreground">{product.rating}</span>
        </div>
        <p className="text-lg font-bold text-foreground">{product.price.toLocaleString("ru-RU")} ₽</p>
        <Button
          onClick={() => onAddToCart(product)}
          className="w-full mt-2"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-1" />
          В корзину
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
