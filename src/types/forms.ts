const AvailableFilters = ['vendor', 'category'] as const;

export type FiltersType = (typeof AvailableFilters)[number];
