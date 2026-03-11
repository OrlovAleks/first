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
      <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: "calc(100vh - 200px)" }}>
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
                <Slider min={0} max={5} step={0.5} value={[filters.minRating]} onValueChange={([v]) => update({ minRating: v })} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">от {filters.minRating} ★</p>
            </AccordionContent>
          </AccordionItem>

          {/* Производительность */}
          <AccordionItem value="performance">
            <AccordionTrigger className="text-sm font-semibold py-3">Производительность</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Тип процессора</p>
                <CheckboxGroup items={cpuOptions} selected={filters.cpus} onToggle={(c: string) => update({ cpus: toggleArray(filters.cpus, c) })} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Частота процессора</p>
                <CheckboxGroup items={cpuFrequencyOptions} selected={filters.cpuFrequencies} onToggle={(c: string) => update({ cpuFrequencies: toggleArray(filters.cpuFrequencies, c) })} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Количество ядер</p>
                <CheckboxGroup items={coreOptions} selected={filters.cores} onToggle={(c: string) => update({ cores: toggleArray(filters.cores, c) })} />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Память */}
          <AccordionItem value="memory">
            <AccordionTrigger className="text-sm font-semibold py-3">Память</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Оперативная память</p>
                <CheckboxGroup items={ramOptions} selected={filters.rams} onToggle={(r: number) => update({ rams: toggleArray(filters.rams, r) })} formatLabel={(v: number) => `${v} ГБ`} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Тип RAM</p>
                <CheckboxGroup items={ramTypeOptions} selected={filters.ramTypes} onToggle={(r: string) => update({ ramTypes: toggleArray(filters.ramTypes, r) })} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Объём накопителя</p>
                <CheckboxGroup items={storageOptions} selected={filters.storages} onToggle={(s: number) => update({ storages: toggleArray(filters.storages, s) })} formatLabel={(v: number) => v >= 1024 ? `${v / 1024} ТБ` : `${v} ГБ`} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Тип накопителя</p>
                <CheckboxGroup items={storageTypeOptions} selected={filters.storageTypes} onToggle={(s: string) => update({ storageTypes: toggleArray(filters.storageTypes, s) })} />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Экран */}
          <AccordionItem value="screen">
            <AccordionTrigger className="text-sm font-semibold py-3">Экран</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Диагональ</p>
                <div className="pt-3 pb-1 px-1">
                  <Slider min={13} max={17} step={0.1} value={[filters.screenMin, filters.screenMax]} onValueChange={([a, b]) => update({ screenMin: a, screenMax: b })} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>{filters.screenMin}″</span>
                  <span>{filters.screenMax}″</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Разрешение</p>
                <CheckboxGroup items={resolutionOptions} selected={filters.resolutions} onToggle={(r: string) => update({ resolutions: toggleArray(filters.resolutions, r) })} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Тип матрицы</p>
                <CheckboxGroup items={panelTypeOptions} selected={filters.panelTypes} onToggle={(p: string) => update({ panelTypes: toggleArray(filters.panelTypes, p) })} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Частота обновления</p>
                <CheckboxGroup items={refreshRateOptions} selected={filters.refreshRates} onToggle={(r: number) => update({ refreshRates: toggleArray(filters.refreshRates, r) })} formatLabel={(v: number) => `${v} Hz`} />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Графика */}
          <AccordionItem value="graphics">
            <AccordionTrigger className="text-sm font-semibold py-3">Графика</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Тип видеокарты</p>
                <CheckboxGroup items={gpuTypeOptions} selected={filters.gpuTypes} onToggle={(g: string) => update({ gpuTypes: toggleArray(filters.gpuTypes, g) })} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Производитель GPU</p>
                <CheckboxGroup items={gpuBrandOptions} selected={filters.gpuBrands} onToggle={(g: string) => update({ gpuBrands: toggleArray(filters.gpuBrands, g) })} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Объём видеопамяти</p>
                <CheckboxGroup items={vramOptions} selected={filters.vrams} onToggle={(v: number) => update({ vrams: toggleArray(filters.vrams, v) })} formatLabel={(v: number) => `${v} ГБ`} />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Портативность */}
          <AccordionItem value="portability">
            <AccordionTrigger className="text-sm font-semibold py-3">Портативность</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Вес</p>
                <CheckboxGroup items={weightRanges} selected={filters.weights} onToggle={(w: string) => update({ weights: toggleArray(filters.weights, w) })} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Толщина корпуса</p>
                <CheckboxGroup items={thicknessOptions} selected={filters.thicknesses} onToggle={(t: string) => update({ thicknesses: toggleArray(filters.thicknesses, t) })} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Время работы</p>
                <CheckboxGroup items={batteryOptions} selected={filters.batteries} onToggle={(b: string) => update({ batteries: toggleArray(filters.batteries, b) })} />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Дополнительные функции */}
          <AccordionItem value="extras">
            <AccordionTrigger className="text-sm font-semibold py-3">Дополнительные функции</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Операционная система</p>
                <CheckboxGroup items={osOptions} selected={filters.oses} onToggle={(o: string) => update({ oses: toggleArray(filters.oses, o) })} />
              </div>
              <BooleanFilter label="Сенсорный экран" value={filters.touchscreen} field="touchscreen" />
              <BooleanFilter label="Подсветка клавиатуры" value={filters.backlitKeyboard} field="backlitKeyboard" />
              <BooleanFilter label="Сканер отпечатка пальца" value={filters.fingerprint} field="fingerprint" />
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
