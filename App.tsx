
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
  ImageIcon,
  UserPlus,
  Shield,
  UserCheck,
  Key,
  Info,
  FileWarning,
  LayoutGrid,
  UserMinus,
  RotateCcw,
  Copy,
  ExternalLink,
  FileArchive,
  User as UserIcon
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
  { id: '1', name: '2024Q1研发进度周报.docx', uploader: '张小钉', type: 'DOCX', size: '2.4 MB', date: '2024-03-20', expirationDate: '2024-04-20', tags: ['#研发', '#周报'], summary: '本周研发团队完成了后端 API 的重构。重点优化了鉴权机制和响应缓存。项目 NexusAI 的语义向量索引优化算法已进入内测阶段，预计 Q2 之前完成全面部署。目前存在的主要风险是数据库连接池在高并发下的稳定性问题。', status: 'valid', repoId: 'repo_rd', folderId: 'f1' },
  { id: '2', name: '产品设计规范 V2.0.pdf', uploader: '李研发', type: 'PDF', size: '15.1 MB', date: '2024-03-18', tags: ['#产品', '#设计规范'], summary: '定义了全系统的主色调、字体比例及交互动效准则。包含组件库的使用说明和设计原则。', status: 'long_term', repoId: 'repo_rd', folderId: 'f2' },
  { id: '3', name: '[中标]智慧城市投标方案_v1.pdf', uploader: '孙投标', type: 'PDF', size: '4.2 MB', date: '2024-03-15', tags: ['#业绩', '#投标'], summary: '针对某市智慧园区建设的完整投标方案及报价。包含了硬件采购、软件定制及未来三年的运维支持计划。', status: 'long_term', repoId: 'repo_bid', folderId: 'f3' },
  { id: '4', name: '核心算法专利申报.docx', uploader: '张小钉', type: 'DOCX', size: '1.1 MB', date: '2024-03-10', tags: ['#法务', '#研发'], summary: '描述了 NexusAI 的语义向量索引优化算法及其在大规模分布式环境下的性能表现。', status: 'long_term', repoId: 'repo_rd', folderId: null },
  { id: '5', name: '员工入职手册 2024版.pdf', uploader: '王技术', type: 'PDF', size: '5.8 MB', date: '2024-01-05', tags: ['#行政', '#入职'], summary: '针对新入职员工的企业文化培训、日常办公系统操作指南及福利政策说明。', status: 'long_term', repoId: 'repo_hr', folderId: null },
  { id: '6', name: 'NexusAI API 安全审计报告.pdf', uploader: '张小钉', type: 'PDF', size: '2.3 MB', date: '2024-03-22', expirationDate: '2024-06-22', tags: ['#安全', '#审计'], summary: '针对 NexusAI 外部接口的渗透测试报告，修复了两个高危 SQL 注入漏洞和一个逻辑越权问题。', status: 'valid', repoId: 'repo_rd', folderId: 'f1' },
  { id: '7', name: '2024 政府采购投标资质全集.zip', uploader: '孙投标', type: 'ZIP', size: '128.4 MB', date: '2024-03-23', expirationDate: '2024-03-30', tags: ['#资质', '#投标'], summary: '包含最新的三证合一、社保证明、纳税证明等投标必备扫描件集合。', status: 'expiring', repoId: 'repo_bid', folderId: 'f4' },
  { id: '8', name: '软件服务采购协议 (模板).docx', uploader: '赵审计', type: 'DOCX', size: '0.8 MB', date: '2024-02-14', tags: ['#合同', '#法务'], summary: '标准的 IT 软件采购合同范本，包含 SLA 保障条款和数据隐私保护协议。', status: 'long_term', repoId: 'repo_legal', folderId: null },
  { id: '9', name: '2024 年度晋升评定标准 V1.xlsx', uploader: '王技术', type: 'XLSX', size: '1.2 MB', date: '2024-03-01', expirationDate: '2025-03-01', tags: ['#HR', '#考核'], summary: '详细罗列了研发、产品、职能序列的职级评定维度及对应的薪资带宽。', status: 'valid', repoId: 'repo_hr', folderId: null },
  { id: '10', name: '竞争对手产品对标 analysis 2024Q1.pptx', uploader: '孙投标', type: 'PPTX', size: '22.4 MB', date: '2024-03-12', expirationDate: '2024-04-12', tags: ['#市场', '#竞对'], summary: '对业内前三家主流 AI 知识库产品的核心功能、价格体系及市场占有率进行的深度调研报告。', status: 'valid', repoId: 'repo_bid', folderId: null },
  { id: '11', name: '数据处理安全合规指引.pdf', uploader: '赵审计', type: 'PDF', size: '3.1 MB', date: '2023-11-20', tags: ['#合规', '#法务'], summary: '根据《个人信息保护法》制定的企业内部数据处理操作手册。', status: 'long_term', repoId: 'repo_legal', folderId: null },
  { id: '12', name: '分布式向量数据库压测数据记录.csv', uploader: '李研发', type: 'CSV', size: '45.1 MB', date: '2024-03-24', expirationDate: '2024-09-24', tags: ['#研发', '#性能'], summary: 'Milvus 在亿级数据量下的检索延迟与 QPS 原始测试数据记录。', status: 'valid', repoId: 'repo_rd', folderId: null },
  { id: '13', name: '企业营业执照副本扫描件.jpg', uploader: '孙投标', type: 'JPG', size: '2.1 MB', date: '2024-03-24', tags: ['#资质', '#证照'], summary: '公司营业执照副本扫描件，包含最新年检信息与官方印章确认。', status: 'long_term', repoId: 'repo_bid', folderId: 'f4' },
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [currentView, setCurrentView] = useState<ViewState>('repository');
  const [activeRepoId, setActiveRepoId] = useState<string>('repo_rd');
  const [activeDeptFilterId, setActiveDeptFilterId] = useState<string>('all');
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
  const [modalMode, setModalMode] = useState<'create' | 'details' | 'edit' | 'ingestion' | 'preview' | 'newFolder' | 'editFile' | 'invite' | 'batchTag' | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<AITemplate | null>(null);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newBatchTagName, setNewBatchTagName] = useState('');
  const [tagInput, setTagInput] = useState('');

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
    if (!availableRepos.find(r => r.id === activeRepoId) && !isTrashView) {
        setActiveRepoId(availableRepos[0]?.id || '');
    }
  }, [availableRepos, activeRepoId, isTrashView]);

  const handleUploadComplete = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setFiles(prev => [
        ...prev,
        { id: `new_${Date.now()}`, name: '批量入库文件示例.pdf', uploader: currentUser.name, type: 'PDF', size: '4.5 MB', date: new Date().toISOString().split('T')[0], expirationDate: '2025-10-24', tags: ['#自动分类'], summary: '这是一个通过批量入库功能自动处理的示例文档。', status: 'valid', repoId: activeRepoId, folderId: currentFolderId }
      ]);
      setModalMode(null);
    }, 1500);
  };

  const handleExport = (ids: Set<string> | string[]) => {
    setIsProcessing(true);
    const idList = Array.from(ids);
    console.log(`Exporting files: ${idList.join(', ')}`);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`已成功导出 ${idList.length} 个文件`);
    }, 1000);
  };

  const deleteFile = (id: string) => {
    if (!canOperateFiles) return;
    setFiles(prev => prev.map(f => f.id === id ? { ...f, isDeleted: true } : f));
  };

  const restoreFile = (id: string) => {
    if (!canOperateFiles) return;
    setFiles(prev => prev.map(f => f.id === id ? { ...f, isDeleted: false } : f));
  };

  const batchRestore = () => {
    if (!canOperateFiles) return;
    setFiles(prev => prev.map(f => selectedIds.has(f.id) ? { ...f, isDeleted: false } : f));
    setSelectedIds(new Set());
    alert('选中的文件已成功还原');
  };

  const permanentlyDeleteFile = (id: string) => {
    if (!canOperateFiles) return;
    if (window.confirm('此操作将永久删除该文件且无法恢复，确定继续吗？')) {
      setFiles(prev => prev.filter(f => f.id !== id));
      const nextSelected = new Set(selectedIds);
      nextSelected.delete(id);
      setSelectedIds(nextSelected);
    }
  };

  const batchPermanentlyDelete = () => {
    if (!canOperateFiles) return;
    if (window.confirm(`此操作将永久删除选中的 ${selectedIds.size} 个文件且无法恢复，确定继续吗？`)) {
      setFiles(prev => prev.filter(f => !selectedIds.has(f.id)));
      setSelectedIds(new Set());
    }
  };

  const saveFileEdit = () => {
    if (!editingFile) return;
    setFiles(prev => prev.map(f => f.id === editingFile.id ? editingFile : f));
    setModalMode(null);
    setEditingFile(null);
  };

  const applyBatchTag = () => {
    if (!newBatchTagName.trim()) return;
    const tag = newBatchTagName.startsWith('#') ? newBatchTagName : `#${newBatchTagName}`;
    
    setFiles(prev => prev.map(f => {
      if (selectedIds.has(f.id)) {
        const nextTags = f.tags.includes(tag) ? f.tags : [...f.tags, tag];
        return { ...f, tags: nextTags };
      }
      return f;
    }));

    setNewBatchTagName('');
    setModalMode(null);
    setSelectedIds(new Set());
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
      const matchesTrash = !!f.isDeleted === isTrashView;
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

  const lastSelectedFile = useMemo(() => {
    if (selectedIds.size === 1) {
      const id = Array.from(selectedIds)[0];
      return files.find(f => f.id === id);
    }
    return null;
  }, [selectedIds, files]);

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
      case 'super_admin': return { label: '超级管理员', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: <Shield size={10}/> };
      case 'dept_admin': return { label: '部门管理员', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <UserCheck size={10}/> };
      case 'dept_collaborator': return { label: '部门协作者', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: <Edit size={10}/> };
      case 'viewer': return { label: '查看者', color: 'bg-slate-50 text-slate-500 border-slate-200', icon: <Eye size={10}/> };
    }
  };

  const RepoIcon = ({ name, active }: { name: string, active?: boolean }) => {
    const className = active ? "text-[#007FFF]" : "text-slate-400";
    switch (name) {
      case 'code': return <Code size={18} className={className} />;
      case 'briefcase': return <Briefcase size={18} className={className} />;
      case 'users': return <Users size={18} className={className} />;
      case 'shield': return <ShieldCheck size={18} className={className} />;
      default: return <Database size={18} className={className} />;
    }
  };

  const addTagToEditing = () => {
    if (!editingFile || !tagInput.trim()) return;
    const tag = tagInput.startsWith('#') ? tagInput : `#${tagInput}`;
    if (!editingFile.tags.includes(tag)) {
      setEditingFile({ ...editingFile, tags: [...editingFile.tags, tag] });
    }
    setTagInput('');
  };

  const removeTagFromEditing = (tag: string) => {
    if (!editingFile) return;
    setEditingFile({ ...editingFile, tags: editingFile.tags.filter(t => t !== tag) });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-100 bg-white flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#007FFF] rounded-lg flex items-center justify-center text-white font-bold text-xl">N</div>
          <span className="text-xl font-bold tracking-tight">NexusAI</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <NavItem icon={<Database size={20} />} label="知识仓库" active={currentView === 'repository'} onClick={() => { setCurrentView('repository'); setIsTrashView(false); setActiveRepoId(availableRepos[0]?.id || ''); }} />
          {canManageTemplates && (
            <NavItem icon={<Layers size={20} />} label="AI 模板" active={currentView === 'templates'} onClick={() => { setCurrentView('templates'); setIsTrashView(false); setActiveRepoId(availableRepos[0]?.id || ''); }} />
          )}
          
          <div className="pt-6 pb-2 px-2 text-xs font-semibold text-slate-300 uppercase tracking-widest">系统设置</div>
          {canInvite && (
             <NavItem icon={<Users size={20} />} label="团队管理" active={currentView === 'members'} onClick={() => setCurrentView('members')} />
          )}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-50">
          <div className="group relative">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
              <img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-slate-200" alt="Avatar" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate text-slate-700 leading-tight">{currentUser.name}</p>
                <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${getRoleBadge(currentUser.role).color}`}>
                  {getRoleBadge(currentUser.role).label}
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-2xl border border-slate-100 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none group-hover:pointer-events-auto">
                <p className="text-[10px] font-bold text-slate-300 px-2 py-1 uppercase tracking-widest">切换角色 (仅演示)</p>
                {MOCK_USERS.map(u => (
                    <button 
                        key={u.id}
                        onClick={() => { setCurrentUser(u); setCurrentView('repository'); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-50 flex items-center justify-between ${currentUser.id === u.id ? 'bg-blue-50 text-[#007FFF] font-bold' : 'text-slate-500'}`}
                    >
                        {u.name}
                        <span className="text-[10px] opacity-40">({u.role})</span>
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
             <aside className="w-64 border-r border-slate-50 bg-[#F9FAFB] flex flex-col shrink-0">
                <div className="p-4">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-4">部门知识库</p>
                    <div className="space-y-1">
                    {availableRepos.map(repo => (
                        <button
                        key={repo.id}
                        onClick={() => { setActiveRepoId(repo.id); setIsTrashView(false); setCurrentFolderId(null); setSelectedIds(new Set()); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeRepoId === repo.id && !isTrashView ? 'bg-white text-[#007FFF] shadow-sm' : 'text-slate-500 hover:bg-slate-100/50'}`}
                        >
                        {activeRepoId === repo.id && !isTrashView ? <ChevronRight size={14} className="text-[#007FFF]" /> : <RepoIcon name={repo.icon} active={false} />}
                        {repo.name}
                        </button>
                    ))}
                    </div>
                    
                    {currentView === 'repository' && canOperateFiles && (
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <button
                        onClick={() => { setIsTrashView(true); setActiveRepoId(''); setSelectedIds(new Set()); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isTrashView ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:bg-slate-100/50'}`}
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
              <div className="px-8 py-4 border-b border-slate-50 flex items-center justify-between shrink-0 h-16 relative">
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
                      className="p-1 hover:bg-slate-50 rounded-md text-slate-400 mr-2"
                    >
                      <ArrowLeft size={16} />
                    </button>
                  )}
                  <h2 className="text-lg font-bold text-slate-800">
                    {isTrashView ? '回收站' : currentRepo?.name}
                    {isViewer && <span className="ml-3 text-xs font-normal text-slate-300">(只读)</span>}
                  </h2>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="relative mr-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    <input 
                      type="text" 
                      placeholder="搜索文档、标签..." 
                      value={repoSearchQuery}
                      onChange={(e) => setRepoSearchQuery(e.target.value)}
                      className="w-56 bg-slate-50 border border-slate-100 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:bg-white focus:ring-4 focus:ring-blue-50/50 focus:border-blue-200 transition-all outline-none"
                    />
                  </div>

                  {currentView === 'repository' && !isTrashView && canOperateFiles && (
                    <>
                      <button 
                        onClick={() => setModalMode('newFolder')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                      >
                        <FolderPlus size={14} /> 新建文件夹
                      </button>
                      <button 
                        onClick={() => setModalMode('ingestion')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg border border-blue-100 text-[#007FFF] bg-blue-50/50 hover:bg-blue-50 transition-all shadow-sm`}
                      >
                        <UploadCloud size={14} /> 智能入库
                      </button>
                    </>
                  )}

                  {currentView === 'templates' && canManageTemplates && (
                    <button 
                        onClick={() => { setSelectedTemplate(null); setModalMode('create'); }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#007FFF] text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-100"
                    >
                        <Plus size={18} /> 新建模板
                    </button>
                  )}
                </div>

                {/* Bulk Action Bar - SLIDE DOWN OVERLAY */}
                {selectedIds.size > 0 && currentView === 'repository' && canOperateFiles && (
                  <div className="absolute inset-0 bg-slate-900 z-20 flex items-center justify-between px-8 animate-in slide-in-from-top duration-300">
                    <div className="flex items-center gap-6">
                       <button onClick={() => setSelectedIds(new Set())} className="text-slate-400 hover:text-white transition-colors">
                          <X size={20} />
                       </button>
                       <span className="text-white font-bold text-sm">已选中 {selectedIds.size} 项</span>
                    </div>
                    <div className="flex items-center gap-3">
                       {isTrashView ? (
                         <>
                            <button 
                              onClick={batchRestore}
                              className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all"
                            >
                               <RotateCcw size={14} /> 批量还原
                            </button>
                            <button 
                              onClick={batchPermanentlyDelete}
                              className="flex items-center gap-2 px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 transition-all"
                            >
                               <Trash2 size={14} /> 批量彻底删除
                            </button>
                         </>
                       ) : (
                         <>
                            <button 
                              onClick={() => setModalMode('batchTag')}
                              className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition-all"
                            >
                               <Tag size={14} /> 批量标签
                            </button>
                            <button 
                              onClick={() => handleExport(selectedIds)}
                              className="flex items-center gap-2 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all"
                            >
                               <FileArchive size={14} /> 批量导出
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm(`确定将选中的 ${selectedIds.size} 项移入回收站吗？`)) {
                                   selectedIds.forEach(id => deleteFile(id));
                                   setSelectedIds(new Set());
                                }
                              }}
                              className="flex items-center gap-2 px-4 py-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                            >
                               <Trash2 size={14} /> 批量删除
                            </button>
                         </>
                       )}
                    </div>
                  </div>
                )}
              </div>

              {/* View Rendering */}
              <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    {currentView === 'repository' ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-white sticky top-0 z-10">
                                <th className="px-8 py-4 w-10 text-center">
                                    <button 
                                    onClick={() => {
                                        if (selectedIds.size > 0) setSelectedIds(new Set());
                                        else {
                                        const all = new Set([...filteredFolders.map(f => f.id), ...filteredFiles.map(f => f.id)]);
                                        setSelectedIds(all);
                                        }
                                    }}
                                    className="text-slate-200 hover:text-slate-400"
                                    >
                                    {selectedIds.size > 0 ? <CheckSquare size={18} className="text-[#007FFF]" /> : <Square size={18} />}
                                    </button>
                                </th>
                                <th className="px-2 py-4 font-bold">名称</th>
                                <th className="px-4 py-4 font-bold">上传人</th>
                                <th className="px-4 py-4 font-bold">类型</th>
                                <th className="px-4 py-4 font-bold">标签</th>
                                <th className="px-4 py-4 font-bold">状态</th>
                                <th className="px-4 py-4 font-bold">上传时间</th>
                                <th className="px-4 py-4 font-bold">失效时间</th>
                                <th className="px-8 py-4 font-bold text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredFolders.map(folder => (
                                    <tr key={folder.id} className={`group hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedIds.has(folder.id) ? 'bg-blue-50/30' : ''}`}>
                                        <td className="px-8 py-4 text-center" onClick={(e) => { e.stopPropagation(); toggleSelection(folder.id); }}>
                                            {selectedIds.has(folder.id) ? <CheckSquare size={18} className="text-[#007FFF]" /> : <Square size={18} className="text-slate-200 group-hover:text-slate-300" />}
                                        </td>
                                        <td className="px-2 py-4" onClick={() => { setCurrentFolderId(folder.id); setSelectedIds(new Set()); }}>
                                            <div className="flex items-center gap-3">
                                                <FolderIcon size={18} className="text-[#007FFF] fill-blue-50/50" />
                                                <span className="text-sm font-bold text-slate-700">{folder.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-xs font-medium text-slate-400">—</td>
                                        <td className="px-4 py-4 text-xs font-medium text-slate-400">文件夹</td>
                                        <td className="px-4 py-4">—</td>
                                        <td className="px-4 py-4">—</td>
                                        <td className="px-4 py-4 text-xs text-slate-300 font-medium">2024-03-21</td>
                                        <td className="px-4 py-4 text-xs text-slate-300 font-medium">—</td>
                                        <td className="px-8 py-4 text-right">
                                            {canOperateFiles && (
                                                <button className="p-1.5 text-slate-200 hover:text-slate-500 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredFiles.map(file => (
                                    <tr key={file.id} className={`group hover:bg-slate-50/50 transition-all cursor-default ${selectedIds.has(file.id) ? 'bg-blue-50/30' : ''}`} onClick={() => toggleSelection(file.id)}>
                                        <td className="px-8 py-4 text-center">
                                            {selectedIds.has(file.id) ? <CheckSquare size={18} className="text-[#007FFF]" /> : <Square size={18} className="text-slate-200 group-hover:text-slate-300" />}
                                        </td>
                                        <td className="px-2 py-4 max-w-[280px]">
                                            <div className="flex items-center gap-3 relative">
                                                {['JPG', 'JPEG', 'PNG'].includes(file.type.toUpperCase()) ? <ImageIcon size={18} className="text-indigo-400 shrink-0" /> : <FileText size={18} className="text-slate-400 shrink-0" />}
                                                <p onClick={(e) => { e.stopPropagation(); setPreviewFile(file); setModalMode('preview'); }} className="text-sm font-bold text-slate-700 truncate hover:text-[#007FFF] cursor-pointer transition-colors">
                                                    {file.name}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 w-fit">
                                                <UserIcon size={12} className="text-slate-400" />
                                                {file.uploader}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{file.type}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                                                {file.tags.map(tag => <span key={tag} className="px-1.5 py-0.5 bg-slate-50 text-slate-400 text-[10px] font-bold rounded border border-slate-100">{tag}</span>)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase border ${getStatusInfo(file.status).color}`}>
                                                {getStatusInfo(file.status).label}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-xs text-slate-300 font-medium">{file.date}</td>
                                        <td className="px-4 py-4 text-xs text-slate-400 font-bold">
                                            {file.status === 'long_term' ? '—' : (file.expirationDate || '未设定')}
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {isTrashView ? (
                                                    <>
                                                        <button onClick={(e) => { e.stopPropagation(); restoreFile(file.id); }} className="p-1.5 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg" title="还原文件"><RotateCcw size={16} /></button>
                                                        <button onClick={(e) => { e.stopPropagation(); permanentlyDeleteFile(file.id); }} className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg" title="彻底删除"><Trash2 size={16} /></button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={(e) => { e.stopPropagation(); handleExport(new Set([file.id])); }} className="p-1.5 text-slate-300 hover:text-[#007FFF] hover:bg-blue-50 rounded-lg" title="下载导出"><Download size={16} /></button>
                                                        <button onClick={(e) => { e.stopPropagation(); setPreviewFile(file); setModalMode('preview'); }} className="p-1.5 text-slate-300 hover:text-[#007FFF] hover:bg-blue-50 rounded-lg" title="预览"><Eye size={16} /></button>
                                                        {canOperateFiles && (
                                                            <>
                                                                <button onClick={(e) => { e.stopPropagation(); setEditingFile({ ...file }); setModalMode('editFile'); }} className="p-1.5 text-slate-300 hover:text-[#007FFF] hover:bg-blue-50 rounded-lg" title="编辑属性与标签"><Edit size={16} /></button>
                                                                <button onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }} className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 bg-slate-50/20">
                            <div className="max-w-6xl mx-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredTemplates.map(template => (
                                        <div key={template.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all group relative">
                                            <div className="absolute top-4 right-4">
                                                <button onClick={() => { setSelectedTemplate(template); setModalMode('edit'); }} className="p-2 text-slate-200 hover:text-slate-500 hover:bg-slate-50 rounded-lg">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                            <div className="w-12 h-12 bg-blue-50/50 text-[#007FFF] rounded-xl flex items-center justify-center mb-4"><Zap size={24} /></div>
                                            <h3 className="font-bold text-slate-800 text-lg mb-2">{template.name}</h3>
                                            <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10 leading-relaxed">{template.description}</p>
                                            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">已处理 {template.usageCount} 次</span>
                                                <button onClick={() => { setSelectedTemplate(template); setModalMode('details'); }} className="text-sm font-bold text-[#007FFF] flex items-center gap-1 hover:underline underline-offset-4 transition-all">详情 <ChevronRight size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Info Sidebar */}
                {lastSelectedFile && (
                  <aside className="w-80 border-l border-slate-100 bg-white flex flex-col shrink-0 animate-in slide-in-from-right duration-300 overflow-y-auto">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                      <h4 className="font-bold text-slate-800 flex items-center gap-2"><Info size={18} className="text-[#007FFF]" /> 文件详情</h4>
                      <button onClick={() => setSelectedIds(new Set())} className="p-1 hover:bg-slate-50 rounded text-slate-300"><X size={16}/></button>
                    </div>
                    
                    <div className="p-6 space-y-8">
                        {/* File Visual */}
                        <div className="aspect-video bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-slate-200 relative group">
                            <FileText size={48} className="opacity-20" />
                            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <button onClick={() => { setPreviewFile(lastSelectedFile); setModalMode('preview'); }} className="flex items-center gap-2 px-4 py-2 bg-white text-[#007FFF] rounded-xl text-xs font-bold shadow-xl">全屏预览 <ExternalLink size={12}/></button>
                            </div>
                        </div>

                        {/* Title & Actions */}
                        <div>
                            <h5 className="font-black text-slate-800 text-lg leading-tight mb-2">{lastSelectedFile.name}</h5>
                            <div className="flex items-center gap-2">
                                <button onClick={() => { setEditingFile({ ...lastSelectedFile }); setModalMode('editFile'); }} className="flex items-center gap-1 text-[10px] font-black text-[#007FFF] uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-lg border border-blue-100"><Edit size={12}/> 编辑内容</button>
                                <button onClick={() => handleExport(new Set([lastSelectedFile.id]))} className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg border border-slate-100"><Download size={12}/> 导出文件</button>
                            </div>
                        </div>

                        {/* Summary Section */}
                        <div className="p-4 bg-[#F9FAFB] rounded-2xl border border-slate-100 relative">
                            <div className="absolute -top-3 left-4 px-2 bg-white border border-slate-100 rounded-lg flex items-center gap-1.5 py-0.5">
                                <Sparkles size={10} className="text-[#007FFF]" />
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AI 语义摘要</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium italic pt-2">
                                {lastSelectedFile.summary}
                            </p>
                        </div>

                        {/* Metadata List */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">存储状态</span>
                                <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-black uppercase tracking-widest ${getStatusInfo(lastSelectedFile.status).color}`}>
                                    {getStatusInfo(lastSelectedFile.status).label}
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">上传人</span>
                                <span className="text-slate-600 font-bold">{lastSelectedFile.uploader}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">文件大小</span>
                                <span className="text-slate-600 font-bold">{lastSelectedFile.size}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">所属库</span>
                                <span className="text-slate-600 font-bold">{MOCK_REPOS.find(r => r.id === lastSelectedFile.repoId)?.name}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">上传时间</span>
                                <span className="text-slate-600 font-bold">{lastSelectedFile.date}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">失效时间</span>
                                <span className={`text-slate-600 font-bold ${lastSelectedFile.status === 'long_term' ? 'text-slate-300' : ''}`}>
                                    {lastSelectedFile.status === 'long_term' ? '—' : (lastSelectedFile.expirationDate || '未设定')}
                                </span>
                            </div>
                        </div>

                        {/* Tags Section */}
                        <div className="space-y-3 pt-2">
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">智能标签</span>
                            <div className="flex flex-wrap gap-2">
                                {lastSelectedFile.tags.map(t => (
                                    <span key={t} className="px-2 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500 flex items-center gap-1 shadow-sm">
                                        <Tag size={10} className="text-[#007FFF]" /> {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                  </aside>
                )}
              </div>
            </div>
          </div>
        ) : (
          <TeamManagement 
             activeDeptFilterId={activeDeptFilterId}
             setActiveDeptFilterId={setActiveDeptFilterId}
             currentUser={currentUser}
             getRoleBadge={getRoleBadge}
             isSuperAdmin={isSuperAdmin}
             isDeptAdmin={isDeptAdmin}
             setModalMode={setModalMode}
          />
        )}

        {/* Modal Logic */}
        {modalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
            <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all transform animate-in fade-in zoom-in duration-200 ${['ingestion', 'preview', 'invite', 'details', 'batchTag', 'editFile'].includes(modalMode) ? 'w-full max-w-4xl' : 'w-full max-w-xl'}`}>
              <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    {modalMode === 'ingestion' && <Sparkles className="text-[#007FFF]" size={24} />}
                    {modalMode === 'details' && <Info className="text-[#007FFF]" size={24} />}
                    {modalMode === 'batchTag' && <Tag className="text-[#007FFF]" size={24} />}
                    {(modalMode === 'create' || modalMode === 'edit') && <Zap className="text-[#007FFF]" size={24} />}
                    <h3 className="text-xl font-bold text-slate-800">
                    {modalMode === 'invite' ? '邀请协作者' : 
                    modalMode === 'newFolder' ? '新建文件夹' : 
                    modalMode === 'preview' ? '文件预览' : 
                    modalMode === 'ingestion' ? '智能文档入库' :
                    modalMode === 'details' ? '模板详情' :
                    modalMode === 'batchTag' ? '批量打标' :
                    modalMode === 'create' ? '新建 AI 模板' :
                    modalMode === 'edit' ? '编辑 AI 模板' :
                    modalMode === 'editFile' ? '编辑文件属性与标签' :
                    '操作'}
                    </h3>
                </div>
                <button onClick={() => setModalMode(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 transition-colors"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                  {modalMode === 'invite' && (
                      <div className="space-y-6">
                          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
                              <Key className="text-[#007FFF] shrink-0" size={24}/>
                              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                  您正在为 <span className="font-bold text-[#007FFF]">{activeDeptFilterId !== 'all' ? MOCK_REPOS.find(r => r.id === activeDeptFilterId)?.name : currentRepo?.name}</span> 邀请新成员。
                              </p>
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">邮箱地址 / 钉钉号</label>
                              <input type="text" placeholder="输入邮箱或通过组织架构搜索..." className="w-full px-4 py-3 rounded-xl border border-slate-100 outline-none focus:border-[#007FFF] focus:ring-4 focus:ring-blue-50/50 transition-all font-medium"/>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-2">角色授权</label>
                                  <select className="w-full px-4 py-3 rounded-xl border border-slate-100 outline-none bg-white font-medium cursor-pointer">
                                      <option>部门协作者 (可读写)</option>
                                      <option>查看者 (只读)</option>
                                      {isSuperAdmin && <option>部门管理员</option>}
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-2">有效期</label>
                                  <select className="w-full px-4 py-3 rounded-xl border border-slate-100 outline-none bg-white font-medium cursor-pointer">
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
                        <input value={newFolderName} onChange={e => setNewFolderName(e.target.value)} autoFocus placeholder="输入名称..." className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:border-[#007FFF] outline-none font-bold text-slate-700"/>
                    </div>
                  )}

                  {modalMode === 'batchTag' && (
                    <div className="space-y-6">
                        <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex gap-4">
                            <Tag className="text-indigo-600 shrink-0" size={24}/>
                            <div>
                                <p className="text-sm text-slate-600 leading-relaxed font-bold">批量追加标签</p>
                                <p className="text-xs text-slate-400 mt-1 font-medium italic">系统将为选中的 {selectedIds.size} 个文件追加新标签，已有的标签将被保留。</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-slate-700">新标签名称</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-lg">#</span>
                                <input 
                                    value={newBatchTagName} 
                                    onChange={e => setNewBatchTagName(e.target.value)} 
                                    autoFocus 
                                    placeholder="输入标签名，如：核心资料、2024项目..." 
                                    className="w-full pl-8 pr-4 py-4 rounded-2xl border border-slate-100 focus:border-indigo-500 outline-none font-bold text-slate-700 text-lg shadow-sm transition-all"
                                />
                            </div>
                        </div>
                    </div>
                  )}

                  {modalMode === 'preview' && previewFile && (
                    <div className="space-y-6">
                        <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl">
                            <h4 className="font-bold text-xl text-slate-800 mb-1 leading-tight">{previewFile.name}</h4>
                            <p className="text-sm text-slate-400 font-medium leading-relaxed">{previewFile.summary}</p>
                        </div>
                        <div className="bg-white border border-slate-100 rounded-2xl p-10 min-h-[300px] flex flex-col items-center justify-center text-slate-300 italic">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4"><FileSearch size={32} className="opacity-20" /></div>
                            <p className="font-medium">内容预览受权限控制，当前仅供 {currentUser.role} 角色调阅</p>
                        </div>
                    </div>
                  )}

                  {modalMode === 'editFile' && editingFile && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">文件名称</label>
                                    <input 
                                        type="text" 
                                        value={editingFile.name} 
                                        onChange={(e) => setEditingFile({...editingFile, name: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-100 outline-none focus:border-[#007FFF] focus:ring-4 focus:ring-blue-50/50 transition-all font-bold text-slate-700 shadow-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">有效期状态</label>
                                        <select 
                                            value={editingFile.status}
                                            onChange={(e) => setEditingFile({...editingFile, status: e.target.value as ValidityStatus})}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-100 outline-none bg-white font-bold text-slate-600 cursor-pointer shadow-sm"
                                        >
                                            <option value="long_term">长期有效</option>
                                            <option value="valid">有效期内</option>
                                            <option value="expiring">临期</option>
                                            <option value="expired">已过期</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">失效时间</label>
                                        <input 
                                            type="date" 
                                            disabled={editingFile.status === 'long_term'}
                                            value={editingFile.expirationDate || ''}
                                            onChange={(e) => setEditingFile({...editingFile, expirationDate: e.target.value})}
                                            className={`w-full px-4 py-3 rounded-xl border border-slate-100 outline-none font-bold text-slate-700 shadow-sm ${editingFile.status === 'long_term' ? 'bg-slate-50 text-slate-300' : 'focus:border-[#007FFF]'}`}
                                        />
                                    </div>
                                </div>
                                {/* Tags Editor Integration */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">标签管理</label>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 min-h-[100px] space-y-4 shadow-inner">
                                        <div className="flex flex-wrap gap-2">
                                            {editingFile.tags.map(tag => (
                                                <span key={tag} className="px-2 py-1 bg-white border border-slate-100 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-1.5 shadow-sm group">
                                                    {tag}
                                                    <button onClick={() => removeTagFromEditing(tag)} className="text-slate-300 hover:text-rose-500 transition-colors">
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs font-bold">#</span>
                                                <input 
                                                   type="text"
                                                   value={tagInput}
                                                   onChange={e => setTagInput(e.target.value)}
                                                   onKeyDown={e => e.key === 'Enter' && addTagToEditing()}
                                                   placeholder="输入新标签..."
                                                   className="w-full pl-7 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-[#007FFF] transition-all"
                                                />
                                            </div>
                                            <button 
                                                onClick={addTagToEditing}
                                                className="p-2 bg-[#007FFF] text-white rounded-xl shadow-lg shadow-blue-100 hover:brightness-110 transition-all"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="p-6 bg-blue-50/30 rounded-2xl border border-blue-100 relative group h-full">
                                    <div className="absolute -top-3 left-4 px-2 bg-white border border-blue-100 rounded-lg flex items-center gap-1.5 py-0.5">
                                        <Sparkles size={10} className="text-[#007FFF]" />
                                        <span className="text-[9px] font-black text-[#007FFF] uppercase tracking-widest">AI 摘要编辑器</span>
                                    </div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest pt-1">当前选中的摘要字段</label>
                                    <textarea 
                                        rows={12} 
                                        value={editingFile.summary} 
                                        onChange={(e) => setEditingFile({...editingFile, summary: e.target.value})}
                                        placeholder="此处为 AI 自动生成的语义摘要..."
                                        className="w-full bg-transparent outline-none text-sm font-medium text-slate-600 leading-relaxed resize-none scrollbar-hide"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                  )}

                  {modalMode === 'ingestion' && (
                    <div className="space-y-8 h-full flex flex-col">
                        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
                            <button className="px-6 py-2 text-xs font-black rounded-lg transition-all tracking-widest uppercase bg-white text-[#007FFF] shadow-sm">智能识别模式</button>
                        </div>

                        <div className="flex-1 space-y-6">
                            <div className="flex-1 min-h-[280px] bg-blue-50/30 rounded-3xl border-2 border-dashed border-blue-100 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50/50 transition-all group p-10">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-50/50 mb-6 group-hover:scale-110 transition-transform"><UploadCloud className="text-[#007FFF]" size={32} /></div>
                                <h4 className="font-bold text-slate-800 text-lg">拖拽文件或点击上传</h4>
                                <p className="text-xs text-slate-400 mt-2 font-medium">支持 PDF, Word, Excel, JPG, PNG (最大 50MB)</p>
                                <div className="mt-8">
                                    <div className="flex items-center gap-2 px-6 py-2 bg-[#007FFF] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 group-hover:brightness-110 transition-all">
                                        <Sparkles size={14} /> AI 自动提取
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">首选 AI 模板</p>
                                    <div className="relative">
                                      <select className="w-full bg-white border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-600 outline-none cursor-pointer appearance-none">
                                          <option>自动检测最佳模板</option>
                                          {MOCK_TEMPLATES.filter(t => t.repoId === activeRepoId).map(t => <option key={t.id}>{t.name}</option>)}
                                      </select>
                                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">目标文件夹</p>
                                    <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-600 shadow-sm">
                                        <FolderIcon size={14} className="text-[#007FFF]" /> {currentFolderId ? folders.find(f => f.id === currentFolderId)?.name : '根目录'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  )}

                  {(modalMode === 'create' || modalMode === 'edit') && (
                      <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-8">
                              <div className="space-y-6">
                                  <div>
                                      <label className="block text-sm font-bold text-slate-700 mb-2">模板名称</label>
                                      <input type="text" defaultValue={selectedTemplate?.name} placeholder="如：销售合同、研发周报" className="w-full px-4 py-3 rounded-xl border border-slate-100 outline-none focus:border-[#007FFF] transition-all font-bold text-slate-700"/>
                                  </div>
                                  <div>
                                      <label className="block text-sm font-bold text-slate-700 mb-2">模板描述</label>
                                      <textarea rows={4} defaultValue={selectedTemplate?.description} placeholder="说明此模板适用于哪些类型的文档..." className="w-full px-4 py-3 rounded-xl border border-slate-100 outline-none focus:border-[#007FFF] transition-all resize-none font-medium text-slate-500 leading-relaxed"></textarea>
                                  </div>
                              </div>
                              <div className="space-y-6">
                                  <div>
                                      <label className="block text-sm font-bold text-slate-700 mb-2">默认标签</label>
                                      <div className="flex flex-wrap gap-2 p-4 bg-slate-50/50 border border-slate-50 rounded-2xl min-h-[60px]">
                                          {selectedTemplate?.defaultTags.map(tag => (
                                              <span key={tag} className="px-2 py-1 bg-white border border-slate-100 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-1.5 shadow-sm">
                                                  {tag} <X size={12} className="text-slate-300 hover:text-rose-500 cursor-pointer transition-colors" />
                                              </span>
                                          ))}
                                          <button className="text-[10px] font-black text-[#007FFF] flex items-center gap-1 uppercase tracking-widest px-2 py-1 bg-white rounded-lg border border-[#007FFF]/20">+ 添加</button>
                                      </div>
                                  </div>
                                  <div>
                                      <label className="block text-sm font-bold text-slate-700 mb-2">有效期提取逻辑</label>
                                      <select className="w-full px-4 py-3 rounded-xl border border-slate-100 outline-none bg-white font-bold text-slate-600 cursor-pointer">
                                          <option>根据文件内容自动识别</option>
                                          <option>固定 30 天</option>
                                          <option>固定 1 年</option>
                                          <option>永久有效</option>
                                      </select>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}

                  {modalMode === 'details' && selectedTemplate && (
                      <div className="space-y-10">
                          <div className="flex gap-8 items-start">
                              <div className="w-20 h-20 bg-blue-50/50 text-[#007FFF] rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-50/50"><Zap size={40} /></div>
                              <div className="flex-1">
                                  <h4 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">{selectedTemplate.name}</h4>
                                  <p className="text-slate-400 font-medium leading-relaxed mb-6 text-lg">{selectedTemplate.description}</p>
                                  <div className="flex gap-4">
                                      <div className="px-6 py-3 bg-slate-50 border border-slate-50 rounded-2xl shadow-sm">
                                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">使用频率</p>
                                          <p className="text-xl font-bold text-slate-700">{selectedTemplate.usageCount} <span className="text-xs font-medium text-slate-400 ml-1">次</span></p>
                                      </div>
                                      <div className="px-6 py-3 bg-slate-50 border border-slate-50 rounded-2xl shadow-sm">
                                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">默认标签</p>
                                          <div className="flex gap-2 mt-1">
                                              {selectedTemplate.defaultTags.map(t => <span key={t} className="text-xs font-black text-[#007FFF] tracking-wider">{t}</span>)}
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <div className="space-y-6">
                              <h5 className="font-bold text-slate-800 flex items-center gap-2 text-lg">样例文件库 <FileCheck size={20} className="text-emerald-500" /></h5>
                              <div className="grid grid-cols-2 gap-4">
                                  {selectedTemplate.sampleFiles?.map(sample => (
                                      <div key={sample} className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-slate-50/50 transition-all cursor-pointer shadow-sm">
                                          <div className="flex items-center gap-4">
                                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-300 border border-slate-50"><FileText size={24} /></div>
                                              <div>
                                                <p className="text-sm font-bold text-slate-700 leading-tight">{sample}</p>
                                                <p className="text-[10px] text-slate-400 mt-1 font-medium">1.2 MB · PDF</p>
                                              </div>
                                          </div>
                                          <button onClick={() => handleExport(new Set(['mock_sample_id']))} className="p-2.5 text-slate-200 hover:text-[#007FFF] hover:bg-white rounded-xl transition-all shadow-sm"><Download size={20} /></button>
                                      </div>
                                  ))}
                                  <button className="border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center p-6 text-slate-300 hover:border-[#007FFF]/30 hover:text-[#007FFF] hover:bg-blue-50/10 transition-all duration-300 group">
                                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2 group-hover:bg-[#007FFF]/10 transition-colors"><Plus size={20} /></div>
                                      <span className="text-[10px] font-black uppercase tracking-widest">上传样例训练 AI</span>
                                  </button>
                              </div>
                          </div>
                      </div>
                  )}
              </div>

              <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex justify-end gap-3 shrink-0">
                <button onClick={() => setModalMode(null)} className="px-6 py-2.5 font-bold text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all">取消</button>
                <button 
                  onClick={modalMode === 'newFolder' ? createFolder : modalMode === 'ingestion' ? handleUploadComplete : modalMode === 'editFile' ? saveFileEdit : modalMode === 'batchTag' ? applyBatchTag : () => setModalMode(null)}
                  disabled={isProcessing}
                  className={`px-8 py-2.5 text-white font-black rounded-xl shadow-lg hover:brightness-110 flex items-center gap-2 min-w-[140px] justify-center transition-all active:scale-95 ${modalMode === 'batchTag' ? 'bg-indigo-600 shadow-indigo-100' : 'bg-[#007FFF] shadow-blue-100'}`}
                >
                  {isProcessing ? (
                      <>
                        <RefreshCcw className="animate-spin" size={18} />
                        处理中...
                      </>
                  ) : (
                      modalMode === 'invite' ? '发送邀请' : 
                      modalMode === 'ingestion' ? '开始入库' :
                      modalMode === 'details' ? '应用模板' :
                      modalMode === 'editFile' ? '保存修改' :
                      modalMode === 'batchTag' ? '确认并打标' :
                      '确认并保存'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Separate components for better readability
function TeamManagement({ activeDeptFilterId, setActiveDeptFilterId, currentUser, getRoleBadge, isSuperAdmin, isDeptAdmin, setModalMode }: any) {
  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Team Management Header */}
        <div className="px-8 py-6 flex items-center justify-between shrink-0">
            <div>
               <h2 className="text-2xl font-bold text-slate-800 tracking-tight">团队管理</h2>
               <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">管理全平台成员及权限等级</p>
            </div>
            <button onClick={() => setModalMode('invite')} className="flex items-center gap-2 px-4 py-2 bg-[#007FFF] text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100">
               <UserPlus size={16}/> 邀请成员
            </button>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
            {/* Department Tree Sidebar */}
            <aside className="w-64 border-r border-slate-50 bg-white flex flex-col shrink-0 px-4">
                <div className="py-2">
                    <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest px-2 mb-4">部门架构</p>
                    <div className="space-y-1">
                        <button onClick={() => setActiveDeptFilterId('all')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-all ${activeDeptFilterId === 'all' ? 'bg-blue-50/50 text-[#007FFF]' : 'text-slate-500 hover:bg-slate-50'}`}>
                            <LayoutGrid size={16} /> 全平台
                        </button>
                        {MOCK_REPOS.map(repo => (
                            <button key={repo.id} onClick={() => setActiveDeptFilterId(repo.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-all ${activeDeptFilterId === repo.id ? 'bg-blue-50/50 text-[#007FFF]' : 'text-slate-500 hover:bg-slate-50'}`}>
                                <Code size={16} className={activeDeptFilterId === repo.id ? "text-[#007FFF]" : "text-slate-400"} />
                                {repo.name}
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Team Members List Area */}
            <div className="flex-1 bg-white overflow-y-auto px-8 pb-8">
                <div className="border border-slate-50 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="px-8 py-4 font-bold">成员姓名</th>
                                <th className="px-6 py-4 font-bold">角色权限</th>
                                <th className="px-6 py-4 font-bold">对应部门/库</th>
                                <th className="px-6 py-4 font-bold">最后在线</th>
                                <th className="px-8 py-4 font-bold text-right">管理</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {MOCK_USERS.filter(u => activeDeptFilterId === 'all' || u.deptId === activeDeptFilterId).map(user => (
                                <tr key={user.id} className="bg-white hover:bg-slate-50/20 transition-colors group">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatar} className="w-8 h-8 rounded-full border border-slate-100" />
                                            <div>
                                                <p className="text-sm font-bold text-slate-700 leading-tight">{user.name}</p>
                                                <p className="text-[10px] text-slate-300 font-medium">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${getRoleBadge(user.role).color}`}>
                                            {getRoleBadge(user.role).label}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-slate-500">
                                            {user.role === 'super_admin' ? '全平台' : MOCK_REPOS.find(r => r.id === user.deptId)?.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-300 font-medium tracking-tight">{user.lastLogin}</td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {(isSuperAdmin || (isDeptAdmin && user.deptId === currentUser.deptId)) && user.id !== currentUser.id && (
                                                <>
                                                    <button className="p-2 text-slate-300 hover:text-[#007FFF] hover:bg-blue-50/50 rounded-lg transition-all" title="编辑权限"><Edit size={16}/></button>
                                                    <button className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="移除成员"><UserMinus size={16}/></button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all shrink-0 ${
        active 
          ? 'bg-blue-50/80 text-[#007FFF] shadow-sm' 
          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
      }`}
    >
      <span className={active ? 'text-[#007FFF]' : 'text-slate-300 group-hover:text-slate-400'}>{icon}</span>
      {label}
    </button>
  );
}
