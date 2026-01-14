
import React, { useState, useMemo } from 'react';
import { 
  UploadCloud, 
  Database, 
  Settings, 
  Search, 
  Bell, 
  ChevronRight,
  FileText,
  Activity,
  CheckCircle2,
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
  Filter,
  RefreshCcw,
  MoreHorizontal,
  Layers,
  Sparkles,
  Zap,
  Target,
  X,
  Edit,
  Eye,
  Save,
  FileUp,
  Paperclip,
  FolderOpen,
  Tag,
  Calendar,
  Check
} from 'lucide-react';
import { ViewState, FileItem, Folder, Repository, ValidityStatus, AITemplate } from './types';

// Mock Data
const MOCK_REPOS: Repository[] = [
  { id: 'repo_rd', name: '研发中心知识库', icon: 'code' },
  { id: 'repo_bid', name: '投标支持部', icon: 'briefcase' },
  { id: 'repo_hr', name: '人力资源共享', icon: 'users' },
  { id: 'repo_legal', name: '法务风控中心', icon: 'shield' },
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
    id: 't3', 
    name: '投标业绩', 
    description: '管理历史投标案例，自动提取中标金额与核心技术点', 
    repoId: 'repo_bid', 
    defaultTags: ['#业绩'], 
    validityRule: '长期有效', 
    usageCount: 89,
    sampleFiles: ['Sample_Winning_Bid_Project_A.pdf', 'Sample_Winning_Bid_Project_B.pdf']
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

const MOCK_FOLDERS: Folder[] = [
  { id: 'f1', name: '技术架构', parentId: null, repoId: 'repo_rd' },
  { id: 'f2', name: 'UI 规范', parentId: null, repoId: 'repo_rd' },
  { id: 'f3', name: '历史中标项目', parentId: null, repoId: 'repo_bid' },
];

const INITIAL_FILES: FileItem[] = [
  { id: '1', name: '2024Q1研发进度周报.docx', type: 'DOCX', size: '2.4 MB', date: '2024-03-20', tags: ['#研发', '#周报'], summary: '本周研发团队完成了后端 API 的重构...', status: 'valid', folderId: 'f1' },
  { id: '2', name: '产品设计规范 V2.0.pdf', type: 'PDF', size: '15.1 MB', date: '2024-03-18', tags: ['#产品', '#设计规范'], summary: '定义了全系统的主色调、字体比例及交互动效准则。', status: 'long_term', folderId: 'f2' },
  { id: '3', name: '智慧城市投标方案_v1.pdf', type: 'PDF', size: '4.2 MB', date: '2024-03-15', tags: ['#业绩', '#投标'], summary: '针对某市智慧园区建设的完整投标方案及报价。', status: 'long_term', folderId: 'f3' },
  { id: '7', name: '某省交通大脑二期工程中标通知书.pdf', type: 'PDF', size: '1.2 MB', date: '2024-03-10', tags: ['#业绩', '#政务'], summary: '官方下发的中标通知文件，包含项目主体信息及工期。', status: 'long_term', folderId: 'f3' },
  { id: '8', name: '核心商业圈5G基站建设投标方案.docx', type: 'DOCX', size: '8.5 MB', date: '2024-02-28', tags: ['#业绩', '#通信'], summary: '关于 5G 微基站覆盖方案的详细技术描述与实施规划。', status: 'long_term', folderId: 'f3' },
  { id: '9', name: '2023年度能源管理平台投标全量素材.zip', type: 'ZIP', size: '142 MB', date: '2023-12-15', tags: ['#业绩', '#能源'], summary: '包含商务标、技术标及所有附件素材的完整归档。', status: 'long_term', folderId: 'f3' },
  { id: '4', name: '核心算法专利申报.docx', type: 'DOCX', size: '1.1 MB', date: '2024-03-10', tags: ['#法务', '#研发'], summary: '描述了 NexusAI 的语义向量索引优化算法。', status: 'long_term', folderId: null },
  { id: '5', name: '过期推广素材-2023.zip', type: 'ZIP', size: '84 MB', date: '2023-12-01', tags: ['#历史', '#归档'], summary: '2023年度已下架的广告素材。', status: 'expired', folderId: null },
  { id: '6', name: '误删的项目草案.txt', type: 'TXT', size: '12 KB', date: '2024-01-10', tags: ['#临时'], summary: '一份早期的草稿。', status: 'valid', isDeleted: true, folderId: null },
];

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('repository');
  const [activeRepoId, setActiveRepoId] = useState<string>('repo_rd');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isTrashView, setIsTrashView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  
  // Interaction States
  const [modalMode, setModalMode] = useState<'create' | 'details' | 'edit' | 'ingestion' | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<AITemplate | null>(null);
  const [ingestionTab, setIngestionTab] = useState<'manual' | 'smart'>('smart');

  const handleUploadComplete = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setModalMode(null);
    }, 2500);
  };

  const deleteFile = (id: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, isDeleted: true } : f));
  };

  const restoreFile = (id: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, isDeleted: false } : f));
  };

  const currentRepo = MOCK_REPOS.find(r => r.id === activeRepoId);

  const filteredFolders = useMemo(() => {
    if (isTrashView) return [];
    return MOCK_FOLDERS.filter(f => f.repoId === activeRepoId && f.parentId === currentFolderId);
  }, [activeRepoId, currentFolderId, isTrashView]);

  const filteredFiles = useMemo(() => {
    return files.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            f.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTrash = f.isDeleted === isTrashView;
      const matchesFolder = isTrashView ? true : f.folderId === currentFolderId;

      return matchesSearch && matchesTrash && (isTrashView ? true : (matchesFolder));
    });
  }, [files, searchQuery, isTrashView, currentFolderId, activeRepoId]);

  const filteredTemplates = useMemo(() => {
    return MOCK_TEMPLATES.filter(t => t.repoId === activeRepoId);
  }, [activeRepoId]);

  const getStatusInfo = (status: ValidityStatus) => {
    switch (status) {
      case 'long_term': return { label: '长期有效', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: <ShieldCheck size={12} /> };
      case 'valid': return { label: '有效期内', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <Clock size={12} /> };
      case 'expiring': return { label: '临期', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: <AlertTriangle size={12} /> };
      case 'expired': return { label: '已过期', color: 'bg-rose-50 text-rose-600 border-rose-100', icon: <XCircle size={12} /> };
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

  const RepositorySubSidebar = () => (
    <aside className="w-64 border-r border-slate-100 bg-slate-50/50 flex flex-col shrink-0">
      <div className="p-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-4">部门知识库</p>
        <div className="space-y-1">
          {MOCK_REPOS.map(repo => (
            <button
              key={repo.id}
              onClick={() => { setActiveRepoId(repo.id); setIsTrashView(false); setCurrentFolderId(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeRepoId === repo.id && !isTrashView ? 'bg-white text-[#007FFF] shadow-sm border border-slate-100' : 'text-slate-600 hover:bg-slate-200/50'}`}
            >
              <RepoIcon name={repo.icon} />
              {repo.name}
            </button>
          ))}
        </div>
        
        {currentView === 'repository' && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={() => { setIsTrashView(true); setActiveRepoId(''); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isTrashView ? 'bg-slate-200 text-slate-900 shadow-inner' : 'text-slate-500 hover:bg-slate-200/50'}`}
            >
              <Trash2 size={18} />
              回收站
            </button>
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#007FFF] rounded-lg flex items-center justify-center text-white font-bold text-xl">N</div>
          <span className="text-xl font-bold tracking-tight">NexusAI</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <NavItem icon={<Database size={20} />} label="知识仓库" active={currentView === 'repository'} onClick={() => { setCurrentView('repository'); setIsTrashView(false); setActiveRepoId(MOCK_REPOS[0].id); }} />
          <NavItem icon={<Layers size={20} />} label="AI 模板" active={currentView === 'templates'} onClick={() => { setCurrentView('templates'); setIsTrashView(false); setActiveRepoId(MOCK_REPOS[0].id); }} />
          <div className="pt-6 pb-2 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">系统设置</div>
          <NavItem icon={<Settings size={20} />} label="账户与偏好" active={currentView === 'settings'} onClick={() => setCurrentView('settings')} />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
            <img src="https://picsum.photos/seed/user/40/40" className="w-10 h-10 rounded-full border border-slate-200" alt="Avatar" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-slate-700 group-hover:text-slate-900">张小钉</p>
              <p className="text-xs text-slate-500 truncate">数字化管理师</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {currentView === 'repository' ? (
          <div className="flex-1 flex overflow-hidden">
            <RepositorySubSidebar />

            {/* Repository Main Area */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              {/* Toolbar */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  {currentFolderId && (
                    <button 
                      onClick={() => setCurrentFolderId(null)}
                      className="p-1 hover:bg-slate-100 rounded-md text-slate-500 mr-2"
                    >
                      <ArrowLeft size={16} />
                    </button>
                  )}
                  <h2 className="text-lg font-bold text-slate-800">
                    {isTrashView ? '回收站' : currentRepo?.name}
                  </h2>
                  {!isTrashView && (
                    <div className="flex items-center gap-1 ml-2">
                      <ChevronRight size={14} className="text-slate-300" />
                      <span className="text-sm font-medium text-slate-400">
                        {currentFolderId ? MOCK_FOLDERS.find(f => f.id === currentFolderId)?.name : '根目录'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {!isTrashView && (
                    <button 
                      onClick={() => { setModalMode('ingestion'); setIngestionTab('smart'); }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-blue-100 text-[#007FFF] bg-blue-50 hover:bg-blue-100 transition-all`}
                    >
                      <UploadCloud size={14} /> 智能入库
                    </button>
                  )}
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
                    <Filter size={14} /> 筛选
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
                    <History size={14} /> 最近活动
                  </button>
                </div>
              </div>

              {/* Explorer Content */}
              <div className="flex-1 overflow-y-auto mt-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                      <th className="px-6 py-3 font-semibold">名称</th>
                      <th className="px-4 py-3 font-semibold">类型</th>
                      <th className="px-4 py-3 font-semibold">标签</th>
                      <th className="px-4 py-3 font-semibold">有效期状态</th>
                      <th className="px-4 py-3 font-semibold">最后更新</th>
                      <th className="px-6 py-3 font-semibold text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {/* Folders */}
                    {filteredFolders.map(folder => (
                      <tr 
                        key={folder.id} 
                        className="group hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => setCurrentFolderId(folder.id)}
                      >
                        <td className="px-6 py-4">
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
                          <button className="p-1.5 text-slate-300 hover:text-slate-600 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* Files */}
                    {filteredFiles.map(file => {
                      const statusInfo = getStatusInfo(file.status);
                      return (
                        <tr key={file.id} className="group hover:bg-slate-50 transition-all cursor-default">
                          <td className="px-6 py-4 max-w-[280px]">
                            <div className="flex items-center gap-3">
                              <FileText size={20} className="text-slate-400 shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-700 truncate">{file.name}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{file.size}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              {file.type}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                              {file.tags.map(tag => (
                                <span key={tag} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-bold ${statusInfo.color}`}>
                              {statusInfo.icon}
                              {statusInfo.label}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-xs text-slate-400 font-medium">{file.date}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {isTrashView ? (
                                <>
                                  <button 
                                    onClick={() => restoreFile(file.id)}
                                    className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                                    title="还原"
                                  >
                                    <RefreshCcw size={16} />
                                  </button>
                                  <button className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="彻底删除">
                                    <Trash2 size={16} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button className="p-1.5 text-slate-400 hover:text-[#007FFF] hover:bg-blue-50 rounded-lg transition-all" title="编辑有效期">
                                    <Clock size={16} />
                                  </button>
                                  <button 
                                    onClick={() => deleteFile(file.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                    title="移至回收站"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredFiles.length === 0 && filteredFolders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-20 text-center text-slate-400">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Database size={32} className="opacity-20" />
                          </div>
                          <p className="font-medium">当前目录下没有内容</p>
                          <p className="text-xs mt-1">您可以上传新文件或创建文件夹</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer / Pagination */}
              <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 shrink-0">
                <span>共 {filteredFiles.length + filteredFolders.length} 个项目</span>
                <div className="flex items-center gap-4">
                  <button className="hover:text-slate-900 transition-colors">上一页</button>
                  <div className="flex gap-1">
                    <span className="w-6 h-6 flex items-center justify-center bg-[#007FFF] text-white rounded">1</span>
                    <span className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded cursor-pointer">2</span>
                  </div>
                  <button className="hover:text-slate-900 transition-colors">下一页</button>
                </div>
              </div>
            </div>
          </div>
        ) : currentView === 'templates' ? (
          <div className="flex-1 flex overflow-hidden relative">
            <RepositorySubSidebar />
            
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              {/* Toolbar */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    {currentRepo?.name} - AI 模板库
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">管理该知识库下特定文档的自动化打标与有效期规则</p>
                </div>
                <button 
                  onClick={() => setModalMode('create')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#007FFF] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm"
                >
                  <Plus size={18} />
                  新建模板
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
                <div className="max-w-6xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredTemplates.map(template => (
                      <div key={template.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group relative">
                        <div className="absolute top-4 right-4">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTemplate(template);
                              setModalMode('edit');
                            }}
                            className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <MoreVertical size={18} />
                          </button>
                        </div>
                        
                        <div className="w-12 h-12 bg-blue-50 text-[#007FFF] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Zap size={24} />
                        </div>

                        <h3 className="font-bold text-slate-800 text-lg mb-2">{template.name}</h3>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">{template.description}</p>

                        <div className="space-y-3 pt-4 border-t border-slate-50">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400 flex items-center gap-1.5"><Clock size={14} /> 有效期逻辑</span>
                            <span className="font-semibold text-blue-600">{template.validityRule}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {template.defaultTags.map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[10px] font-bold rounded border border-slate-100">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">已处理 {template.usageCount} 次</span>
                            {template.sampleFiles && (
                              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                                <Paperclip size={10} /> {template.sampleFiles.length} 个参考文件
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => {
                              setSelectedTemplate(template);
                              setModalMode('details');
                            }}
                            className="text-sm font-bold text-[#007FFF] hover:underline underline-offset-4 flex items-center gap-1"
                          >
                            配置详情 <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Create New Template Card */}
                    <button 
                      onClick={() => setModalMode('create')}
                      className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-[#007FFF] hover:bg-white transition-all group min-h-[280px]"
                    >
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-50 group-hover:text-[#007FFF] transition-colors">
                        <Plus size={32} />
                      </div>
                      <span className="font-bold">创建新 AI 模板</span>
                      <p className="text-xs mt-2 max-w-[160px] text-center">定义该知识库下文档的智能入库规则</p>
                    </button>
                  </div>
                  
                  {filteredTemplates.length === 0 && (
                    <div className="mt-12 text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                        <Layers size={40} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-700">暂无相关模板</h3>
                      <p className="text-slate-400 text-sm mt-2">选择左侧知识库或点击上方按钮创建该知识库的专属模板</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-160px)] text-slate-400 space-y-6">
            <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center shadow-inner">
              <Settings size={48} className="opacity-20" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-700">账户与偏好</h2>
              <p className="text-sm mt-2 text-slate-400">正在优化设置面板</p>
            </div>
          </div>
        )}

        {/* Global Modal System */}
        {modalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] ${modalMode === 'ingestion' ? 'w-full max-w-4xl' : 'w-full max-w-xl'}`}>
              
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h3 className="text-xl font-bold text-slate-800">
                  {modalMode === 'create' ? '新建 AI 知识模板' : 
                   modalMode === 'details' ? '模板配置详情' : 
                   modalMode === 'edit' ? '编辑模板规则' : '智能入库'}
                </h3>
                <button 
                  onClick={() => { setModalMode(null); setSelectedTemplate(null); }}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto min-h-0">
                {modalMode === 'ingestion' ? (
                  <div className="flex h-full flex-col">
                    {/* Ingestion Tabs */}
                    <div className="px-8 pt-4 flex gap-8 border-b border-slate-50 shrink-0">
                      <button 
                        onClick={() => setIngestionTab('smart')}
                        className={`pb-3 text-sm font-bold transition-all relative ${ingestionTab === 'smart' ? 'text-[#007FFF]' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <span className="flex items-center gap-2"><Sparkles size={16}/> 智能入库</span>
                        {ingestionTab === 'smart' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#007FFF] rounded-full"></div>}
                      </button>
                      <button 
                        onClick={() => setIngestionTab('manual')}
                        className={`pb-3 text-sm font-bold transition-all relative ${ingestionTab === 'manual' ? 'text-[#007FFF]' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <span className="flex items-center gap-2"><FileUp size={16}/> 本地上传</span>
                        {ingestionTab === 'manual' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#007FFF] rounded-full"></div>}
                      </button>
                    </div>

                    <div className="p-8">
                      {ingestionTab === 'smart' ? (
                        <div className="space-y-8 h-full">
                          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center group hover:border-blue-300 transition-all cursor-pointer">
                            {isProcessing ? (
                              <div className="max-w-md mx-auto py-8">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#007FFF] mx-auto mb-6 shadow-md animate-bounce">
                                  <Activity size={32} />
                                </div>
                                <h4 className="text-lg font-bold text-slate-800 mb-2">AI 语义识别引擎运行中...</h4>
                                <p className="text-sm text-slate-500 mb-6">正在分析文档结构、提取核心标签并匹配最佳模板</p>
                                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                                  <div className="bg-[#007FFF] h-full w-[88%] animate-pulse transition-all"></div>
                                </div>
                              </div>
                            ) : (
                              <div onClick={handleUploadComplete}>
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-[#007FFF] mx-auto mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                  <Sparkles size={40} />
                                </div>
                                <h4 className="text-xl font-bold text-slate-800 mb-2">拖拽文件到此处开始智能入库</h4>
                                <p className="text-sm text-slate-400 max-w-sm mx-auto">AI 将自动完成语义提取、打标、分类与有效期设置，识别后支持手动二次修改</p>
                                <div className="mt-8 flex items-center justify-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                  <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500"/> 智能打标</span>
                                  <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500"/> 自动归档</span>
                                  <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500"/> 有效期预测</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-5 gap-8">
                          {/* Manual Upload Section */}
                          <div className="col-span-3 space-y-6">
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-blue-300 transition-all cursor-pointer">
                              <FileUp size={32} className="text-slate-300 mx-auto mb-3" />
                              <p className="text-sm font-bold text-slate-700">点击上传或拖拽文件</p>
                              <p className="text-[10px] text-slate-400 mt-1">支持 PDF, DOCX, MD, JPG</p>
                            </div>

                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">对应模板</label>
                                  <div className="relative">
                                    <select className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:border-[#007FFF] focus:ring-4 focus:ring-blue-100 transition-all outline-none appearance-none bg-white font-medium">
                                      <option>无模板 (通用)</option>
                                      {MOCK_TEMPLATES.map(t => <option key={t.id}>{t.name}</option>)}
                                    </select>
                                    <Zap className="absolute left-3 top-2.5 text-blue-400" size={16} />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">有效期</label>
                                  <div className="relative">
                                    <select className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:border-[#007FFF] outline-none appearance-none bg-white font-medium">
                                      <option>长期有效</option>
                                      <option>3个月</option>
                                      <option>6个月</option>
                                      <option>1年</option>
                                    </select>
                                    <Calendar className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">存储位置</label>
                                <div className="relative">
                                  <select className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:border-[#007FFF] outline-none appearance-none bg-white font-medium">
                                    <option>根目录</option>
                                    {MOCK_FOLDERS.filter(f => f.repoId === activeRepoId).map(f => <option key={f.id}>{f.name}</option>)}
                                  </select>
                                  <FolderOpen className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">标签 (Tags)</label>
                                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 flex items-center gap-1.5">#研发 <X size={12}/></span>
                                  <button className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md hover:bg-blue-100 transition-colors flex items-center gap-1"><Plus size={12}/> 添加</button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Preview/Info Side */}
                          <div className="col-span-2 space-y-4">
                            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 h-full">
                              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">入库小贴士</h5>
                              <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                  <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center text-[#007FFF] shrink-0 mt-0.5"><Database size={12}/></div>
                                  <p className="text-xs text-slate-500 leading-relaxed">正确选择模板可以极大提高后期搜索的准确率。</p>
                                </li>
                                <li className="flex items-start gap-3">
                                  <div className="w-5 h-5 bg-amber-100 rounded flex items-center justify-center text-amber-600 shrink-0 mt-0.5"><Clock size={12}/></div>
                                  <p className="text-xs text-slate-500 leading-relaxed">设置有效期后，系统会在到期前 7 天通过钉钉发送提醒。</p>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 space-y-8">
                    {modalMode === 'create' || modalMode === 'edit' ? (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">模板名称</label>
                            <input type="text" defaultValue={selectedTemplate?.name} placeholder="如：销售合同、技术方案..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#007FFF] focus:ring-4 focus:ring-blue-100 transition-all outline-none" />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">描述说明</label>
                            <textarea defaultValue={selectedTemplate?.description} placeholder="简述该模板的适用场景及 AI 处理逻辑" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#007FFF] focus:ring-4 focus:ring-blue-100 transition-all outline-none h-20 resize-none" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1.5">有效期规则</label>
                              <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#007FFF] outline-none bg-white font-medium">
                                <option selected={selectedTemplate?.validityRule === '长期有效'}>长期有效</option>
                                <option selected={selectedTemplate?.validityRule.includes('30天')}>固定期限 (30天)</option>
                                <option selected={selectedTemplate?.validityRule.includes('AI')}>AI 自动识别</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1.5">目标仓库</label>
                              <div className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 font-medium">
                                {currentRepo?.name}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Reference Files Section */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-bold text-slate-700">参考示例文件</label>
                            <p className="text-[11px] text-slate-400 mt-0.5">上传 1-3 份标准文档作为参考，AI 将基于此类文档结构进行自动化学习与识别</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            {selectedTemplate?.sampleFiles?.map((filename, i) => (
                              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-500 shadow-sm">
                                  <FileText size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-slate-700 truncate">{filename}</p>
                                  <p className="text-[10px] text-slate-400 uppercase tracking-tighter">已关联</p>
                                </div>
                                <button className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                            
                            <button className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-2xl hover:border-[#007FFF] hover:bg-blue-50/30 transition-all text-slate-400 hover:text-[#007FFF]">
                              <FileUp size={24} />
                              <span className="text-xs font-bold tracking-tight">上传参考文档</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="flex items-start gap-4 p-5 bg-blue-50/50 rounded-3xl border border-blue-100">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#007FFF] shadow-md border border-white">
                            <Sparkles size={28} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-lg">{selectedTemplate?.name}</h4>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">{selectedTemplate?.description}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">有效期逻辑</span>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <Clock size={16} className="text-blue-500" />
                                {selectedTemplate?.validityRule}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">使用频次统计</span>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <TrendingUp size={16} className="text-emerald-500" />
                                累计入库 {selectedTemplate?.usageCount} 次
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI 参考学习文档</span>
                          <div className="space-y-2">
                            {selectedTemplate?.sampleFiles && selectedTemplate.sampleFiles.length > 0 ? (
                              selectedTemplate.sampleFiles.map((filename, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:shadow-sm transition-shadow">
                                  <div className="flex items-center gap-3">
                                    <FileText size={18} className="text-slate-400" />
                                    <span className="text-sm font-medium text-slate-700">{filename}</span>
                                  </div>
                                  <button className="text-[11px] font-bold text-blue-500 hover:text-blue-700">预览示例</button>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-xs text-slate-400">暂未上传参考文件</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">智能打标逻辑 (Tags)</span>
                          <div className="flex flex-wrap gap-2">
                            {selectedTemplate?.defaultTags.map(tag => (
                              <span key={tag} className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 flex items-center gap-2 shadow-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button 
                  onClick={() => { setModalMode(null); setSelectedTemplate(null); }}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={modalMode === 'ingestion' ? handleUploadComplete : () => { setModalMode(null); setSelectedTemplate(null); }}
                  className={`px-8 py-2.5 rounded-xl text-sm font-bold bg-[#007FFF] text-white hover:bg-blue-600 transition-colors shadow-[0_4px_14px_rgba(0,127,255,0.25)] flex items-center gap-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isProcessing}
                >
                  {modalMode === 'create' ? <><Plus size={18}/> 立即创建</> : 
                   modalMode === 'edit' ? <><Save size={18}/> 保存更改</> : 
                   modalMode === 'ingestion' ? <><Check size={18}/> 确认入库</> : <><Edit size={18}/> 编辑规则</>}
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
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
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
