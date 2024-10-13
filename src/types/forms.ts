const AvailableFilters = ['vendor', 'category'] as const;
const AvailableDateFilters = ['transaction_on_from', 'transaction_on_to', 'posted_on_from', 'posted_on_to'] as const;

export type FiltersType = (typeof AvailableFilters)[number];
export type DateFilterType = (typeof AvailableDateFilters)[number];
