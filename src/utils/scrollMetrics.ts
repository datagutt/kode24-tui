interface NavigationMetrics {
  top: number;
  height: number;
}

interface SimpleItemConfig {
  count: number;
  itemHeight: number;
  itemMargin?: number;
}

interface ComplexItemConfig {
  items: Array<{
    height: number;
    marginAfter?: number;
  }>;
}

export const calculateSimpleMetrics = (config: SimpleItemConfig): Record<number, NavigationMetrics> => {
  const metrics: Record<number, NavigationMetrics> = {};
  const { count, itemHeight, itemMargin = 0 } = config;
  
  let offset = 0;
  for (let i = 0; i < count; i++) {
    metrics[i] = { top: offset, height: itemHeight };
    offset += itemHeight + itemMargin;
  }
  
  return metrics;
};

export const calculateComplexMetrics = (config: ComplexItemConfig): Record<number, NavigationMetrics> => {
  const metrics: Record<number, NavigationMetrics> = {};
  let offset = 0;
  
  config.items.forEach((item, index) => {
    metrics[index] = { top: offset, height: item.height };
    offset += item.height + (item.marginAfter ?? 0);
  });
  
  return metrics;
};

export const estimateBoxHeight = (props: {
  border?: boolean;
  padding?: number;
  textLines?: number;
  marginTop?: number;
  marginBottom?: number;
}): number => {
  const { border = false, padding = 0, textLines = 1, marginTop = 0, marginBottom = 0 } = props;
  
  let height = textLines;
  if (border) height += 2;
  height += padding * 2;
  height += marginTop + marginBottom;
  
  return height;
};
