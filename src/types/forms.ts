const AvailableFilters = ['vendor', 'category'] as const;

export type FiltersType = (typeof AvailableFilters)[number];

export type Filter = {
  key: `${FiltersType}_id`;
  value: number | string;
};
