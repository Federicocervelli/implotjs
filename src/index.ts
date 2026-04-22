// @ts-ignore The Emscripten runtime is generated into dist/ during the build.
import createNativeModule from "./implotjs.js";

export type NumericArray =
  | number[]
  | Float32Array
  | Float64Array
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array;

type NumericTypedArray = Exclude<NumericArray, number[]>;

export type Color = [number, number, number, number];
export type Vec2 = [number, number];

export interface PlotPoint {
  x: number;
  y: number;
}

export interface PlotRect {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface Bounds {
  min: Vec2 | PlotPoint;
  max: Vec2 | PlotPoint;
}

export interface DragPointState extends PlotPoint {}

export interface ScalarState {
  value: number;
}

export interface DragRectState {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface ColormapSliderState {
  t: number;
  changed?: boolean;
  color?: number[];
}

export interface ImPlotChartOptions {
  canvas?: HTMLCanvasElement;
  width?: number;
  height?: number;
  title?: string;
  flags?: number;
  theme?: number;
  autoStart?: boolean;
  locateFile?: (path: string, prefix?: string) => string;
  moduleOverrides?: Record<string, unknown>;
}

export interface CapturedPlotState {
  title: string;
  pos: number[];
  size: number[];
  mousePos: PlotPoint;
  limits: PlotRect;
  hovered: boolean;
  selected: boolean;
  selection: PlotRect;
  axisHovered: Record<number, boolean>;
  axisScales: Record<number, number>;
}

interface NativeModuleInit {
  canvas: HTMLCanvasElement;
  locateFile: (path: string, prefix?: string) => string;
  [key: string]: unknown;
}

interface NativeModule {
  _malloc(size: number): number;
  _free(ptr: number): void;
  HEAPU8: Uint8Array;
  HEAPU32: Uint32Array;
  HEAPF32: Float32Array;
  HEAPF64: Float64Array;
  [key: string]: any;
}

type NativeModuleFactory = (options: NativeModuleInit) => Promise<NativeModule>;
type RuntimeAction = (module: NativeModule) => unknown;
type PlotNode = {
  type: string;
  children?: PlotNode[];
  tempAllocations?: number[];
  [key: string]: any;
};

const loadNativeModule = createNativeModule as NativeModuleFactory;

function defaultLocateFile(path: string): string {
  return new URL(`./${path}`, import.meta.url).toString();
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const ImAxis = {
  X1: 0,
  X2: 1,
  X3: 2,
  Y1: 3,
  Y2: 4,
  Y3: 5,
  COUNT: 6,
} as const;

export const ImPlotFlags = {
  None: 0,
  NoTitle: 1 << 0,
  NoLegend: 1 << 1,
  NoMouseText: 1 << 2,
  NoInputs: 1 << 3,
  NoMenus: 1 << 4,
  NoBoxSelect: 1 << 5,
  NoFrame: 1 << 6,
  Equal: 1 << 7,
  Crosshairs: 1 << 8,
  CanvasOnly: (1 << 0) | (1 << 1) | (1 << 4) | (1 << 5) | (1 << 2),
};

export const ImPlotAxisFlags = {
  None: 0,
  NoLabel: 1 << 0,
  NoGridLines: 1 << 1,
  NoTickMarks: 1 << 2,
  NoTickLabels: 1 << 3,
  NoInitialFit: 1 << 4,
  NoMenus: 1 << 5,
  NoSideSwitch: 1 << 6,
  NoHighlight: 1 << 7,
  Opposite: 1 << 8,
  Foreground: 1 << 9,
  Invert: 1 << 10,
  AutoFit: 1 << 11,
  RangeFit: 1 << 12,
  PanStretch: 1 << 13,
  LockMin: 1 << 14,
  LockMax: 1 << 15,
  Lock: (1 << 14) | (1 << 15),
  NoDecorations: (1 << 0) | (1 << 1) | (1 << 2) | (1 << 3),
  AuxDefault: (1 << 1) | (1 << 8),
};

export const ImPlotSubplotFlags = {
  None: 0,
  NoTitle: 1 << 0,
  NoLegend: 1 << 1,
  NoMenus: 1 << 2,
  NoResize: 1 << 3,
  NoAlign: 1 << 4,
  ShareItems: 1 << 5,
  LinkRows: 1 << 6,
  LinkCols: 1 << 7,
  LinkAllX: 1 << 8,
  LinkAllY: 1 << 9,
  ColMajor: 1 << 10,
};

export const ImPlotLegendFlags = {
  None: 0,
  NoButtons: 1 << 0,
  NoHighlightItem: 1 << 1,
  NoHighlightAxis: 1 << 2,
  NoMenus: 1 << 3,
  Outside: 1 << 4,
  Horizontal: 1 << 5,
  Sort: 1 << 6,
  Reverse: 1 << 7,
};

export const ImPlotMouseTextFlags = {
  None: 0,
  NoAuxAxes: 1 << 0,
  NoFormat: 1 << 1,
  ShowAlways: 1 << 2,
};

export const ImPlotDragToolFlags = {
  None: 0,
  NoCursors: 1 << 0,
  NoFit: 1 << 1,
  NoInputs: 1 << 2,
  Delayed: 1 << 3,
};

export const ImPlotColormapScaleFlags = {
  None: 0,
  NoLabel: 1 << 0,
  Opposite: 1 << 1,
  Invert: 1 << 2,
};

export const ImPlotItemFlags = {
  None: 0,
  NoLegend: 1 << 0,
  NoFit: 1 << 1,
};

export const ImPlotLineFlags = {
  None: 0,
  Segments: 1 << 10,
  Loop: 1 << 11,
  SkipNaN: 1 << 12,
  NoClip: 1 << 13,
  Shaded: 1 << 14,
};

export const ImPlotScatterFlags = { None: 0, NoClip: 1 << 10 };
export const ImPlotBubblesFlags = { None: 0 };
export const ImPlotPolygonFlags = { None: 0, Concave: 1 << 10 };
export const ImPlotStairsFlags = { None: 0, PreStep: 1 << 10, Shaded: 1 << 11 };
export const ImPlotShadedFlags = { None: 0 };
export const ImPlotBarsFlags = { None: 0, Horizontal: 1 << 10 };
export const ImPlotBarGroupsFlags = { None: 0, Horizontal: 1 << 10, Stacked: 1 << 11 };
export const ImPlotErrorBarsFlags = { None: 0, Horizontal: 1 << 10 };
export const ImPlotStemsFlags = { None: 0, Horizontal: 1 << 10 };
export const ImPlotInfLinesFlags = { None: 0, Horizontal: 1 << 10 };
export const ImPlotPieChartFlags = { None: 0, Normalize: 1 << 10, IgnoreHidden: 1 << 11, Exploding: 1 << 12, NoSliceBorder: 1 << 13 };
export const ImPlotHeatmapFlags = { None: 0, ColMajor: 1 << 10 };
export const ImPlotHistogramFlags = {
  None: 0,
  Horizontal: 1 << 10,
  Cumulative: 1 << 11,
  Density: 1 << 12,
  NoOutliers: 1 << 13,
  ColMajor: 1 << 14,
};
export const ImPlotDigitalFlags = { None: 0 };
export const ImPlotImageFlags = { None: 0 };
export const ImPlotTextFlags = { None: 0, Vertical: 1 << 10 };
export const ImPlotDummyFlags = { None: 0 };
export const ImPlotCond = { None: 0, Always: 1, Once: 2 };

export const ImPlotScale = {
  Linear: 0,
  Time: 1,
  Log10: 2,
  SymLog: 3,
};

export const ImPlotMarker = {
  None: -2,
  Auto: -1,
  Circle: 0,
  Square: 1,
  Diamond: 2,
  Up: 3,
  Down: 4,
  Left: 5,
  Right: 6,
  Cross: 7,
  Plus: 8,
  Asterisk: 9,
};

export const ImPlotColormap = {
  Deep: 0,
  Dark: 1,
  Pastel: 2,
  Paired: 3,
  Viridis: 4,
  Plasma: 5,
  Hot: 6,
  Cool: 7,
  Pink: 8,
  Jet: 9,
  Twilight: 10,
  RdBu: 11,
  BrBG: 12,
  PiYG: 13,
  Spectral: 14,
  Greys: 15,
};

export const ImPlotLocation = {
  Center: 0,
  North: 1 << 0,
  South: 1 << 1,
  West: 1 << 2,
  East: 1 << 3,
  NorthWest: (1 << 0) | (1 << 2),
  NorthEast: (1 << 0) | (1 << 3),
  SouthWest: (1 << 1) | (1 << 2),
  SouthEast: (1 << 1) | (1 << 3),
};

export const ImPlotBin = {
  Sqrt: -1,
  Sturges: -2,
  Rice: -3,
  Scott: -4,
};

export const ImPlotCol = {
  FrameBg: 0,
  PlotBg: 1,
  PlotBorder: 2,
  LegendBg: 3,
  LegendBorder: 4,
  LegendText: 5,
  TitleText: 6,
  InlayText: 7,
  AxisText: 8,
  AxisGrid: 9,
  AxisTick: 10,
  AxisBg: 11,
  AxisBgHovered: 12,
  AxisBgActive: 13,
  Selection: 14,
  Crosshairs: 15,
  COUNT: 16,
};

export const ImPlotStyleVar = {
  PlotDefaultSize: 0,
  PlotMinSize: 1,
  PlotBorderSize: 2,
  MinorAlpha: 3,
  MajorTickLen: 4,
  MinorTickLen: 5,
  MajorTickSize: 6,
  MinorTickSize: 7,
  MajorGridSize: 8,
  MinorGridSize: 9,
  PlotPadding: 10,
  LabelPadding: 11,
  LegendPadding: 12,
  LegendInnerPadding: 13,
  LegendSpacing: 14,
  MousePosPadding: 15,
  AnnotationPadding: 16,
  FitPadding: 17,
  DigitalPadding: 18,
  DigitalSpacing: 19,
  COUNT: 20,
};

export const ImPlotProp = {
  LineColor: 0,
  LineColors: 1,
  LineWeight: 2,
  FillColor: 3,
  FillColors: 4,
  FillAlpha: 5,
  Marker: 6,
  MarkerSize: 7,
  MarkerSizes: 8,
  MarkerLineColor: 9,
  MarkerLineColors: 10,
  MarkerFillColor: 11,
  MarkerFillColors: 12,
  Size: 13,
  Offset: 14,
  Stride: 15,
  Flags: 16,
};

export const ImPlotTheme = {
  Auto: 0,
  Classic: 1,
  Dark: 2,
  Light: 3,
};

function isTypedArray(value: unknown): value is NumericTypedArray {
  return ArrayBuffer.isView(value) && !(value instanceof DataView);
}

function toFloat64Array(value: NumericArray | number[][] | unknown, label = "values"): Float64Array {
  if (value instanceof BigInt64Array || value instanceof BigUint64Array) {
    throw new Error(`${label} does not support bigint typed arrays in v1.`);
  }
  if (value instanceof Float64Array) {
    return value;
  }
  if (isTypedArray(value)) {
    return Float64Array.from(value);
  }
  if (Array.isArray(value)) {
    return Float64Array.from(value);
  }
  throw new Error(`${label} must be a numeric array or typed array.`);
}

function toColor(value: Color | number[] | undefined | null, fallback: Color = [1, 1, 1, 1]): Color {
  if (!value) {
    return [...fallback] as Color;
  }
  if (Array.isArray(value) && value.length === 4) {
    return [Number(value[0]), Number(value[1]), Number(value[2]), Number(value[3])] as Color;
  }
  throw new Error("color must be a four-number array [r, g, b, a].");
}

function toVec2(value: Vec2 | PlotPoint | undefined | null, fallback: Vec2 = [0, 0]): Vec2 {
  if (!value) {
    return [...fallback] as Vec2;
  }
  if (Array.isArray(value) && value.length === 2) {
    return [Number(value[0]), Number(value[1])] as Vec2;
  }
  if (typeof value === "object" && value !== null && "x" in value && "y" in value) {
    return [Number(value.x), Number(value.y)] as Vec2;
  }
  throw new Error("value must be a [x, y] array or { x, y } object.");
}

function flattenMatrix(valuesMatrix: NumericArray | number[][]): Float64Array {
  if (isTypedArray(valuesMatrix)) {
    return Float64Array.from(valuesMatrix);
  }
  if (!Array.isArray(valuesMatrix) || valuesMatrix.length === 0) {
    throw new Error("valuesMatrix must be a non-empty 2D array or typed array.");
  }
  if (!Array.isArray(valuesMatrix[0])) {
    return Float64Array.from(valuesMatrix as number[]);
  }
  const rows = valuesMatrix.length;
  const cols = valuesMatrix[0].length;
  const values = new Float64Array(rows * cols);
  let offset = 0;
  for (const row of valuesMatrix) {
    if (!Array.isArray(row) || row.length !== cols) {
      throw new Error("valuesMatrix rows must all have the same length.");
    }
    for (const value of row) {
      values[offset++] = Number(value);
    }
  }
  return values;
}

function allocCString(module: NativeModule, value: unknown): number {
  const bytes = encoder.encode(`${value ?? ""}\0`);
  const ptr = module._malloc(bytes.length);
  module.HEAPU8.set(bytes, ptr);
  return ptr;
}

function freePtr(module: NativeModule, ptr: number): void {
  if (ptr) {
    module._free(ptr);
  }
}

function withCString<T>(module: NativeModule, value: unknown, fn: (ptr: number) => T): T {
  const ptr = allocCString(module, value);
  try {
    return fn(ptr);
  } finally {
    freePtr(module, ptr);
  }
}

function allocFloat64Array(module: NativeModule, values: NumericArray | number[][] | unknown): { array: Float64Array; ptr: number } {
  const array = toFloat64Array(values);
  const ptr = module._malloc(array.byteLength);
  module.HEAPF64.set(array, ptr >> 3);
  return { array, ptr };
}

function allocFloat32Array(module: NativeModule, values: Iterable<number> | Float32Array): { array: Float32Array; ptr: number } {
  const array = values instanceof Float32Array ? values : Float32Array.from(values);
  const ptr = module._malloc(array.byteLength);
  module.HEAPF32.set(array, ptr >> 2);
  return { array, ptr };
}

function allocOutputF64(module: NativeModule, count: number): number {
  const ptr = module._malloc(count * Float64Array.BYTES_PER_ELEMENT);
  return ptr;
}

function readOutputF64(module: NativeModule, ptr: number, count: number): number[] {
  return Array.from(module.HEAPF64.subarray(ptr >> 3, (ptr >> 3) + count));
}

function readCString(module: NativeModule, ptr: number): string | null {
  if (!ptr) {
    return null;
  }
  const heap = module.HEAPU8;
  let end = ptr;
  while (heap[end] !== 0) {
    end += 1;
  }
  return decoder.decode(heap.subarray(ptr, end));
}

function withStringArray<T>(module: NativeModule, values: string[], fn: (tablePtr: number) => T): T {
  const pointers: number[] = [];
  let tablePtr = 0;
  try {
    for (const value of values) {
      pointers.push(allocCString(module, value));
    }
    tablePtr = module._malloc(pointers.length * 4);
    for (let i = 0; i < pointers.length; i += 1) {
      module.HEAPU32[(tablePtr >> 2) + i] = pointers[i];
    }
    return fn(tablePtr);
  } finally {
    freePtr(module, tablePtr);
    for (const pointer of pointers) {
      freePtr(module, pointer);
    }
  }
}

function scaleForward(value: number, scale: number): number {
  switch (scale) {
    case ImPlotScale.Log10:
      return Math.log10(Math.max(value, Number.MIN_VALUE));
    case ImPlotScale.SymLog:
      return 2 * Math.asinh(value / 2);
    default:
      return value;
  }
}

function scaleInverse(value: number, scale: number): number {
  switch (scale) {
    case ImPlotScale.Log10:
      return 10 ** value;
    case ImPlotScale.SymLog:
      return 2 * Math.sinh(value / 2);
    default:
      return value;
  }
}

function normalizeSize(size: Vec2 | PlotPoint | undefined | null, fallback: Vec2 = [-1, 0]): Vec2 {
  return toVec2(size, fallback);
}

function normalizeBounds(bounds: Bounds | undefined | null, fallbackMin: Vec2 = [0, 0], fallbackMax: Vec2 = [1, 1]): { min: Vec2; max: Vec2 } {
  if (!bounds) {
    return { min: [...fallbackMin] as Vec2, max: [...fallbackMax] as Vec2 };
  }
  return {
    min: toVec2(bounds.min, fallbackMin),
    max: toVec2(bounds.max, fallbackMax),
  };
}

function createRootNode(): { type: "root"; children: PlotNode[] } {
  return { type: "root", children: [] };
}

export interface ImPlotChart {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  title: string;

  mount(): Promise<this>;
  start(): Promise<this>;
  stop(): this;
  destroy(): this;
  clear(): this;
  reset(): this;
  resize(width: number, height: number): this;
  requestRender(): this;
  render(): Promise<this>;

  beginPlot(title: string, size?: Vec2, flags?: number): this;
  endPlot(): this;
  beginLegendPopup(label: string, mouseButton?: number): this;
  endLegendPopup(): this;
  beginSubplots(title: string, rows: number, cols: number, size: Vec2, flags?: number): this;
  endSubplots(): this;

  setupAxis(axis: number, label?: string | null, flags?: number): this;
  setupAxisLimits(axis: number, min: number, max: number, cond?: number): this;
  setupAxisFormat(axis: number, format: string): this;
  setupAxisTicks(axis: number, values: NumericArray, count: number, labelsOrCount?: unknown, keepDefault?: boolean): this;
  setupAxisTicks(axis: number, min: number, max: number, count: number, keepDefault?: boolean): this;
  setupAxisScale(axis: number, scale: number): this;
  setupAxisLimitsConstraints(axis: number, min: number, max: number): this;
  setupAxisZoomConstraints(axis: number, min: number, max: number): this;
  setupAxisLinks(axis: number, min: number, max: number): this;
  setupAxes(xLabel: string | null, yLabel: string | null, xFlags?: number, yFlags?: number): this;
  setupAxesLimits(xMin: number, xMax: number, yMin: number, yMax: number, cond?: number): this;
  setupLegend(location: number, flags?: number): this;
  setupMouseText(location: number, flags?: number): this;
  setupFinish(): this;

  setNextAxisLimits(axis: number, min: number, max: number, cond?: number): this;
  setNextAxisToFit(axis: number): this;
  setNextAxisLinks(axis: number, min: number, max: number): this;
  setNextAxesLimits(xMin: number, xMax: number, yMin: number, yMax: number, cond?: number): this;
  setNextAxesToFit(): this;

  plotLine(label: string, values: NumericArray, flags?: number): this;
  plotLine(label: string, xs: NumericArray, ys: NumericArray, flags?: number): this;
  plotScatter(label: string, values: NumericArray, flags?: number): this;
  plotScatter(label: string, xs: NumericArray, ys: NumericArray, flags?: number): this;
  plotBubbles(label: string, values: NumericArray, szs: NumericArray, flags?: number): this;
  plotBubbles(label: string, xs: NumericArray, ys: NumericArray, szs: NumericArray, flags?: number): this;
  plotPolygon(label: string, xs: NumericArray, ys: NumericArray, flags?: number): this;
  plotStairs(label: string, values: NumericArray, flags?: number): this;
  plotStairs(label: string, xs: NumericArray, ys: NumericArray, flags?: number): this;
  plotShaded(label: string, values: NumericArray): this;
  plotShaded(label: string, xs: NumericArray, ys: NumericArray, yref?: number, flags?: number): this;
  plotShaded(label: string, xs: NumericArray, ys1: NumericArray, ys2: NumericArray, flags?: number): this;
  plotBars(label: string, values: NumericArray, barSize?: number, shift?: number, flags?: number): this;
  plotBars(label: string, xs: NumericArray, ys: NumericArray, barSize: number, flags?: number): this;
  plotBarGroups(labels: string[], valuesMatrix: NumericArray | number[][], groupSize?: number, shift?: number, flags?: number): this;
  plotErrorBars(label: string, xs: NumericArray, ys: NumericArray, err: NumericArray, flags?: number): this;
  plotErrorBars(label: string, xs: NumericArray, ys: NumericArray, neg: NumericArray, pos: NumericArray, flags?: number): this;
  plotStems(label: string, values: NumericArray, ref?: number, scale?: number, flags?: number): this;
  plotStems(label: string, xs: NumericArray, ys: NumericArray, ref?: number, flags?: number): this;
  plotInfLines(label: string, values: NumericArray, flags?: number): this;
  plotPieChart(labels: string[], values: NumericArray, x: number, y: number, radius: number, labelFormat?: string, angle0?: number, flags?: number): this;
  plotHeatmap(label: string, values: NumericArray, rows: number, cols: number, scaleMin?: number, scaleMax?: number, labelFormat?: string, bounds?: Bounds, flags?: number): this;
  plotHistogram(label: string, values: NumericArray, bins?: number, barScale?: number, range?: { min: number; max: number } | null, flags?: number): this;
  plotHistogram2D(label: string, xs: NumericArray, ys: NumericArray, xBins?: number, yBins?: number, range?: PlotRect | null, flags?: number): this;
  plotDigital(label: string, xs: NumericArray, ys: NumericArray, flags?: number): this;
  plotImage(label: string, textureId: number, bounds: Bounds, uv0?: Vec2, uv1?: Vec2, tintColor?: Color, flags?: number): this;
  plotText(text: string, x: number, y: number, pixelOffset?: Vec2, flags?: number): this;
  plotDummy(label: string, flags?: number): this;

  dragPoint(id: number, point: DragPointState, color?: Color, size?: number, flags?: number): this;
  dragLineX(id: number, state: ScalarState, color?: Color, thickness?: number, flags?: number): this;
  dragLineY(id: number, state: ScalarState, color?: Color, thickness?: number, flags?: number): this;
  dragRect(id: number, rect: DragRectState, color?: Color, flags?: number): this;
  annotation(x: number, y: number, text: string, color?: Color, pixelOffset?: Vec2, clamp?: boolean): this;
  tagX(x: number, text: string, color?: Color): this;
  tagY(y: number, text: string, color?: Color): this;

  setAxis(axis: number): this;
  setAxes(xAxis: number, yAxis: number): this;
  hideNextItem(hidden?: boolean, cond?: number): this;
  cancelPlotSelection(): this;

  pushStyleColor(idx: number, color: Color): this;
  popStyleColor(count?: number): this;
  pushStyleVar(idx: number, value: number | Vec2): this;
  popStyleVar(count?: number): this;
  setNextLineStyle(color?: Color, weight?: number): this;
  setNextFillStyle(color?: Color, alpha?: number): this;
  setNextMarkerStyle(marker?: number, size?: number, fill?: Color, weight?: number, outline?: Color): this;
  setNextErrorBarStyle(color?: Color, size?: number, weight?: number): this;
  getLastItemColor(): number[];

  addColormap(name: string, colors: Color[], qualitative?: boolean): number;
  getColormapCount(): number;
  getColormapName(cmap: number): string | null;
  getColormapIndex(name: string): number;
  getColormapSize(cmap?: number): number;
  getColormapColor(idx: number, cmap?: number): number[];
  nextColormapColor(): this;
  getNextColormapColor(): number[] | null;
  bustColorCache(title?: string | null): this;
  pushColormap(cmap: number | string): this;
  popColormap(count?: number): this;
  sampleColormap(t: number, cmap?: number): number[];
  colormapScale(label: string, min: number, max: number, size?: Vec2, format?: string, flags?: number, cmap?: number): this;
  colormapSlider(label: string, state: ColormapSliderState, format?: string, cmap?: number): this;
  colormapButton(label: string, size?: Vec2, cmap?: number): this;

  mapInputDefault(): this;
  mapInputReverse(): this;

  getPlotState(title?: string | null): CapturedPlotState | null;
  getPlotMousePos(title?: string | null): PlotPoint | null;
  getPlotLimits(title?: string | null): PlotRect | null;
  isPlotHovered(title?: string | null): boolean;
  isAxisHovered(axis: number, title?: string | null): boolean;
  isLegendEntryHovered(label: string): boolean;
  isSubplotsHovered(): boolean;
  isPlotSelected(title?: string | null): boolean;
  getPlotSelection(title?: string | null): PlotRect | null;
  pixelsToPlot(pixel: Vec2 | PlotPoint, title?: string | null, xAxis?: number, yAxis?: number): PlotPoint | null;
  plotToPixels(point: Vec2 | PlotPoint, title?: string | null, xAxis?: number, yAxis?: number): PlotPoint | null;
}

export class ImPlotChart {
  canvas!: HTMLCanvasElement;
  width!: number;
  height!: number;
  title!: string;
  flags!: number;
  theme!: number;
  locateFile!: (path: string, prefix?: string) => string;
  moduleOverrides!: Record<string, unknown>;
  autoStart!: boolean;
  module: NativeModule | null = null;
  modulePromise: Promise<NativeModule> | null = null;
  destroyed = false;
  running = false;
  renderScheduled = false;
  animationFrameId: number | null = null;
  pendingRuntimeActions: RuntimeAction[] = [];
  root: PlotNode = createRootNode();
  stack: PlotNode[] = [this.root];
  plotStates: Map<string, CapturedPlotState> = new Map();
  plotMetadata: Map<string, unknown> = new Map();
  lastPlotKey: string | null = null;
  plotIdCounter = 0;
  nextAxisLinksAllocations: number[] = [];
  lastSubplotsHovered = false;
  lastNextColormapColor: number[] | null = null;

  constructor(options: ImPlotChartOptions = {}) {
    this.canvas = options.canvas ?? document.createElement("canvas");
    this.width = options.width ?? this.canvas.width ?? 1280;
    this.height = options.height ?? this.canvas.height ?? 720;
    this.title = options.title ?? "implotjs";
    this.flags = options.flags ?? ImPlotFlags.None;
    this.theme = options.theme ?? ImPlotTheme.Dark;
    this.locateFile = options.locateFile ?? defaultLocateFile;
    this.moduleOverrides = options.moduleOverrides ?? {};
    this.autoStart = options.autoStart ?? false;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.root = createRootNode();
    this.stack = [this.root];

    if (this.autoStart) {
      void this.start();
    }
  }

  async mount(): Promise<this> {
    if (this.destroyed) {
      throw new Error("Cannot mount a destroyed chart.");
    }
    if (!this.modulePromise) {
      this.modulePromise = loadNativeModule({
        canvas: this.canvas,
        locateFile: this.locateFile,
        ...this.moduleOverrides,
      }).then((module: NativeModule) => {
        this.module = module;
        module._implotjs_style_colors(this.theme);
        module._implotjs_resize(this.width, this.height);
        for (const action of this.pendingRuntimeActions) {
          action(module);
        }
        this.pendingRuntimeActions = [];
        return module;
      });
    }
    await this.modulePromise;
    return this;
  }

  async start(): Promise<this> {
    await this.mount();
    if (this.destroyed || this.running) {
      return this;
    }
    this.running = true;
    await this.render();
    this.#scheduleNextFrame();
    return this;
  }

  stop(): this {
    this.running = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    return this;
  }

  destroy(): this {
    this.stop();
    if (this.module && !this.destroyed) {
      this.module._implotjs_shutdown();
    }
    this.destroyed = true;
    this.module = null;
    this.modulePromise = null;
    return this;
  }

  clear(): this {
    this.root = createRootNode();
    this.stack = [this.root];
    this.plotStates.clear();
    this.plotMetadata.clear();
    this.lastPlotKey = null;
    return this;
  }

  reset(): this {
    return this.clear();
  }

  resize(width: number, height: number): this {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    if (this.module) {
      this.module._implotjs_resize(width, height);
    }
    return this;
  }

  requestRender(): this {
    if (this.renderScheduled || this.destroyed) {
      return this;
    }
    this.renderScheduled = true;
    requestAnimationFrame(() => {
      this.renderScheduled = false;
      void this.render();
    });
    return this;
  }

  async render(): Promise<this> {
    await this.mount();
    if (this.destroyed || !this.module) {
      return this;
    }
    this.module._implotjs_resize(this.canvas.width, this.canvas.height);
    if (!this.module._implotjs_begin_frame(this.canvas.width, this.canvas.height)) {
      return this;
    }
    for (const node of this.root.children) {
      this.#renderNode(node);
    }
    for (const ptr of this.nextAxisLinksAllocations) {
      freePtr(this.module, ptr);
    }
    this.nextAxisLinksAllocations = [];
    this.module._implotjs_end_frame();
    return this;
  }

  #scheduleNextFrame(): void {
    if (!this.running || this.destroyed) {
      return;
    }
    this.animationFrameId = requestAnimationFrame(() => {
      void this.#runFrame();
    });
  }

  async #runFrame(): Promise<void> {
    if (!this.running || this.destroyed) {
      return;
    }
    await this.render();
    this.#scheduleNextFrame();
  }

