
import React, { useState, useMemo } from 'react';
import { 
  UploadCloud, 
  Database, 
  Settings, 
  Search, 
  ChevronRight,
  FileText,
  Activity,
  MoreVertical,
  Plus,
  History,
  TrendingUp,
  Folder as FolderIcon,
  Trash2,
  Clock,
  AlertTriangle,
  XCircle,
  Users,
  Briefcase,
  Code,
  ShieldCheck,
  ArrowLeft,
  ChevronDown,
  RefreshCcw,
  MoreHorizontal,
  Layers,
  Sparkles,
  Zap,
  X,
  Edit,
  Eye,
  Save,
  FileUp,
  Paperclip,
  FolderOpen,
  Tag,
  Calendar,
  Check,
  FileSearch,
  FileCheck,
  Download,
  Square,
  CheckSquare,
  MoveHorizontal,
  FolderPlus,
  Image as ImageIcon,
  UserPlus,
  Shield,
  UserCheck,
  Key
} from 'lucide-react';
import { ViewState, FileItem, Folder, Repository, ValidityStatus, AITemplate, UserRole, User } from './types';

// Mock Data
const MOCK_REPOS: Repository[] = [
  { id: 'repo_rd', name: '研发中心知识库', icon: 'code' },
  { id: 'repo_bid', name: '投标支持部', icon: 'briefcase' },
  { id: 'repo_hr', name: '人力资源共享', icon: 'users' },
  { id: 'repo_legal', name: '法务风控中心', icon: 'shield' },
];

const MOCK_USERS: User[] = [
  { id: 'u1', name: '张小钉', role: 'super_admin', avatar: 'https://picsum.photos/seed/user1/40/40', email: 'zhang@nexus.ai', lastLogin: '2024-03-24' },
  { id: 'u2', name: '李研发', role: 'dept_admin', deptId: 'repo_rd', avatar: 'https://picsum.photos/seed/user2/40/40', email: 'li@nexus.ai', lastLogin: '2024-03-23' },
  { id: 'u3', name: '王技术', role: 'dept_collaborator', deptId: 'repo_rd', avatar: 'https://picsum.photos/seed/user3/40/40', email: 'wang@nexus.ai', lastLogin: '2024-03-22' },
  { id: 'u4', name: '赵审计', role: 'viewer', deptId: 'repo_rd', avatar: 'https://picsum.photos/seed/user4/40/40', email: 'zhao@nexus.ai', lastLogin: '2024-03-24' },
  { id: 'u5', name: '孙投标', role: 'dept_admin', deptId: 'repo_bid', avatar: 'https://picsum.photos/seed/user5/40/40', email: 'sun@nexus.ai', lastLogin: '2024-03-21' },
];

const MOCK_TEMPLATES: AITemplate[] = [
  { 
    id: 't1', 
    name: '研发周报模板', 
    description: '自动提取项目名称与进度，固定打标 #研发 #周报', 
    repoId: 'repo_rd', 
    defaultTags: ['#研发', '#周报'], 
    validityRule: '有效期：30天', 
    usageCount: 124,
    sampleFiles: ['2023_RD_Weekly_Sample.pdf']
  },
  { 
    id: 't2', 
    name: '劳动合同模板', 
    description: '自动识别入职日期与合同限期，设定临期提醒', 
    repoId: 'repo_hr', 
    defaultTags: ['#合同', '#法务'], 
    validityRule: '根据文档内容自动提取', 
    usageCount: 45,
    sampleFiles: ['Standard_Labor_Contract_v2.docx']
  },
  { 
    id: 't4', 
    name: '技术架构评审', 
    description: '自动识别架构图及关键组件，生成版本记录', 
    repoId: 'repo_rd', 
    defaultTags: ['#架构', '#评审'], 
    validityRule: '版本更新后 12个月', 
    usageCount: 56,
    sampleFiles: ['Arch_Review_Spec_Template.pdf']
  },
];

