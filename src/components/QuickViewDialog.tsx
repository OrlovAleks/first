import { Star, ShoppingCart, Cpu, HardDrive, Monitor, Weight, Fingerprint, MemoryStick, Laptop, Battery } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/data/products";

interface QuickViewDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (product: Product) => void;
}

const QuickViewDialog = ({ product, open, onOpenChange, onAddToCart }: QuickViewDialogProps) => {
  if (!product) return null;

  const specs = [
    { icon: Cpu, label: "Процессор", value: `${product.cpu} (${product.cpuFrequency})` },
    { icon: MemoryStick, label: "RAM", value: `${product.ram} ГБ ${product.ramType}` },
    { icon: HardDrive, label: "Накопитель", value: `${product.storage >= 1024 ? `${product.storage / 1024} ТБ` : `${product.storage} ГБ`} ${product.storageType}` },
    { icon: Monitor, label: "Экран", value: `${product.screenSize}″ ${product.resolution} ${product.panelType} ${product.refreshRate}Hz` },
    { icon: Laptop, label: "Графика", value: `${product.gpuBrand} ${product.gpuType}${product.vram ? ` ${product.vram} ГБ` : ""}` },
    { icon: Weight, label: "Вес", value: `${product.weight} кг` },
    { icon: Battery, label: "Батарея", value: product.battery },
    { icon: Fingerprint, label: "ОС", value: product.os },
  ];

  const features = [
    product.touchscreen && "Сенсорный экран",
    product.backlitKeyboard && "Подсветка клавиатуры",
    product.fingerprint && "Сканер отпечатка",
  ].filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>{product.brand}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6">
          <img src={product.image} alt={product.name} className="w-full rounded-lg bg-secondary object-cover aspect-square" />
          <div className="space-y-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-rating text-rating" : "text-border"}`} />
              ))}
              <span className="ml-1 text-sm text-muted-foreground">{product.rating}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{product.price.toLocaleString("ru-RU")} ₽</p>
            <p className="text-sm text-muted-foreground">{product.description}</p>
            <div className="grid grid-cols-1 gap-1.5">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2 text-sm">
                  <Icon className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">{label}:</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
            {features.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {features.map(f => <Badge key={f as string} variant="secondary">{f}</Badge>)}
              </div>
            )}
            <Button className="w-full" onClick={() => { onAddToCart(product); onOpenChange(false); }}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              В корзину
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewDialog;