  beginPlot(title: string, size: Vec2 | PlotPoint = [-1, 0], flags = ImPlotFlags.None): this {
    const node = {
      type: "plot",
      title,
      size: normalizeSize(size),
      flags,
      stateKey: title && title.length > 0 ? title : `__plot_${this.plotIdCounter++}`,
      children: [],
      axisScales: {
        [ImAxis.X1]: ImPlotScale.Linear,
        [ImAxis.X2]: ImPlotScale.Linear,
        [ImAxis.X3]: ImPlotScale.Linear,
        [ImAxis.Y1]: ImPlotScale.Linear,
        [ImAxis.Y2]: ImPlotScale.Linear,
        [ImAxis.Y3]: ImPlotScale.Linear,
      },
    };
    this.#addNode(node);
    this.stack.push(node);
    return this;
  }

  endPlot(): this {
    this.#popContainer("plot");
    return this;
  }

  beginLegendPopup(label: string, mouseButton = 1): this {
    const node = { type: "legendPopup", label, mouseButton, children: [] };
    this.#addNode(node);
    this.stack.push(node);
    return this;
  }

  endLegendPopup(): this {
    this.#popContainer("legendPopup");
    return this;
  }

  beginSubplots(title: string, rows: number, cols: number, size: Vec2 | PlotPoint, flags = ImPlotSubplotFlags.None): this {
    const node = {
      type: "subplots",
      title,
      rows,
      cols,
      size: normalizeSize(size, [800, 400]),
      flags,
      children: [],
    };
    this.#addNode(node);
    this.stack.push(node);
    return this;
  }

