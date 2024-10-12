export interface Tag {
  id: number;
  name: string;
}

export interface TagsListResponse {
  data: Tag[];
}

export interface TagResponse {
  data: Tag;
}
