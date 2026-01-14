
export type ViewState = 'repository' | 'templates' | 'settings';

export type ValidityStatus = 'long_term' | 'valid' | 'expiring' | 'expired';

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  tags: string[];
  summary: string;
  status: ValidityStatus;
  isDeleted?: boolean;
  folderId?: string | null;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  repoId: string;
}

export interface Repository {
  id: string;
  name: string;
  icon: string;
}

export interface AITemplate {
  id: string;
  name: string;
  description: string;
  repoId: string;
  defaultTags: string[];
  validityRule: string;
  usageCount: number;
  sampleFiles?: string[];
}