  endSubplots(): this {
    this.#popContainer("subplots");
    return this;
  }

  setupAxis(axis: number, label: string | null = null, flags = ImPlotAxisFlags.None): this {
    this.#addCommand({ type: "setupAxis", axis, label, flags });
    return this;
  }

  setupAxisLimits(axis: number, min: number, max: number, cond = ImPlotCond.Once): this {
    this.#addCommand({ type: "setupAxisLimits", axis, min, max, cond });
    return this;
  }

  setupAxisFormat(axis: number, format: string): this {
    this.#addCommand({ type: "setupAxisFormat", axis, format });
    return this;
  }

  setupAxisTicks(axis: number, valuesOrMin: NumericArray | number, countOrMax: number, labelsOrCount?: unknown, keepDefault = false): this {
    if (Array.isArray(valuesOrMin) || isTypedArray(valuesOrMin)) {
      const labels = Array.isArray(labelsOrCount) && labelsOrCount.every((l) => typeof l === "string") ? (labelsOrCount as string[]) : undefined;
      this.#addCommand({
        type: "setupAxisTicksValues",
        axis,
        values: toFloat64Array(valuesOrMin),
        count: countOrMax,
        labels,
        keepDefault,
      });
    } else {
      this.#addCommand({
        type: "setupAxisTicksRange",
        axis,
        min: valuesOrMin,
        max: countOrMax,
        count: labelsOrCount,
        keepDefault,
      });
    }
    return this;
  }

  setupAxisScale(axis: number, scale: number): this {
    this.#addCommand({ type: "setupAxisScale", axis, scale });
    const plot = this.#currentPlotNode();
    if (plot) {
      plot.axisScales[axis] = scale;
    }
    return this;
  }

  setupAxisLimitsConstraints(axis: number, min: number, max: number): this {
    this.#addCommand({ type: "setupAxisLimitsConstraints", axis, min, max });
    return this;
  }

  setupAxisZoomConstraints(axis: number, min: number, max: number): this {
    this.#addCommand({ type: "setupAxisZoomConstraints", axis, min, max });
    return this;
  }

  setupAxisLinks(axis: number, min: number, max: number): this {
    this.#addCommand({ type: "setupAxisLinks", axis, min, max });
    return this;
  }

  setupAxes(xLabel: string | null, yLabel: string | null, xFlags = ImPlotAxisFlags.None, yFlags = ImPlotAxisFlags.None): this {
    this.#addCommand({ type: "setupAxes", xLabel, yLabel, xFlags, yFlags });
    return this;
  }

  setupAxesLimits(xMin: number, xMax: number, yMin: number, yMax: number, cond = ImPlotCond.Once): this {
    this.#addCommand({ type: "setupAxesLimits", xMin, xMax, yMin, yMax, cond });
    return this;
  }

  setupLegend(location: number, flags = ImPlotLegendFlags.None): this {
    this.#addCommand({ type: "setupLegend", location, flags });
    return this;
  }

  setupMouseText(location: number, flags = ImPlotMouseTextFlags.None): this {
    this.#addCommand({ type: "setupMouseText", location, flags });
    return this;
  }

  setupFinish(): this {
    this.#addCommand({ type: "setupFinish" });
    return this;
  }

  setNextAxisLimits(axis: number, min: number, max: number, cond = ImPlotCond.Once): this {
    this.#addNode({ type: "setNextAxisLimits", axis, min, max, cond });
    return this;
  }

  setNextAxisToFit(axis: number): this {
    this.#addNode({ type: "setNextAxisToFit", axis });
    return this;
  }

  setNextAxisLinks(axis: number, min: number, max: number): this {
    this.#addNode({ type: "setNextAxisLinks", axis, min, max });
    return this;
  }

  setNextAxesLimits(xMin: number, xMax: number, yMin: number, yMax: number, cond = ImPlotCond.Once): this {
    this.#addNode({ type: "setNextAxesLimits", xMin, xMax, yMin, yMax, cond });
    return this;
  }

  setNextAxesToFit(): this {
    this.#addNode({ type: "setNextAxesToFit" });
    return this;
  }

  plotLine(label: string, valuesOrXs: NumericArray, ysOrFlags?: NumericArray | number, maybeFlags?: number): this {
    this.#queueSeriesNode("plotLine", label, valuesOrXs, ysOrFlags, maybeFlags);
    return this;
  }

  plotScatter(label: string, valuesOrXs: NumericArray, ysOrFlags?: NumericArray | number, maybeFlags?: number): this {
    this.#queueSeriesNode("plotScatter", label, valuesOrXs, ysOrFlags, maybeFlags);
    return this;
  }

  plotBubbles(label: string, valuesOrXs: NumericArray, szsOrYs: NumericArray, flagsOrSzs?: NumericArray | number, maybeFlags?: number): this {
    if (Array.isArray(flagsOrSzs) || isTypedArray(flagsOrSzs)) {
      this.#addCommand({
        type: "plotBubblesXY",
        label,
        xs: toFloat64Array(valuesOrXs, "xs"),
        ys: toFloat64Array(szsOrYs, "ys"),
        szs: toFloat64Array(flagsOrSzs, "szs"),
        flags: maybeFlags ?? ImPlotBubblesFlags.None,
      });
    } else {
      this.#addCommand({
        type: "plotBubblesY",
        label,
        values: toFloat64Array(valuesOrXs, "values"),
        szs: toFloat64Array(szsOrYs, "szs"),
        xscale: 1,
        xstart: 0,
        flags: flagsOrSzs ?? ImPlotBubblesFlags.None,
      });
    }
    return this;
  }

  plotPolygon(label: string, xs: NumericArray, ys: NumericArray, flags = ImPlotPolygonFlags.None): this {
    this.#addCommand({
      type: "plotPolygon",
      label,
      xs: toFloat64Array(xs, "xs"),
      ys: toFloat64Array(ys, "ys"),
      flags,
    });
    return this;
  }

  plotStairs(label: string, valuesOrXs: NumericArray, ysOrFlags?: NumericArray | number, maybeFlags?: number): this {
    this.#queueSeriesNode("plotStairs", label, valuesOrXs, ysOrFlags, maybeFlags);
    return this;
  }

  plotShaded(label: string, valuesOrXs: NumericArray, ysOrY1?: NumericArray | number, y2OrYref?: NumericArray | number, maybeFlags?: number): this {
    const dataA = toFloat64Array(valuesOrXs, "values");
    if (ysOrY1 == null) {
      this.#addCommand({ type: "plotShadedY", label, ys: dataA, yref: 0, xscale: 1, xstart: 0, flags: ImPlotShadedFlags.None });
      return this;
    }
    if ((Array.isArray(ysOrY1) || isTypedArray(ysOrY1)) && (Array.isArray(y2OrYref) || isTypedArray(y2OrYref))) {
      this.#addCommand({
        type: "plotShadedXY2",
        label,
        xs: dataA,
        ys1: toFloat64Array(ysOrY1, "ys1"),
        ys2: toFloat64Array(y2OrYref, "ys2"),
        flags: maybeFlags ?? ImPlotShadedFlags.None,
      });
      return this;
    }
    this.#addCommand({
      type: "plotShadedXY",
      label,
      xs: dataA,
      ys: toFloat64Array(ysOrY1, "ys"),
      yref: typeof y2OrYref === "number" ? y2OrYref : 0,
      flags: typeof y2OrYref === "number" ? maybeFlags ?? ImPlotShadedFlags.None : y2OrYref ?? ImPlotShadedFlags.None,
    });
    return this;
  }

  plotBars(label: string, valuesOrXs: NumericArray, ysOrBarSize?: NumericArray | number, barSizeOrFlags?: number, maybeFlags?: number): this {
    if (Array.isArray(ysOrBarSize) || isTypedArray(ysOrBarSize)) {
      this.#addCommand({
        type: "plotBarsXY",
        label,
        xs: toFloat64Array(valuesOrXs, "xs"),
        ys: toFloat64Array(ysOrBarSize, "ys"),
        barSize: Number(barSizeOrFlags),
        flags: maybeFlags ?? ImPlotBarsFlags.None,
      });
    } else {
      this.#addCommand({
        type: "plotBarsY",
        label,
        ys: toFloat64Array(valuesOrXs, "values"),
        barSize: ysOrBarSize ?? 0.67,
        shift: barSizeOrFlags ?? 0,
        flags: maybeFlags ?? ImPlotBarsFlags.None,
      });
    }
    return this;
  }

  plotBarGroups(labels: string[], valuesMatrix: NumericArray | number[][], groupSize = 0.67, shift = 0, flags = ImPlotBarGroupsFlags.None): this {
    const flatValues = flattenMatrix(valuesMatrix);
    const itemCount = labels.length;
    const groupCount = flatValues.length / itemCount;
    this.#addCommand({ type: "plotBarGroups", labels, values: flatValues, itemCount, groupCount, groupSize, shift, flags });
    return this;
  }

  plotErrorBars(label: string, xs: NumericArray, ys: NumericArray, errOrNeg: NumericArray, posOrFlags?: NumericArray | number, maybeFlags?: number): this {
    if (Array.isArray(posOrFlags) || isTypedArray(posOrFlags)) {
      this.#addCommand({
        type: "plotErrorBars2",
        label,
        xs: toFloat64Array(xs, "xs"),
        ys: toFloat64Array(ys, "ys"),
        neg: toFloat64Array(errOrNeg, "neg"),
        pos: toFloat64Array(posOrFlags, "pos"),
        flags: maybeFlags ?? ImPlotErrorBarsFlags.None,
      });
    } else {
      this.#addCommand({
        type: "plotErrorBars",
        label,
        xs: toFloat64Array(xs, "xs"),
        ys: toFloat64Array(ys, "ys"),
        err: toFloat64Array(errOrNeg, "err"),
        flags: posOrFlags ?? ImPlotErrorBarsFlags.None,
      });
    }
    return this;
  }

  plotStems(label: string, valuesOrXs: NumericArray, ysOrRef?: NumericArray | number, refOrFlags?: number, maybeFlags?: number): this {
    if (Array.isArray(ysOrRef) || isTypedArray(ysOrRef)) {
      this.#addCommand({
        type: "plotStemsXY",
        label,
        xs: toFloat64Array(valuesOrXs, "xs"),
        ys: toFloat64Array(ysOrRef, "ys"),
        ref: refOrFlags ?? 0,
        flags: maybeFlags ?? ImPlotStemsFlags.None,
      });
    } else {
      this.#addCommand({
        type: "plotStemsY",
        label,
        ys: toFloat64Array(valuesOrXs, "values"),
        ref: ysOrRef ?? 0,
        scale: refOrFlags ?? 1,
        start: 0,
        flags: maybeFlags ?? ImPlotStemsFlags.None,
      });
    }
    return this;
  }

  plotInfLines(label: string, values: NumericArray, flags = ImPlotInfLinesFlags.None): this {
    this.#addCommand({ type: "plotInfLines", label, values: toFloat64Array(values), flags });
    return this;
  }

  plotPieChart(labels: string[], values: NumericArray, x: number, y: number, radius: number, labelFormat = "%.1f", angle0 = 90, flags = ImPlotPieChartFlags.None): this {
    this.#addCommand({
      type: "plotPieChart",
      labels,
      values: toFloat64Array(values),
      x,
      y,
      radius,
      labelFormat,
      angle0,
      flags,
    });
    return this;
  }

  plotHeatmap(label: string, values: NumericArray, rows: number, cols: number, scaleMin = 0, scaleMax = 0, labelFormat = "%.1f", bounds?: Bounds, flags = ImPlotHeatmapFlags.None): this {
    this.#addCommand({
      type: "plotHeatmap",
      label,
      values: toFloat64Array(values),
      rows,
      cols,
      scaleMin,
      scaleMax,
      labelFormat,
      bounds: normalizeBounds(bounds),
      flags,
    });
    return this;
  }

  plotHistogram(label: string, values: NumericArray, bins = ImPlotBin.Sturges, barScale = 1, range: { min: number; max: number } | null = null, flags = ImPlotHistogramFlags.None): this {
    this.#addCommand({
      type: "plotHistogram",
      label,
      values: toFloat64Array(values),
      bins,
      barScale,
      range,
      flags,
    });
    return this;
  }

  plotHistogram2D(label: string, xs: NumericArray, ys: NumericArray, xBins = ImPlotBin.Sturges, yBins = ImPlotBin.Sturges, range: PlotRect | null = null, flags = ImPlotHistogramFlags.None): this {
    this.#addCommand({
      type: "plotHistogram2D",
      label,
      xs: toFloat64Array(xs),
      ys: toFloat64Array(ys),
      xBins,
      yBins,
      range,
      flags,
    });
    return this;
  }

  plotDigital(label: string, xs: NumericArray, ys: NumericArray, flags = ImPlotDigitalFlags.None): this {
    this.#addCommand({ type: "plotDigital", label, xs: toFloat64Array(xs), ys: toFloat64Array(ys), flags });
    return this;
  }

  plotImage(label: string, textureId: number, bounds: Bounds, uv0: Vec2 | PlotPoint = [0, 0], uv1: Vec2 | PlotPoint = [1, 1], tintColor: Color | number[] = [1, 1, 1, 1], flags = ImPlotImageFlags.None): this {
    this.#addCommand({
      type: "plotImage",
      label,
      textureId,
      bounds: normalizeBounds(bounds),
      uv0: toVec2(uv0),
      uv1: toVec2(uv1),
      tintColor: toColor(tintColor),
      flags,
    });
    return this;
  }

  plotText(text: string, x: number, y: number, pixelOffset: Vec2 | PlotPoint = [0, 0], flags = ImPlotTextFlags.None): this {
    this.#addCommand({ type: "plotText", text, x, y, pixelOffset: toVec2(pixelOffset), flags });
    return this;
  }

  plotDummy(label: string, flags = ImPlotDummyFlags.None): this {
    this.#addCommand({ type: "plotDummy", label, flags });
    return this;
  }

  dragPoint(id: number, point: DragPointState, color: Color | number[] = [1, 1, 1, 1], size = 4, flags = ImPlotDragToolFlags.None): this {
    this.#addCommand({ type: "dragPoint", id, point, color: toColor(color), size, flags, state: { changed: false, clicked: false, hovered: false, held: false } });
    return this;
  }

  dragLineX(id: number, state: ScalarState, color: Color | number[] = [1, 1, 1, 1], thickness = 1, flags = ImPlotDragToolFlags.None): this {
    this.#addCommand({ type: "dragLineX", id, state, color: toColor(color), thickness, flags, result: { changed: false, clicked: false, hovered: false, held: false } });
    return this;
  }

  dragLineY(id: number, state: ScalarState, color: Color | number[] = [1, 1, 1, 1], thickness = 1, flags = ImPlotDragToolFlags.None): this {
    this.#addCommand({ type: "dragLineY", id, state, color: toColor(color), thickness, flags, result: { changed: false, clicked: false, hovered: false, held: false } });
    return this;
  }

  dragRect(id: number, rect: DragRectState, color: Color | number[] = [1, 1, 1, 1], flags = ImPlotDragToolFlags.None): this {
    this.#addCommand({ type: "dragRect", id, rect, color: toColor(color), flags, result: { changed: false, clicked: false, hovered: false, held: false } });
    return this;
  }

  annotation(x: number, y: number, text: string, color: Color | number[] = [1, 1, 1, 1], pixelOffset: Vec2 | PlotPoint = [0, 0], clamp = true): this {
    this.#addCommand({ type: "annotation", x, y, text, color: toColor(color), pixelOffset: toVec2(pixelOffset), clamp });
    return this;
  }

  tagX(x: number, text: string, color: Color | number[] = [1, 1, 1, 1]): this {
    this.#addCommand({ type: "tagX", x, text, color: toColor(color) });
    return this;
  }

  tagY(y: number, text: string, color: Color | number[] = [1, 1, 1, 1]): this {
    this.#addCommand({ type: "tagY", y, text, color: toColor(color) });
    return this;
  }

  setAxis(axis: number): this {
    this.#addCommand({ type: "setAxis", axis });
    return this;
  }

  setAxes(xAxis: number, yAxis: number): this {
    this.#addCommand({ type: "setAxes", xAxis, yAxis });
    return this;
  }

  hideNextItem(hidden = true, cond = ImPlotCond.Once): this {
    this.#addCommand({ type: "hideNextItem", hidden, cond });
    return this;
  }

  cancelPlotSelection(): this {
    this.#addCommand({ type: "cancelPlotSelection" });
    return this;
  }

  pushStyleColor(idx: number, color: Color): this {
    this.#addCommand({ type: "pushStyleColor", idx, color: toColor(color) });
    return this;
  }

  popStyleColor(count = 1): this {
    this.#addCommand({ type: "popStyleColor", count });
    return this;
  }

  pushStyleVar(idx: number, value: number | Vec2): this {
    this.#addCommand({ type: "pushStyleVar", idx, value });
    return this;
  }

  popStyleVar(count = 1): this {
    this.#addCommand({ type: "popStyleVar", count });
    return this;
  }

  setNextLineStyle(color: Color | number[] = [0, 0, 0, -1], weight = -1): this {
    this.#addCommand({ type: "setNextLineStyle", color: toColor(color), weight });
    return this;
  }

  setNextFillStyle(color: Color | number[] = [0, 0, 0, -1], alpha = -1): this {
    this.#addCommand({ type: "setNextFillStyle", color: toColor(color), alpha });
    return this;
  }

  setNextMarkerStyle(marker = ImPlotMarker.None, size = -1, fill: Color | number[] = [0, 0, 0, -1], weight = -1, outline: Color | number[] = [0, 0, 0, -1]): this {
    this.#addCommand({ type: "setNextMarkerStyle", marker, size, fill: toColor(fill), weight, outline: toColor(outline) });
    return this;
  }

  setNextErrorBarStyle(color: Color | number[] = [0, 0, 0, -1], size = -1, weight = -1): this {
    this.#addCommand({ type: "setNextErrorBarStyle", color: toColor(color), size, weight });
    return this;
  }

  getLastItemColor(): number[] {
    this.#ensureMountedSync();
    const out = allocOutputF64(this.module, 4);
    try {
      this.module._implotjs_get_last_item_color(out);
      return readOutputF64(this.module, out, 4);
    } finally {
      freePtr(this.module, out);
    }
  }

  isLegendEntryHovered(label: string): boolean {
    this.#ensureMountedSync();
    return withCString(this.module, label, (labelPtr) => !!this.module._implotjs_is_legend_entry_hovered(labelPtr));
  }

  isSubplotsHovered(): boolean {
    return this.lastSubplotsHovered;
  }

  addColormap(name: string, colors: Color[], qualitative = true): number {
    const action = (module: NativeModule): number => {
      const rgba: number[] = [];
      for (const color of colors) {
        rgba.push(...toColor(color));
      }
      const { ptr } = allocFloat32Array(module, rgba);
      try {
        return withCString(module, name, (namePtr) => module._implotjs_add_colormap_rgba(namePtr, ptr, colors.length, qualitative ? 1 : 0));
      } finally {
        freePtr(module, ptr);
      }
    };
    if (this.module) {
      return action(this.module);
    }
    this.pendingRuntimeActions.push(action);
    return -1;
  }

  getColormapCount(): number {
    this.#ensureMountedSync();
    return this.module._implotjs_get_colormap_count();
  }

  getColormapName(cmap: number): string | null {
    this.#ensureMountedSync();
    const ptr = this.module._implotjs_get_colormap_name(cmap);
    return readCString(this.module, ptr);
  }

  getColormapIndex(name: string): number {
    this.#ensureMountedSync();
    return withCString(this.module, name, (namePtr) => this.module._implotjs_get_colormap_index(namePtr));
  }

  getColormapSize(cmap = -1): number {
    this.#ensureMountedSync();
    return this.module._implotjs_get_colormap_size(cmap);
  }

  getColormapColor(idx: number, cmap = -1): number[] {
    this.#ensureMountedSync();
    const out = allocOutputF64(this.module, 4);
    try {
      this.module._implotjs_get_colormap_color(idx, cmap, out);
      return readOutputF64(this.module, out, 4);
    } finally {
      freePtr(this.module, out);
    }
  }

  nextColormapColor(): this {
    this.#addCommand({ type: "nextColormapColor" });
    return this;
  }

  getNextColormapColor(): number[] | null {
    return this.lastNextColormapColor;
  }

  bustColorCache(title: string | null = null): this {
    const action: RuntimeAction = (module) => {
      withCString(module, title, (titlePtr) => module._implotjs_bust_color_cache(titlePtr));
    };
    if (this.module) {
      action(this.module);
    } else {
      this.pendingRuntimeActions.push(action);
    }
    return this;
  }

  pushColormap(cmap: number | string): this {
    this.#addCommand({ type: "pushColormap", cmap });
    return this;
  }

  popColormap(count = 1): this {
    this.#addCommand({ type: "popColormap", count });
    return this;
  }

  sampleColormap(t: number, cmap = -1): number[] {
    this.#ensureMountedSync();
    const out = allocOutputF64(this.module, 4);
    try {
      this.module._implotjs_sample_colormap(t, cmap, out);
      return readOutputF64(this.module, out, 4);
    } finally {
      freePtr(this.module, out);
    }
  }

  colormapScale(label: string, min: number, max: number, size: Vec2 | PlotPoint = [0, 0], format = "%g", flags = ImPlotColormapScaleFlags.None, cmap = -1): this {
    this.#addCommand({ type: "colormapScale", label, min, max, size: toVec2(size), format, flags, cmap });
    return this;
  }

  colormapSlider(label: string, state: ColormapSliderState, format = "", cmap = -1): this {
    this.#addCommand({ type: "colormapSlider", label, state, format, cmap });
    return this;
  }

  colormapButton(label: string, size: Vec2 | PlotPoint = [0, 0], cmap = -1): this {
    this.#addCommand({ type: "colormapButton", label, size: toVec2(size), cmap, state: { clicked: false } });
    return this;
  }

  mapInputDefault(): this {
    const action: RuntimeAction = (module) => module._implotjs_map_input_default();
    if (this.module) {
      action(this.module);
    } else {
      this.pendingRuntimeActions.push(action);
    }
    return this;
  }

  mapInputReverse(): this {
    const action: RuntimeAction = (module) => module._implotjs_map_input_reverse();
    if (this.module) {
      action(this.module);
    } else {
      this.pendingRuntimeActions.push(action);
    }
    return this;
  }

  getPlotState(title: string | null = null): CapturedPlotState | null {
    const key = title ?? this.lastPlotKey;
    return key ? this.plotStates.get(key) ?? null : null;
  }

  getPlotMousePos(title: string | null = null): PlotPoint | null {
    return this.getPlotState(title)?.mousePos ?? null;
  }

  getPlotLimits(title: string | null = null): PlotRect | null {
    return this.getPlotState(title)?.limits ?? null;
  }

  isPlotHovered(title: string | null = null): boolean {
    return this.getPlotState(title)?.hovered ?? false;
  }

  isAxisHovered(axis: number, title: string | null = null): boolean {
    return this.getPlotState(title)?.axisHovered?.[axis] ?? false;
  }

  isPlotSelected(title: string | null = null): boolean {
    return this.getPlotState(title)?.selected ?? false;
  }

  getPlotSelection(title: string | null = null): PlotRect | null {
    return this.getPlotState(title)?.selection ?? null;
  }

  pixelsToPlot(pixel: Vec2 | PlotPoint, title: string | null = null, xAxis = ImAxis.X1, yAxis = ImAxis.Y1): PlotPoint | null {
    const state = this.getPlotState(title);
    if (!state) {
      return null;
    }
    const [px, py] = toVec2(pixel);
    const scaleX = state.axisScales[xAxis] ?? ImPlotScale.Linear;
    const scaleY = state.axisScales[yAxis] ?? ImPlotScale.Linear;
    const sxMin = scaleForward(state.limits.xMin, scaleX);
    const sxMax = scaleForward(state.limits.xMax, scaleX);
    const syMin = scaleForward(state.limits.yMin, scaleY);
    const syMax = scaleForward(state.limits.yMax, scaleY);
    const tx = (px - state.pos[0]) / state.size[0];
    const ty = 1 - (py - state.pos[1]) / state.size[1];
    return {
      x: scaleInverse(sxMin + tx * (sxMax - sxMin), scaleX),
      y: scaleInverse(syMin + ty * (syMax - syMin), scaleY),
    };
  }

  plotToPixels(point: Vec2 | PlotPoint, title: string | null = null, xAxis = ImAxis.X1, yAxis = ImAxis.Y1): PlotPoint | null {
    const state = this.getPlotState(title);
    if (!state) {
      return null;
    }
    const [x, y] = toVec2(point);
    const scaleX = state.axisScales[xAxis] ?? ImPlotScale.Linear;
    const scaleY = state.axisScales[yAxis] ?? ImPlotScale.Linear;
    const sxMin = scaleForward(state.limits.xMin, scaleX);
    const sxMax = scaleForward(state.limits.xMax, scaleX);
    const syMin = scaleForward(state.limits.yMin, scaleY);
    const syMax = scaleForward(state.limits.yMax, scaleY);
    const sx = scaleForward(x, scaleX);
    const sy = scaleForward(y, scaleY);
    return {
      x: state.pos[0] + ((sx - sxMin) / (sxMax - sxMin)) * state.size[0],
      y: state.pos[1] + (1 - (sy - syMin) / (syMax - syMin)) * state.size[1],
    };
  }

  #currentContainer(): PlotNode {
    return this.stack[this.stack.length - 1];
  }

  #currentPlotNode(): PlotNode | null {
    for (let index = this.stack.length - 1; index >= 0; index -= 1) {
      if (this.stack[index].type === "plot") {
        return this.stack[index];
      }
    }
    return null;
  }

  #addNode(node: PlotNode): void {
    const container = this.#currentContainer();
    if (!container.children) {
      throw new Error(`Cannot add node to container of type ${container.type}.`);
    }
    container.children.push(node);
  }

  #addCommand(command: PlotNode): void {
    this.#addNode(command);
  }

  #popContainer(expectedType: string): void {
    const current = this.#currentContainer();
    if (!current || current.type !== expectedType) {
      throw new Error(`Cannot end ${expectedType} because it is not the active container.`);
    }
    this.stack.pop();
  }

  #queueSeriesNode(type: string, label: string, valuesOrXs: NumericArray, ysOrFlags?: NumericArray | number, maybeFlags?: number): void {
    if (Array.isArray(ysOrFlags) || isTypedArray(ysOrFlags)) {
      this.#addCommand({
        type: `${type}XY`,
        label,
        xs: toFloat64Array(valuesOrXs, "xs"),
        ys: toFloat64Array(ysOrFlags, "ys"),
        flags: maybeFlags ?? 0,
      });
    } else {
      this.#addCommand({
        type: `${type}Y`,
        label,
        ys: toFloat64Array(valuesOrXs, "values"),
        xscale: 1,
        xstart: 0,
        flags: ysOrFlags ?? 0,
      });
    }
  }

  #ensureMountedSync(): asserts this is this & { module: NativeModule } {
    if (!this.module) {
      throw new Error("The chart must be mounted before calling this method.");
    }
  }

  #renderNode(node: PlotNode): void {
    switch (node.type) {
      case "plot":
        withCString(this.module, node.title, (titlePtr) => {
          const active = this.module._implotjs_begin_plot(titlePtr, node.size[0], node.size[1], node.flags);
          if (active) {
            for (const child of node.children) {
              this.#executeCommand(child, node);
            }
            this.#capturePlotState(node);
            this.module._implotjs_end_plot();
            for (const ptr of this.nextAxisLinksAllocations) {
              freePtr(this.module, ptr);
            }
            this.nextAxisLinksAllocations = [];
            for (const ptr of node.tempAllocations ?? []) {
              freePtr(this.module, ptr);
            }
            node.tempAllocations = [];
          }
        });
        break;
      case "legendPopup":
        withCString(this.module, node.label, (labelPtr) => {
          const active = this.module._implotjs_begin_legend_popup(labelPtr, node.mouseButton);
          if (active) {
            for (const child of node.children) {
              this.#renderNode(child);
            }
            this.module._implotjs_end_legend_popup();
          }
        });
        break;
      case "subplots":
        withCString(this.module, node.title, (titlePtr) => {
          const active = this.module._implotjs_begin_subplots(titlePtr, node.rows, node.cols, node.size[0], node.size[1], node.flags);
          if (active) {
            for (const child of node.children) {
              this.#renderNode(child);
            }
            this.lastSubplotsHovered = !!this.module._implotjs_is_subplots_hovered();
            this.module._implotjs_end_subplots();
          }
        });
        break;
      default:
        this.#executeCommand(node, null);
        break;
    }
  }

  #capturePlotState(plotNode: PlotNode): void {
    const posPtr = allocOutputF64(this.module, 2);
    const sizePtr = allocOutputF64(this.module, 2);
    const mousePtr = allocOutputF64(this.module, 2);
    const limitsPtr = allocOutputF64(this.module, 4);
    const selectionPtr = allocOutputF64(this.module, 4);
    try {
      this.module._implotjs_get_plot_pos(posPtr);
      this.module._implotjs_get_plot_size(sizePtr);
      this.module._implotjs_get_plot_mouse_pos(mousePtr, ImAxis.X1, ImAxis.Y1);
      this.module._implotjs_get_plot_limits(limitsPtr, ImAxis.X1, ImAxis.Y1);
      this.module._implotjs_get_plot_selection(selectionPtr, ImAxis.X1, ImAxis.Y1);
      const axisHovered: Record<number, boolean> = {};
      for (const axis of [ImAxis.X1, ImAxis.X2, ImAxis.X3, ImAxis.Y1, ImAxis.Y2, ImAxis.Y3]) {
        axisHovered[axis] = !!this.module._implotjs_is_axis_hovered(axis);
      }
      const limits = readOutputF64(this.module, limitsPtr, 4);
      const selection = readOutputF64(this.module, selectionPtr, 4);
      this.plotStates.set(plotNode.stateKey, {
        title: plotNode.title,
        pos: readOutputF64(this.module, posPtr, 2),
        size: readOutputF64(this.module, sizePtr, 2),
        mousePos: { x: readOutputF64(this.module, mousePtr, 2)[0], y: readOutputF64(this.module, mousePtr, 2)[1] },
        limits: { xMin: limits[0], xMax: limits[1], yMin: limits[2], yMax: limits[3] },
        hovered: !!this.module._implotjs_is_plot_hovered(),
        selected: !!this.module._implotjs_is_plot_selected(),
        selection: { xMin: selection[0], xMax: selection[1], yMin: selection[2], yMax: selection[3] },
        axisHovered,
        axisScales: { ...plotNode.axisScales },
      });
      this.lastPlotKey = plotNode.stateKey;
    } finally {
      freePtr(this.module, posPtr);
      freePtr(this.module, sizePtr);
      freePtr(this.module, mousePtr);
      freePtr(this.module, limitsPtr);
      freePtr(this.module, selectionPtr);
    }
  }

  #executeCommand(node: PlotNode, currentPlot: PlotNode | null): void {
    switch (node.type) {
      case "setupAxis":
        withCString(this.module, node.label, (labelPtr) => this.module._implotjs_setup_axis(node.axis, labelPtr, node.flags));
        break;
      case "setupAxisLimits":
        this.module._implotjs_setup_axis_limits(node.axis, node.min, node.max, node.cond);
        break;
      case "setupAxisFormat":
        withCString(this.module, node.format, (ptr) => this.module._implotjs_setup_axis_format(node.axis, ptr));
        break;
      case "setupAxisTicksValues": {
        const { ptr } = allocFloat64Array(this.module, node.values);
        try {
          if (node.labels && node.labels.length > 0) {
            withStringArray(this.module, node.labels, (labelsPtr) => {
              this.module._implotjs_setup_axis_ticks_values(node.axis, ptr, node.count, labelsPtr, node.labels.length, node.keepDefault ? 1 : 0);
            });
          } else {
            this.module._implotjs_setup_axis_ticks_values(node.axis, ptr, node.count, 0, 0, node.keepDefault ? 1 : 0);
          }
        } finally {
          freePtr(this.module, ptr);
        }
        break;
      }
      case "setupAxisTicksRange":
        this.module._implotjs_setup_axis_ticks_range(node.axis, node.min, node.max, node.count, node.keepDefault ? 1 : 0);
        break;
      case "setupAxisScale":
        this.module._implotjs_setup_axis_scale(node.axis, node.scale);
        break;
      case "setupAxisLinks": {
        const ptr = allocOutputF64(this.module, 2);
        this.module.HEAPF64[ptr >> 3] = node.min;
        this.module.HEAPF64[(ptr >> 3) + 1] = node.max;
        this.module._implotjs_setup_axis_links(node.axis, ptr, ptr + 8);
        if (currentPlot) {
          if (!currentPlot.tempAllocations) currentPlot.tempAllocations = [];
          currentPlot.tempAllocations.push(ptr);
        } else {
          freePtr(this.module, ptr);
        }
        break;
      }
      case "setupAxisLimitsConstraints":
        this.module._implotjs_setup_axis_limits_constraints(node.axis, node.min, node.max);
        break;
      case "setupAxisZoomConstraints":
        this.module._implotjs_setup_axis_zoom_constraints(node.axis, node.min, node.max);
        break;
      case "setupAxes":
        withCString(this.module, node.xLabel, (xLabelPtr) => {
          withCString(this.module, node.yLabel, (yLabelPtr) => this.module._implotjs_setup_axes(xLabelPtr, yLabelPtr, node.xFlags, node.yFlags));
        });
        break;
      case "setupAxesLimits":
        this.module._implotjs_setup_axes_limits(node.xMin, node.xMax, node.yMin, node.yMax, node.cond);
        break;
      case "setupLegend":
        this.module._implotjs_setup_legend(node.location, node.flags);
        break;
      case "setupMouseText":
        this.module._implotjs_setup_mouse_text(node.location, node.flags);
        break;
      case "setupFinish":
        this.module._implotjs_setup_finish();
        break;
      case "setNextAxisLimits":
        this.module._implotjs_set_next_axis_limits(node.axis, node.min, node.max, node.cond);
        break;
      case "setNextAxisToFit":
        this.module._implotjs_set_next_axis_to_fit(node.axis);
        break;
      case "setNextAxisLinks": {
        const ptr = allocOutputF64(this.module, 2);
        this.module.HEAPF64[ptr >> 3] = node.min;
        this.module.HEAPF64[(ptr >> 3) + 1] = node.max;
        this.module._implotjs_set_next_axis_links(node.axis, ptr, ptr + 8);
        this.nextAxisLinksAllocations.push(ptr);
        break;
      }
      case "setNextAxesLimits":
        this.module._implotjs_set_next_axes_limits(node.xMin, node.xMax, node.yMin, node.yMax, node.cond);
        break;
      case "setNextAxesToFit":
        this.module._implotjs_set_next_axes_to_fit();
        break;
      case "plotLineY":
      case "plotScatterY":
      case "plotStairsY":
      case "plotBarsY":
      case "plotStemsY": {
        const { ptr } = allocFloat64Array(this.module, node.ys);
        try {
          withCString(this.module, node.label, (labelPtr) => {
            if (node.type === "plotLineY") this.module._implotjs_plot_line_y(labelPtr, ptr, node.ys.length, node.xscale, node.xstart, node.flags);
            else if (node.type === "plotScatterY") this.module._implotjs_plot_scatter_y(labelPtr, ptr, node.ys.length, node.xscale, node.xstart, node.flags);
            else if (node.type === "plotStairsY") this.module._implotjs_plot_stairs_y(labelPtr, ptr, node.ys.length, node.xscale, node.xstart, node.flags);
            else if (node.type === "plotBarsY") this.module._implotjs_plot_bars_y(labelPtr, ptr, node.ys.length, node.barSize, node.shift, node.flags);
            else this.module._implotjs_plot_stems_y(labelPtr, ptr, node.ys.length, node.ref, node.scale, node.start, node.flags);
          });
        } finally {
          freePtr(this.module, ptr);
        }
        break;
      }
      case "plotLineXY":
      case "plotScatterXY":
      case "plotStairsXY":
      case "plotBarsXY":
      case "plotStemsXY": {
        const xs = allocFloat64Array(this.module, node.xs);
        const ys = allocFloat64Array(this.module, node.ys);
        try {
          withCString(this.module, node.label, (labelPtr) => {
            if (node.type === "plotLineXY") this.module._implotjs_plot_line_xy(labelPtr, xs.ptr, ys.ptr, node.xs.length, node.flags);
            else if (node.type === "plotScatterXY") this.module._implotjs_plot_scatter_xy(labelPtr, xs.ptr, ys.ptr, node.xs.length, node.flags);
            else if (node.type === "plotStairsXY") this.module._implotjs_plot_stairs_xy(labelPtr, xs.ptr, ys.ptr, node.xs.length, node.flags);
            else if (node.type === "plotBarsXY") this.module._implotjs_plot_bars_xy(labelPtr, xs.ptr, ys.ptr, node.xs.length, node.barSize, node.flags);
            else this.module._implotjs_plot_stems_xy(labelPtr, xs.ptr, ys.ptr, node.xs.length, node.ref, node.flags);
          });
        } finally {
          freePtr(this.module, xs.ptr);
          freePtr(this.module, ys.ptr);
        }
        break;
      }
      case "plotBubblesY": {
        const values = allocFloat64Array(this.module, node.values);
        const szs = allocFloat64Array(this.module, node.szs);
        try {
          withCString(this.module, node.label, (labelPtr) => {
            this.module._implotjs_plot_bubbles_y(labelPtr, values.ptr, szs.ptr, node.values.length, node.xscale, node.xstart, node.flags);
          });
        } finally {
          freePtr(this.module, values.ptr);
          freePtr(this.module, szs.ptr);
        }
        break;
      }
      case "plotBubblesXY": {
        const xs = allocFloat64Array(this.module, node.xs);
        const ys = allocFloat64Array(this.module, node.ys);
        const szs = allocFloat64Array(this.module, node.szs);
        try {
          withCString(this.module, node.label, (labelPtr) => {
            this.module._implotjs_plot_bubbles_xy(labelPtr, xs.ptr, ys.ptr, szs.ptr, node.xs.length, node.flags);
          });
        } finally {
          freePtr(this.module, xs.ptr);
          freePtr(this.module, ys.ptr);
          freePtr(this.module, szs.ptr);
        }
        break;
      }
      case "plotPolygon": {
        const xs = allocFloat64Array(this.module, node.xs);
        const ys = allocFloat64Array(this.module, node.ys);
        try {
          withCString(this.module, node.label, (labelPtr) => {
            this.module._implotjs_plot_polygon(labelPtr, xs.ptr, ys.ptr, node.xs.length, node.flags);
          });
        } finally {
          freePtr(this.module, xs.ptr);
          freePtr(this.module, ys.ptr);
        }
        break;
      }
      case "plotShadedY": {
        const ys = allocFloat64Array(this.module, node.ys);
        try {
          withCString(this.module, node.label, (labelPtr) => {
            this.module._implotjs_plot_shaded_y(labelPtr, ys.ptr, node.ys.length, node.yref, node.xscale, node.xstart, node.flags);
          });
        } finally {
          freePtr(this.module, ys.ptr);
        }
        break;
      }
      case "plotShadedXY": {
        const xs = allocFloat64Array(this.module, node.xs);
        const ys = allocFloat64Array(this.module, node.ys);
        try {
          withCString(this.module, node.label, (labelPtr) => {
            this.module._implotjs_plot_shaded_xy(labelPtr, xs.ptr, ys.ptr, node.xs.length, node.yref, node.flags);
          });
        } finally {
          freePtr(this.module, xs.ptr);
          freePtr(this.module, ys.ptr);
        }
        break;
      }
      case "plotShadedXY2": {
        const xs = allocFloat64Array(this.module, node.xs);
        const ys1 = allocFloat64Array(this.module, node.ys1);
        const ys2 = allocFloat64Array(this.module, node.ys2);
        try {
          withCString(this.module, node.label, (labelPtr) => {
            this.module._implotjs_plot_shaded_xy2(labelPtr, xs.ptr, ys1.ptr, ys2.ptr, node.xs.length, node.flags);
          });
        } finally {
          freePtr(this.module, xs.ptr);
          freePtr(this.module, ys1.ptr);
          freePtr(this.module, ys2.ptr);
        }
        break;
      }
      case "plotBarGroups": {
        const values = allocFloat64Array(this.module, node.values);
        try {
          withStringArray(this.module, node.labels, (labelsPtr) => {
            this.module._implotjs_plot_bar_groups(labelsPtr, values.ptr, node.itemCount, node.groupCount, node.groupSize, node.shift, node.flags);
          });
        } finally {
          freePtr(this.module, values.ptr);
        }
        break;
      }
      case "plotErrorBars":
      case "plotErrorBars2":
      case "plotDigital":
      case "plotHistogram2D": {
        const xs = allocFloat64Array(this.module, node.xs);
        const ys = allocFloat64Array(this.module, node.ys);
        try {
          withCString(this.module, node.label, (labelPtr) => {
            if (node.type === "plotErrorBars") {
              const err = allocFloat64Array(this.module, node.err);
              try {
                this.module._implotjs_plot_error_bars(labelPtr, xs.ptr, ys.ptr, err.ptr, node.xs.length, node.flags);
              } finally {
                freePtr(this.module, err.ptr);
              }
            } else if (node.type === "plotErrorBars2") {
              const neg = allocFloat64Array(this.module, node.neg);
              const pos = allocFloat64Array(this.module, node.pos);
              try {
                this.module._implotjs_plot_error_bars2(labelPtr, xs.ptr, ys.ptr, neg.ptr, pos.ptr, node.xs.length, node.flags);
              } finally {
                freePtr(this.module, neg.ptr);
                freePtr(this.module, pos.ptr);
              }
            } else if (node.type === "plotDigital") {
              this.module._implotjs_plot_digital(labelPtr, xs.ptr, ys.ptr, node.xs.length, node.flags);
            } else {
              const range = node.range ?? { xMin: 0, xMax: 0, yMin: 0, yMax: 0 };
              this.module._implotjs_plot_histogram_2d(labelPtr, xs.ptr, ys.ptr, node.xs.length, node.xBins, node.yBins, range.xMin ?? 0, range.xMax ?? 0, range.yMin ?? 0, range.yMax ?? 0, node.range ? 1 : 0, node.flags);
            }
          });
        } finally {
          freePtr(this.module, xs.ptr);
          freePtr(this.module, ys.ptr);
        }
        break;
      }
      case "plotInfLines":
      case "plotHistogram": {
        const values = allocFloat64Array(this.module, node.values);
        try {
          withCString(this.module, node.label, (labelPtr) => {
            if (node.type === "plotInfLines") {
              this.module._implotjs_plot_inf_lines(labelPtr, values.ptr, node.values.length, node.flags);
            } else {
              const range = node.range ?? { min: 0, max: 0 };
              this.module._implotjs_plot_histogram(labelPtr, values.ptr, node.values.length, node.bins, node.barScale, range.min ?? 0, range.max ?? 0, node.range ? 1 : 0, node.flags);
            }
          });
        } finally {
          freePtr(this.module, values.ptr);
        }
        break;
      }
      case "plotPieChart": {
        const values = allocFloat64Array(this.module, node.values);
        try {
          withStringArray(this.module, node.labels, (labelsPtr) => {
            withCString(this.module, node.labelFormat, (labelFmtPtr) => {
              this.module._implotjs_plot_pie_chart(labelsPtr, values.ptr, node.values.length, node.x, node.y, node.radius, labelFmtPtr, node.angle0, node.flags);
            });
          });
        } finally {
          freePtr(this.module, values.ptr);
        }
        break;
      }
      case "plotHeatmap": {
        const values = allocFloat64Array(this.module, node.values);
        try {
          withCString(this.module, node.label, (labelPtr) => {
            withCString(this.module, node.labelFormat, (fmtPtr) => {
              this.module._implotjs_plot_heatmap(
                labelPtr,
                values.ptr,
                node.rows,
                node.cols,
                node.scaleMin,
                node.scaleMax,
                fmtPtr,
                node.bounds.min[0],
                node.bounds.min[1],
                node.bounds.max[0],
                node.bounds.max[1],
                node.flags,
              );
            });
          });
        } finally {
          freePtr(this.module, values.ptr);
        }
        break;
      }
      case "plotImage":
        withCString(this.module, node.label, (labelPtr) => {
          this.module._implotjs_plot_image(
            labelPtr,
            Number(node.textureId),
            node.bounds.min[0],
            node.bounds.min[1],
            node.bounds.max[0],
            node.bounds.max[1],
            node.uv0[0],
            node.uv0[1],
            node.uv1[0],
            node.uv1[1],
            node.tintColor[0],
            node.tintColor[1],
            node.tintColor[2],
            node.tintColor[3],
            node.flags,
          );
        });
        break;
      case "plotText":
        withCString(this.module, node.text, (textPtr) => {
          this.module._implotjs_plot_text(textPtr, node.x, node.y, node.pixelOffset[0], node.pixelOffset[1], node.flags);
        });
        break;
      case "plotDummy":
        withCString(this.module, node.label, (labelPtr) => {
          this.module._implotjs_plot_dummy(labelPtr, node.flags);
        });
        break;
      case "dragPoint": {
        const ptr = allocOutputF64(this.module, 2);
        const statesPtr = this.module._malloc(3);
        try {
          this.module.HEAPF64[ptr >> 3] = Number(node.point.x);
          this.module.HEAPF64[(ptr >> 3) + 1] = Number(node.point.y);
          const changed = this.module._implotjs_drag_point(node.id, ptr, ptr + 8, node.color[0], node.color[1], node.color[2], node.color[3], node.size, node.flags, statesPtr);
          node.point.x = this.module.HEAPF64[ptr >> 3];
          node.point.y = this.module.HEAPF64[(ptr >> 3) + 1];
          node.state = {
            changed: !!changed,
            clicked: !!this.module.HEAPU8[statesPtr],
            hovered: !!this.module.HEAPU8[statesPtr + 1],
            held: !!this.module.HEAPU8[statesPtr + 2],
          };
        } finally {
          freePtr(this.module, ptr);
          freePtr(this.module, statesPtr);
        }
        break;
      }
      case "dragLineX":
      case "dragLineY": {
        const ptr = allocOutputF64(this.module, 1);
        const statesPtr = this.module._malloc(3);
        try {
          this.module.HEAPF64[ptr >> 3] = Number(node.state.value);
          const fn = node.type === "dragLineX" ? this.module._implotjs_drag_line_x : this.module._implotjs_drag_line_y;
          const changed = fn(node.id, ptr, node.color[0], node.color[1], node.color[2], node.color[3], node.thickness, node.flags, statesPtr);
          node.state.value = this.module.HEAPF64[ptr >> 3];
          node.result = {
            changed: !!changed,
            clicked: !!this.module.HEAPU8[statesPtr],
            hovered: !!this.module.HEAPU8[statesPtr + 1],
            held: !!this.module.HEAPU8[statesPtr + 2],
          };
        } finally {
          freePtr(this.module, ptr);
          freePtr(this.module, statesPtr);
        }
        break;
      }
      case "dragRect": {
        const ptr = allocOutputF64(this.module, 4);
        const statesPtr = this.module._malloc(3);
        try {
          this.module.HEAPF64[ptr >> 3] = Number(node.rect.x1);
          this.module.HEAPF64[(ptr >> 3) + 1] = Number(node.rect.y1);
          this.module.HEAPF64[(ptr >> 3) + 2] = Number(node.rect.x2);
          this.module.HEAPF64[(ptr >> 3) + 3] = Number(node.rect.y2);
          const changed = this.module._implotjs_drag_rect(node.id, ptr, ptr + 8, ptr + 16, ptr + 24, node.color[0], node.color[1], node.color[2], node.color[3], node.flags, statesPtr);
          node.rect.x1 = this.module.HEAPF64[ptr >> 3];
          node.rect.y1 = this.module.HEAPF64[(ptr >> 3) + 1];
          node.rect.x2 = this.module.HEAPF64[(ptr >> 3) + 2];
          node.rect.y2 = this.module.HEAPF64[(ptr >> 3) + 3];
          node.result = {
            changed: !!changed,
            clicked: !!this.module.HEAPU8[statesPtr],
            hovered: !!this.module.HEAPU8[statesPtr + 1],
            held: !!this.module.HEAPU8[statesPtr + 2],
          };
        } finally {
          freePtr(this.module, ptr);
          freePtr(this.module, statesPtr);
        }
        break;
      }
      case "annotation":
        withCString(this.module, node.text, (textPtr) => {
          this.module._implotjs_annotation(node.x, node.y, node.color[0], node.color[1], node.color[2], node.color[3], node.pixelOffset[0], node.pixelOffset[1], node.clamp ? 1 : 0, textPtr);
        });
        break;
      case "tagX":
        withCString(this.module, node.text, (textPtr) => {
          this.module._implotjs_tag_x(node.x, node.color[0], node.color[1], node.color[2], node.color[3], textPtr);
        });
        break;
      case "tagY":
        withCString(this.module, node.text, (textPtr) => {
          this.module._implotjs_tag_y(node.y, node.color[0], node.color[1], node.color[2], node.color[3], textPtr);
        });
        break;
      case "setAxis":
        this.module._implotjs_set_axis(node.axis);
        break;
      case "setAxes":
        this.module._implotjs_set_axes(node.xAxis, node.yAxis);
        break;
      case "hideNextItem":
        this.module._implotjs_hide_next_item(node.hidden ? 1 : 0, node.cond);
        break;
      case "cancelPlotSelection":
        this.module._implotjs_cancel_plot_selection();
        break;
      case "pushStyleColor":
        this.module._implotjs_push_style_color(node.idx, node.color[0], node.color[1], node.color[2], node.color[3]);
        break;
      case "popStyleColor":
        this.module._implotjs_pop_style_color(node.count);
        break;
      case "pushStyleVar":
        if (typeof node.value === "number") {
          this.module._implotjs_push_style_var_float(node.idx, node.value);
        } else if (Array.isArray(node.value)) {
          this.module._implotjs_push_style_var_vec2(node.idx, node.value[0], node.value[1]);
        } else {
          this.module._implotjs_push_style_var_int(node.idx, Number(node.value));
        }
        break;
      case "popStyleVar":
        this.module._implotjs_pop_style_var(node.count);
        break;
      case "setNextLineStyle":
        this.module._implotjs_set_next_line_style(node.color[0], node.color[1], node.color[2], node.color[3], node.weight);
        break;
      case "setNextFillStyle":
        this.module._implotjs_set_next_fill_style(node.color[0], node.color[1], node.color[2], node.color[3], node.alpha);
        break;
      case "setNextMarkerStyle":
        this.module._implotjs_set_next_marker_style(node.marker, node.size, node.fill[0], node.fill[1], node.fill[2], node.fill[3], node.weight, node.outline[0], node.outline[1], node.outline[2], node.outline[3]);
        break;
      case "setNextErrorBarStyle":
        this.module._implotjs_set_next_error_bar_style(node.color[0], node.color[1], node.color[2], node.color[3], node.size, node.weight);
        break;
      case "pushColormap":
        if (typeof node.cmap === "number") {
          this.module._implotjs_push_colormap_index(node.cmap);
        } else {
          withCString(this.module, node.cmap, (ptr) => this.module._implotjs_push_colormap_name(ptr));
        }
        break;
      case "popColormap":
        this.module._implotjs_pop_colormap(node.count);
        break;
      case "nextColormapColor": {
        const out = allocOutputF64(this.module, 4);
        try {
          this.module._implotjs_next_colormap_color(out);
          this.lastNextColormapColor = readOutputF64(this.module, out, 4);
        } finally {
          freePtr(this.module, out);
        }
        break;
      }
      case "colormapScale":
        withCString(this.module, node.label, (labelPtr) => {
          withCString(this.module, node.format, (formatPtr) => {
            this.module._implotjs_colormap_scale(labelPtr, node.min, node.max, node.size[0], node.size[1], formatPtr, node.flags, node.cmap);
          });
        });
        break;
      case "colormapSlider": {
        const tPtr = this.module._malloc(4);
        const colorPtr = allocOutputF64(this.module, 4);
        try {
          this.module.HEAPF32[tPtr >> 2] = Number(node.state.t);
          withCString(this.module, node.label, (labelPtr) => {
            withCString(this.module, node.format, (formatPtr) => {
              node.state.changed = !!this.module._implotjs_colormap_slider(labelPtr, tPtr, colorPtr, formatPtr, node.cmap);
            });
          });
          node.state.t = this.module.HEAPF32[tPtr >> 2];
          node.state.color = readOutputF64(this.module, colorPtr, 4);
        } finally {
          freePtr(this.module, tPtr);
          freePtr(this.module, colorPtr);
        }
        break;
      }
      case "colormapButton":
        withCString(this.module, node.label, (labelPtr) => {
          node.state.clicked = !!this.module._implotjs_colormap_button(labelPtr, node.size[0], node.size[1], node.cmap);
        });
        break;
      default:
        throw new Error(`Unsupported render command: ${node.type}`);
    }
  }
}

export async function createImPlotChart(options: ImPlotChartOptions = {}): Promise<ImPlotChart> {
  const chart = new ImPlotChart(options);
  await chart.mount();
  return chart;
}

export default ImPlotChart;
