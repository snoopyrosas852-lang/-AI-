
export type ViewState = 'repository' | 'templates' | 'settings' | 'members';

export type ValidityStatus = 'long_term' | 'valid' | 'expiring' | 'expired';

export type UserRole = 'super_admin' | 'dept_admin' | 'dept_collaborator' | 'viewer';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  deptId?: string; // Specific repository ID they belong to (for non-super admins)
  email?: string;
  lastLogin?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  tags: string[];
  summary: string;
  status: ValidityStatus;
  repoId: string;
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
