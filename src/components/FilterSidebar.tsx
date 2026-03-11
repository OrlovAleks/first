import { useState } from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  brands, cpuOptions, cpuFrequencyOptions, coreOptions,
  ramOptions, ramTypeOptions, storageOptions, storageTypeOptions,
  resolutionOptions, panelTypeOptions, refreshRateOptions,
  gpuTypeOptions, gpuBrandOptions, vramOptions,
  weightRanges, thicknessOptions, batteryOptions, osOptions,
} from "@/data/products";

export interface Filters {
  priceRange: [number, number];
  brands: string[];
  minRating: number;
  cpus: string[];
  cpuFrequencies: string[];
  cores: string[];
  rams: number[];
  ramTypes: string[];
  storages: number[];
  storageTypes: string[];
  screenMin: number;
  screenMax: number;
  resolutions: string[];
  panelTypes: string[];
  refreshRates: number[];
  gpuTypes: string[];
  gpuBrands: string[];
  vrams: number[];
  weights: string[];
  thicknesses: string[];
  batteries: string[];
  oses: string[];
  touchscreen: "any" | "yes" | "no";
  backlitKeyboard: "any" | "yes" | "no";
  fingerprint: "any" | "yes" | "no";
}

export const defaultFilters: Filters = {
  priceRange: [25000, 300000],
  brands: [],
  minRating: 0,
  cpus: [],
  cpuFrequencies: [],
  cores: [],
  rams: [],
  ramTypes: [],
  storages: [],
  storageTypes: [],
  screenMin: 13,
  screenMax: 17,
  resolutions: [],
  panelTypes: [],
  refreshRates: [],
  gpuTypes: [],
  gpuBrands: [],
  vrams: [],
  weights: [],
  thicknesses: [],
  batteries: [],
  oses: [],
  touchscreen: "any",
  backlitKeyboard: "any",
  fingerprint: "any",
};

interface FilterSidebarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onApply: () => void;
  resultCount: number;
}

const FilterSidebar = ({ filters, onChange, onApply, resultCount }: FilterSidebarProps) => {
  const update = (partial: Partial<Filters>) => onChange({ ...filters, ...partial });

  const toggleArray = <T,>(arr: T[], val: T) =>
    arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];

  const CheckboxGroup = ({ items, selected, onToggle, formatLabel }: {
    items: (string | number)[];
    selected: (string | number)[];
    onToggle: (val: any) => void;
    formatLabel?: (val: any) => string;
  }) => (
    <div className="space-y-2">
      {items.map(item => (
        <label key={String(item)} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
          <Checkbox
            checked={(selected as any[]).includes(item)}
            onCheckedChange={() => onToggle(item)}
          />
          {formatLabel ? formatLabel(item) : String(item)}
        </label>
      ))}
    </div>
  );

  const BooleanFilter = ({ label, value, field }: { label: string; value: "any" | "yes" | "no"; field: keyof Filters }) => (
    <div>
      <p className="text-sm font-medium text-foreground mb-2">{label}</p>
      <div className="space-y-2">
        {([["any", "Любой"], ["yes", "Да"], ["no", "Нет"]] as const).map(([val, lbl]) => (
          <label key={val} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input
              type="radio"
              name={field}
              checked={value === val}
              onChange={() => update({ [field]: val } as any)}
              className="accent-primary"
            />
            {lbl}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <aside className="w-72 shrink-0 rounded-lg border border-border bg-card overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h3 className="text-base font-bold text-foreground">Фильтры</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onChange(defaultFilters)}>
          <RotateCcw className="h-3.5 w-3.5 mr-1" />
          Сбросить
        </Button>
      </div>

      {/* Scrollable filters */}
      <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: "calc(100vh - 330px)" }}>
        <Accordion type="multiple" defaultValue={["price", "brand"]} className="space-y-0">
          {/* Цена */}
          <AccordionItem value="price">
            <AccordionTrigger className="text-sm font-semibold py-3">Цена, ₽</AccordionTrigger>
            <AccordionContent>
              <div className="pt-3 pb-1 px-1">
                <Slider
                  min={25000} max={300000} step={1000}
                  value={filters.priceRange}
                  onValueChange={(v) => update({ priceRange: v as [number, number] })}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{filters.priceRange[0].toLocaleString("ru-RU")}</span>
                <span>{filters.priceRange[1].toLocaleString("ru-RU")}</span>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Бренд */}
          <AccordionItem value="brand">
            <AccordionTrigger className="text-sm font-semibold py-3">Бренд</AccordionTrigger>
            <AccordionContent>
              <CheckboxGroup
                items={brands}
                selected={filters.brands}
                onToggle={(b: string) => update({ brands: toggleArray(filters.brands, b) })}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Рейтинг */}
          <AccordionItem value="rating">
            <AccordionTrigger className="text-sm font-semibold py-3">Минимальный рейтинг</AccordionTrigger>
            <AccordionContent>
              <div className="pt-3 pb-1 px-1">
                <Slider min={0} max={5} step={0.2} value={[filters.minRating]} onValueChange={([v]) => update({ minRating: v })} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">от {filters.minRating} ★</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="rounded-md bg-secondary px-3 py-2 text-center text-sm text-secondary-foreground">
          {resultCount === 0 ? (
            <span className="text-destructive font-medium">Нет товаров по заданным фильтрам</span>
          ) : (
            <span>Найдено: <strong>{resultCount}</strong></span>
          )}
        </div>
        <Button className="w-full" onClick={onApply}>
          Применить фильтры
        </Button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