const INITIAL_FOLDERS: Folder[] = [
  { id: 'f1', name: '技术架构', parentId: null, repoId: 'repo_rd' },
  { id: 'f2', name: 'UI 规范', parentId: null, repoId: 'repo_rd' },
  { id: 'f3', name: '历史中标项目', parentId: null, repoId: 'repo_bid' },
  { id: 'f4', name: '商务资质', parentId: null, repoId: 'repo_bid' },
];

const INITIAL_FILES: FileItem[] = [
  { id: '1', name: '2024Q1研发进度周报.docx', type: 'DOCX', size: '2.4 MB', date: '2024-03-20', tags: ['#研发', '#周报'], summary: '本周研发团队完成了后端 API 的重构。重点优化了鉴权机制和响应缓存。项目 NexusAI 的语义向量索引优化算法已进入内测阶段，预计 Q2 之前完成全面部署。目前存在的主要风险是数据库连接池在高并发下的稳定性问题，已安排专人负责排查。', status: 'valid', repoId: 'repo_rd', folderId: 'f1' },
  { id: '2', name: '产品设计规范 V2.0.pdf', type: 'PDF', size: '15.1 MB', date: '2024-03-18', tags: ['#产品', '#设计规范'], summary: '定义了全系统的主色调、字体比例及交互动效准则。', status: 'long_term', repoId: 'repo_rd', folderId: 'f2' },
  { id: '3', name: '[中标] 智慧城市投标方案_v1.pdf', type: 'PDF', size: '4.2 MB', date: '2024-03-15', tags: ['#业绩', '#投标'], summary: '针对某市智慧园区建设的完整投标方案及报价。', status: 'long_term', repoId: 'repo_bid', folderId: 'f3' },
  { id: '4', name: '核心算法专利申报.docx', type: 'DOCX', size: '1.1 MB', date: '2024-03-10', tags: ['#法务', '#研发'], summary: '描述了 NexusAI 的语义向量索引优化算法。', status: 'long_term', repoId: 'repo_rd', folderId: null },
  { id: '13', name: '企业营业执照副本扫描件.jpg', type: 'JPG', size: '2.1 MB', date: '2024-03-24', tags: ['#资质', '#证照'], summary: '公司营业执照副本扫描件，包含最新年检信息与官方印章确认。', status: 'long_term', repoId: 'repo_bid', folderId: 'f4' },
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [currentView, setCurrentView] = useState<ViewState>('repository');
  const [activeRepoId, setActiveRepoId] = useState<string>('repo_rd');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isTrashView, setIsTrashView] = useState(false);
  const [repoSearchQuery, setRepoSearchQuery] = useState('');
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [folders, setFolders] = useState<Folder[]>(INITIAL_FOLDERS);
  
  // Selection States
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Interaction States
  const [modalMode, setModalMode] = useState<'create' | 'details' | 'edit' | 'ingestion' | 'preview' | 'newFolder' | 'editFile' | 'invite' | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<AITemplate | null>(null);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [ingestionTab, setIngestionTab] = useState<'manual' | 'smart'>('smart');
  const [newFolderName, setNewFolderName] = useState('');

  // Permission Checks
  const isSuperAdmin = currentUser.role === 'super_admin';
  const isDeptAdmin = currentUser.role === 'dept_admin';
  const isCollaborator = currentUser.role === 'dept_collaborator';
  const isViewer = currentUser.role === 'viewer';
  
  const canOperateFiles = isSuperAdmin || isDeptAdmin || isCollaborator;
  const canManageTemplates = isSuperAdmin || isDeptAdmin;
  const canInvite = isSuperAdmin || isDeptAdmin;
  const canViewAllRepos = isSuperAdmin;

  // Repositories user can see
  const availableRepos = useMemo(() => {
    if (canViewAllRepos) return MOCK_REPOS;
    return MOCK_REPOS.filter(r => r.id === currentUser.deptId);
  }, [currentUser, canViewAllRepos]);

  // Handle auto-switching repo if current one becomes unavailable
  React.useEffect(() => {
    if (!availableRepos.find(r => r.id === activeRepoId)) {
        setActiveRepoId(availableRepos[0]?.id || '');
    }
  }, [availableRepos]);

  const handleUploadComplete = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setModalMode(null);
    }, 2500);
  };

  const deleteFile = (id: string) => {
    if (!canOperateFiles) return;
    setFiles(prev => prev.map(f => f.id === id ? { ...f, isDeleted: true } : f));
  };

  const restoreFile = (id: string) => {
    if (!canOperateFiles) return;
    setFiles(prev => prev.map(f => f.id === id ? { ...f, isDeleted: false } : f));
  };

  const createFolder = () => {
    if (!newFolderName.trim() || !canOperateFiles) return;
    const newFolder: Folder = {
      id: `f${Date.now()}`,
      name: newFolderName,
      parentId: currentFolderId,
      repoId: activeRepoId
    };
    setFolders(prev => [...prev, newFolder]);
    setNewFolderName('');
    setModalMode(null);
  };

  const toggleSelection = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const currentRepo = MOCK_REPOS.find(r => r.id === activeRepoId);

  const filteredFolders = useMemo(() => {
    if (isTrashView) return [];
    return folders.filter(f => f.repoId === activeRepoId && f.parentId === currentFolderId);
  }, [folders, activeRepoId, currentFolderId, isTrashView]);

  const filteredFiles = useMemo(() => {
    return files.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(repoSearchQuery.toLowerCase()) || 
                            f.tags.some(t => t.toLowerCase().includes(repoSearchQuery.toLowerCase()));
      const matchesTrash = f.isDeleted === isTrashView;
      const matchesFolder = isTrashView ? true : f.folderId === currentFolderId;
      const matchesRepo = isTrashView ? true : f.repoId === activeRepoId;

      return matchesSearch && matchesTrash && matchesRepo && (isTrashView ? true : (matchesFolder));
    });
  }, [files, repoSearchQuery, isTrashView, currentFolderId, activeRepoId]);

  const filteredTemplates = useMemo(() => {
    return MOCK_TEMPLATES.filter(t => 
      t.repoId === activeRepoId && 
      (t.name.toLowerCase().includes(templateSearchQuery.toLowerCase()) || 
       t.description.toLowerCase().includes(templateSearchQuery.toLowerCase()))
    );
  }, [activeRepoId, templateSearchQuery]);

  const getStatusInfo = (status: ValidityStatus) => {
    switch (status) {
      case 'long_term': return { label: '长期有效', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: <ShieldCheck size={12} /> };
      case 'valid': return { label: '有效期内', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <Clock size={12} /> };
      case 'expiring': return { label: '临期', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: <AlertTriangle size={12} /> };
      case 'expired': return { label: '已过期', color: 'bg-rose-50 text-rose-600 border-rose-100', icon: <XCircle size={12} /> };
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch(role) {
      case 'super_admin': return { label: '超级管理员', color: 'bg-indigo-100 text-indigo-700', icon: <Shield size={10}/> };
      case 'dept_admin': return { label: '部门管理员', color: 'bg-blue-100 text-blue-700', icon: <UserCheck size={10}/> };
      case 'dept_collaborator': return { label: '部门协作者', color: 'bg-teal-100 text-teal-700', icon: <Edit size={10}/> };
      case 'viewer': return { label: '查看者', color: 'bg-slate-100 text-slate-700', icon: <Eye size={10}/> };
    }
  };

  const RepoIcon = ({ name }: { name: string }) => {
    switch (name) {
      case 'code': return <Code size={18} />;
      case 'briefcase': return <Briefcase size={18} />;
      case 'users': return <Users size={18} />;
      case 'shield': return <ShieldCheck size={18} />;
      default: return <Database size={18} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#007FFF] rounded-lg flex items-center justify-center text-white font-bold text-xl">N</div>
          <span className="text-xl font-bold tracking-tight">NexusAI</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <NavItem icon={<Database size={20} />} label="知识仓库" active={currentView === 'repository'} onClick={() => { setCurrentView('repository'); setIsTrashView(false); setActiveRepoId(availableRepos[0]?.id || ''); }} />
          {canManageTemplates && (
            <NavItem icon={<Layers size={20} />} label="AI 模板" active={currentView === 'templates'} onClick={() => { setCurrentView('templates'); setIsTrashView(false); setActiveRepoId(availableRepos[0]?.id || ''); }} />
          )}
          <div className="pt-6 pb-2 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">系统设置</div>
          {canInvite && (
             <NavItem icon={<Users size={20} />} label="团队管理" active={currentView === 'members'} onClick={() => setCurrentView('members')} />
          )}
          <NavItem icon={<Settings size={20} />} label="账户与偏好" active={currentView === 'settings'} onClick={() => setCurrentView('settings')} />
        </nav>

        {/* User Profile & Role Switcher for Mocking */}
        <div className="p-4 border-t border-slate-100">
          <div className="group relative">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
              <img src={currentUser.avatar} className="w-10 h-10 rounded-full border border-slate-200" alt="Avatar" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-slate-700">{currentUser.name}</p>
                <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getRoleBadge(currentUser.role).color}`}>
                  {getRoleBadge(currentUser.role).label}
                </div>
              </div>
            </div>
            
            {/* Simple Role Switcher Overlay for Demo */}
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border border-slate-200 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none group-hover:pointer-events-auto">
                <p className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-widest">切换角色 (仅演示)</p>
                {MOCK_USERS.map(u => (
                    <button 
                        key={u.id}
                        onClick={() => { setCurrentUser(u); setCurrentView('repository'); }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-slate-50 flex items-center justify-between ${currentUser.id === u.id ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600'}`}
                    >
                        {u.name}
                        <span className="text-[10px] opacity-60">({u.role})</span>
                    </button>
                ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {(currentView === 'repository' || currentView === 'templates') ? (
          <div className="flex-1 flex overflow-hidden">
             <aside className="w-64 border-r border-slate-100 bg-slate-50/50 flex flex-col shrink-0">
                <div className="p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-4">部门知识库</p>
                    <div className="space-y-1">
                    {availableRepos.map(repo => (
                        <button
                        key={repo.id}
                        onClick={() => { setActiveRepoId(repo.id); setIsTrashView(false); setCurrentFolderId(null); setSelectedIds(new Set()); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeRepoId === repo.id && !isTrashView ? 'bg-white text-[#007FFF] shadow-sm border border-slate-100' : 'text-slate-600 hover:bg-slate-200/50'}`}
                        >
                        <RepoIcon name={repo.icon} />
                        {repo.name}
                        </button>
                    ))}
                    </div>
                    
                    {currentView === 'repository' && canOperateFiles && (
                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <button
                        onClick={() => { setIsTrashView(true); setActiveRepoId(''); setSelectedIds(new Set()); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isTrashView ? 'bg-slate-200 text-slate-900 shadow-inner' : 'text-slate-500 hover:bg-slate-200/50'}`}
                        >
                        <Trash2 size={18} />
                        回收站
                        </button>
                    </div>
                    )}
                </div>
            </aside>

            {/* Repository Main Area */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  {(currentFolderId || isTrashView) && (
                    <button 
                      onClick={() => { 
                        if (isTrashView) {
                          setIsTrashView(false);
                          setActiveRepoId(availableRepos[0].id);
                        } else {
                          setCurrentFolderId(null); 
                        }
                        setSelectedIds(new Set()); 
                      }}
                      className="p-1 hover:bg-slate-100 rounded-md text-slate-500 mr-2"
                    >
                      <ArrowLeft size={16} />
                    </button>
                  )}
                  <h2 className="text-lg font-bold text-slate-800">
                    {isTrashView ? '回收站' : currentRepo?.name}
                    {isViewer && <span className="ml-3 text-xs font-normal text-slate-400">(只读)</span>}
                  </h2>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="relative mr-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="搜索文档、标签..." 
                      value={repoSearchQuery}
                      onChange={(e) => setRepoSearchQuery(e.target.value)}
                      className="w-48 bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#007FFF] transition-all outline-none"
                    />
                  </div>

                  {currentView === 'repository' && !isTrashView && canOperateFiles && (
                    <>
                      <button 
                        onClick={() => setModalMode('newFolder')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <FolderPlus size={14} /> 新建文件夹
                      </button>
                      <button 
                        onClick={() => { setModalMode('ingestion'); setIngestionTab('smart'); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-blue-100 text-[#007FFF] bg-blue-50 hover:bg-blue-100 transition-all shadow-sm`}
                      >
                        <UploadCloud size={14} /> 智能入库
                      </button>
                    </>
                  )}

                  {currentView === 'templates' && canManageTemplates && (
                    <button 
                        onClick={() => setModalMode('create')}
                        className="flex items-center gap-2 px-4 py-2 bg-[#007FFF] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm"
                    >
                        <Plus size={18} /> 新建模板
                    </button>
                  )}
                </div>
              </div>

              {/* View Rendering */}
              {currentView === 'repository' ? (
                <div className="flex-1 overflow-y-auto mt-2">
                   <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                            <th className="px-6 py-3 w-10">
                                <button 
                                onClick={() => {
                                    if (selectedIds.size > 0) setSelectedIds(new Set());
                                    else {
                                    const all = new Set([...filteredFolders.map(f => f.id), ...filteredFiles.map(f => f.id)]);
                                    setSelectedIds(all);
                                    }
                                }}
                                className="text-slate-300 hover:text-slate-500"
                                >
                                {selectedIds.size > 0 ? <CheckSquare size={18} className="text-[#007FFF]" /> : <Square size={18} />}
                                </button>
                            </th>
                            <th className="px-2 py-3 font-semibold">名称</th>
                            <th className="px-4 py-3 font-semibold">类型</th>
                            <th className="px-4 py-3 font-semibold">标签</th>
                            <th className="px-4 py-3 font-semibold">状态</th>
                            <th className="px-4 py-3 font-semibold">最后更新</th>
                            <th className="px-6 py-3 font-semibold text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredFolders.map(folder => (
                                <tr key={folder.id} className={`group hover:bg-slate-50 transition-colors cursor-pointer ${selectedIds.has(folder.id) ? 'bg-blue-50/30' : ''}`}>
                                    <td className="px-6 py-4" onClick={(e) => { e.stopPropagation(); toggleSelection(folder.id); }}>
                                        {selectedIds.has(folder.id) ? <CheckSquare size={18} className="text-[#007FFF]" /> : <Square size={18} className="text-slate-200 group-hover:text-slate-300" />}
                                    </td>
                                    <td className="px-2 py-4" onClick={() => { setCurrentFolderId(folder.id); setSelectedIds(new Set()); }}>
                                        <div className="flex items-center gap-3">
                                            <FolderIcon size={20} className="text-[#007FFF] fill-blue-50" />
                                            <span className="text-sm font-bold text-slate-700">{folder.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-xs font-medium text-slate-400">文件夹</td>
                                    <td className="px-4 py-4">—</td>
                                    <td className="px-4 py-4">—</td>
                                    <td className="px-4 py-4 text-xs text-slate-400">2024-03-21</td>
                                    <td className="px-6 py-4 text-right">
                                        {canOperateFiles && (
                                            <button className="p-1.5 text-slate-300 hover:text-slate-600 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredFiles.map(file => (
                                <tr key={file.id} className={`group hover:bg-slate-50 transition-all cursor-default ${selectedIds.has(file.id) ? 'bg-blue-50/30' : ''}`}>
                                    <td className="px-6 py-4" onClick={() => toggleSelection(file.id)}>
                                        {selectedIds.has(file.id) ? <CheckSquare size={18} className="text-[#007FFF]" /> : <Square size={18} className="text-slate-200 group-hover:text-slate-300" />}
                                    </td>
                                    <td className="px-2 py-4 max-w-[280px]">
                                        <div className="flex items-center gap-3 relative">
                                            {['JPG', 'JPEG', 'PNG'].includes(file.type.toUpperCase()) ? <ImageIcon size={20} className="text-indigo-400 shrink-0" /> : <FileText size={20} className="text-slate-400 shrink-0" />}
                                            <p onClick={() => { setPreviewFile(file); setModalMode('preview'); }} className="text-sm font-bold text-slate-700 truncate hover:text-blue-600 cursor-pointer transition-colors">
                                                {file.name}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{file.type}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                                            {file.tags.map(tag => <span key={tag} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded">{tag}</span>)}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-bold ${getStatusInfo(file.status).color}`}>
                                            {getStatusInfo(file.status).icon} {getStatusInfo(file.status).label}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-xs text-slate-400 font-medium">{file.date}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setPreviewFile(file); setModalMode('preview'); }} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg" title="预览"><Eye size={16} /></button>
                                            {canOperateFiles && (
                                                <>
                                                    <button onClick={() => { setEditingFile(file); setModalMode('editFile'); }} className="p-1.5 text-slate-400 hover:text-[#007FFF] hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                                                    <button onClick={() => deleteFile(file.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTemplates.map(template => (
                                <div key={template.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group relative">
                                    <div className="absolute top-4 right-4">
                                        <button onClick={() => { setSelectedTemplate(template); setModalMode('edit'); }} className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-50 text-[#007FFF] rounded-xl flex items-center justify-center mb-4"><Zap size={24} /></div>
                                    <h3 className="font-bold text-slate-800 text-lg mb-2">{template.name}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">{template.description}</p>
                                    <div className="mt-6 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-300 uppercase">已处理 {template.usageCount} 次</span>
                                        <button onClick={() => { setSelectedTemplate(template); setModalMode('details'); }} className="text-sm font-bold text-[#007FFF] flex items-center gap-1">详情 <ChevronRight size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
              )}
            </div>
          </div>
        ) : currentView === 'members' ? (
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                   <h2 className="text-2xl font-bold text-slate-800">团队管理</h2>
                   <p className="text-sm text-slate-400 mt-1">
                     {isSuperAdmin ? '管理全平台成员及权限等级' : `管理 ${currentRepo?.name} 的协作者`}
                   </p>
                </div>
                <button 
                   onClick={() => setModalMode('invite')}
                   className="flex items-center gap-2 px-4 py-2.5 bg-[#007FFF] text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-200"
                >
                   <UserPlus size={18}/> 邀请成员
                </button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-white border-b border-slate-100">
                                    <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                        <th className="px-6 py-4">成员姓名</th>
                                        <th className="px-6 py-4">角色权限</th>
                                        <th className="px-6 py-4">对应部门/库</th>
                                        <th className="px-6 py-4">最后在线</th>
                                        <th className="px-6 py-4 text-right">管理</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {MOCK_USERS.filter(u => isSuperAdmin || u.deptId === currentUser.deptId).map(user => (
                                        <tr key={user.id} className="bg-white hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={user.avatar} className="w-8 h-8 rounded-full border border-slate-100" />
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-700">{user.name}</p>
                                                        <p className="text-[10px] text-slate-400">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getRoleBadge(user.role).color}`}>
                                                    {getRoleBadge(user.role).icon}
                                                    {getRoleBadge(user.role).label}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-medium text-slate-600">
                                                    {user.role === 'super_admin' ? '全平台' : MOCK_REPOS.find(r => r.id === user.deptId)?.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-400">{user.lastLogin}</td>
                                            <td className="px-6 py-4 text-right">
                                                {isSuperAdmin && user.role !== 'super_admin' && (
                                                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><Edit size={16}/></button>
                                                )}
                                                {isDeptAdmin && user.role === 'dept_collaborator' && (
                                                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><Edit size={16}/></button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-6">
            <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center shadow-inner">
              <Settings size={48} className="opacity-20" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-700">账户与偏好</h2>
              <p className="text-sm mt-2 text-slate-400">正在优化设置面板</p>
            </div>
          </div>
        )}

        {/* Modal Logic */}
        {modalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${['ingestion', 'preview', 'invite'].includes(modalMode) ? 'w-full max-w-4xl' : 'w-full max-w-xl'}`}>
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h3 className="text-xl font-bold text-slate-800">
                  {modalMode === 'invite' ? '邀请协作者' : modalMode === 'newFolder' ? '新建文件夹' : modalMode === 'preview' ? '文件预览' : '操作'}
                </h3>
                <button onClick={() => setModalMode(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                  {modalMode === 'invite' && (
                      <div className="space-y-6">
                          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                              <Key className="text-blue-500 shrink-0" size={24}/>
                              <p className="text-sm text-slate-600 leading-relaxed">
                                  您正在为 <span className="font-bold text-blue-600">{currentRepo?.name}</span> 邀请新成员。
                                  邀请后，对方将默认获得该库的 <span className="font-bold">协作者</span> 权限。
                              </p>
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">邮箱地址 / 钉钉号</label>
                              <input type="text" placeholder="输入邮箱或通过组织架构搜索..." className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"/>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-2">角色授权</label>
                                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-white">
                                      <option>部门协作者 (可读写)</option>
                                      <option>查看者 (只读)</option>
                                      {isSuperAdmin && <option>部门管理员</option>}
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-2">有效期</label>
                                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-white">
                                      <option>永久有效</option>
                                      <option>30天 (项目期)</option>
                                      <option>7天 (临时查看)</option>
                                  </select>
                              </div>
                          </div>
                      </div>
                  )}

                  {modalMode === 'newFolder' && (
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-700">文件夹名称</label>
                        <input value={newFolderName} onChange={e => setNewFolderName(e.target.value)} autoFocus placeholder="输入名称..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"/>
                    </div>
                  )}

                  {modalMode === 'preview' && previewFile && (
                    <div className="space-y-6">
                        <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                            <h4 className="font-bold text-xl text-slate-800 mb-1">{previewFile.name}</h4>
                            <p className="text-sm text-slate-500">{previewFile.summary}</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-10 min-h-[300px] flex flex-col items-center justify-center text-slate-300 italic">
                            <FileSearch size={48} className="mb-4 opacity-10" />
                            <p>内容预览受权限控制，当前仅供 {currentUser.role} 角色调阅</p>
                        </div>
                    </div>
                  )}
              </div>

              <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={() => setModalMode(null)} className="px-6 py-2.5 font-bold text-slate-500 hover:bg-slate-100 rounded-xl">取消</button>
                <button 
                  onClick={modalMode === 'newFolder' ? createFolder : () => setModalMode(null)}
                  className="px-8 py-2.5 bg-[#007FFF] text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-600"
                >
                  {modalMode === 'invite' ? '发送邀请' : '确认'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Sub-components
function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 ${
        active 
          ? 'bg-blue-50 text-[#007FFF] shadow-[0_2px_10px_rgba(0,127,255,0.08)]' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
      }`}
    >
      <span className={active ? 'text-[#007FFF]' : 'text-slate-400 group-hover:text-slate-600'}>{icon}</span>
      {label}
    </button>
  );
}
