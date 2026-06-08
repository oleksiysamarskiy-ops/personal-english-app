import React, { useState, useMemo } from 'react';
import { VocabItem, VocabCategory, VocabStatus } from '../types';
import { Plus, Search, Pencil, Trash2, X, Check } from 'lucide-react';

interface DictionaryProps {
  vocab: VocabItem[];
  setVocab: (value: VocabItem[] | ((prev: VocabItem[]) => VocabItem[])) => void;
}

const CATEGORIES: VocabCategory[] = ['Word', 'Phrase', 'Slang', 'Idiom'];
const STATUSES: VocabStatus[] = ['New', 'Learning', 'Known', 'Weak'];

const catStyle: Record<VocabCategory, string> = {
  Word: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  Phrase: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  Slang: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  Idiom: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
};

const statusStyle: Record<VocabStatus, string> = {
  New: 'bg-blue-500/15 text-blue-400',
  Learning: 'bg-amber-500/15 text-amber-400',
  Known: 'bg-emerald-500/15 text-emerald-400',
  Weak: 'bg-rose-500/15 text-rose-400',
};

const emptyForm = { term: '', translation: '', example: '', category: 'Word' as VocabCategory, status: 'New' as VocabStatus };

export const Dictionary: React.FC<DictionaryProps> = ({ vocab, setVocab }) => {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<VocabCategory | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<VocabStatus | 'All'>('All');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    return vocab.filter(v => {
      const matchSearch = !search || v.term.toLowerCase().includes(search.toLowerCase()) || v.translation.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === 'All' || v.category === catFilter;
      const matchStatus = statusFilter === 'All' || v.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    }).sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
  }, [vocab, search, catFilter, statusFilter]);

  const openAdd = () => { setEditId(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (v: VocabItem) => {
    setEditId(v.id);
    setForm({ term: v.term, translation: v.translation, example: v.example, category: v.category, status: v.status });
    setShowModal(true);
  };

  const save = () => {
    if (!form.term.trim() || !form.translation.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    if (editId) {
      setVocab(prev => prev.map(v => v.id === editId ? { ...v, ...form } : v));
    } else {
      const newItem: VocabItem = { id: `v${Date.now()}`, ...form, dateAdded: today, nextReviewDate: today, correctStreak: 0 };
      setVocab(prev => [newItem, ...prev]);
    }
    setShowModal(false);
  };

  const deleteItem = (id: string) => setVocab(prev => prev.filter(v => v.id !== id));

  return (
    <div className="pb-24">
      <div className="px-5 pt-6 pb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white font-display tracking-tight">Dictionary</h1>
          <p className="text-slate-400 text-sm mt-0.5">{vocab.length} saved items</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all">
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="px-5 mb-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search words, translations..." className="w-full bg-slate-900 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500/50" />
        </div>
      </div>

      <div className="px-5 mb-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {(['All', ...CATEGORIES] as const).map(c => (
          <button key={c} onClick={() => setCatFilter(c)} className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${catFilter === c ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'}`}>{c}</button>
        ))}
      </div>
      <div className="px-5 mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {(['All', ...STATUSES] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${statusFilter === s ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'}`}>{s}</button>
        ))}
      </div>

      <div className="px-5 space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <div className="text-4xl mb-3">📭</div>
            <div className="font-semibold">No vocabulary found</div>
            <div className="text-sm mt-1">Try adjusting your filters</div>
          </div>
        )}
        {filtered.map(v => (
          <div key={v.id} className="rounded-2xl bg-slate-900 border border-white/5 p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white">{v.term}</span>
                  {v.status === 'Weak' && <span className="text-xs">⚠️</span>}
                </div>
                <div className="text-slate-400 text-sm mt-0.5">{v.translation}</div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => openEdit(v)} className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white active:scale-90 transition-all">
                  <Pencil size={13} />
                </button>
                <button onClick={() => deleteItem(v.id)} className="w-8 h-8 rounded-lg bg-rose-950/40 flex items-center justify-center text-rose-400 hover:text-rose-300 active:scale-90 transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            {v.example && <div className="text-xs text-slate-500 italic border-l-2 border-slate-700 pl-2 mt-2 mb-2">"{v.example}"</div>}
            <div className="flex gap-2 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${catStyle[v.category]}`}>{v.category}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[v.status]}`}>{v.status}</span>
              <span className="text-xs text-slate-600">{v.dateAdded}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="w-full max-w-lg bg-slate-950 border border-white/10 rounded-t-3xl p-6 pb-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white font-display">{editId ? 'Edit Word' : 'Add Vocabulary'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5 block">Word / Phrase *</label>
                <input value={form.term} onChange={e => setForm(p => ({ ...p, term: e.target.value }))} placeholder="e.g. bite the bullet" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5 block">Translation *</label>
                <input value={form.translation} onChange={e => setForm(p => ({ ...p, translation: e.target.value }))} placeholder="e.g. to endure a painful situation" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5 block">Example Sentence</label>
                <input value={form.example} onChange={e => setForm(p => ({ ...p, example: e.target.value }))} placeholder="e.g. Just bite the bullet and do it." className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5 block">Category</label>
                <div className="grid grid-cols-4 gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => setForm(p => ({ ...p, category: c }))} className={`py-2 rounded-xl text-sm font-semibold transition-all ${form.category === c ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'}`}>{c}</button>
                  ))}
                </div>
              </div>
              {editId && (
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5 block">Status</label>
                  <div className="grid grid-cols-4 gap-2">
                    {STATUSES.map(s => (
                      <button key={s} onClick={() => setForm(p => ({ ...p, status: s }))} className={`py-2 rounded-xl text-xs font-semibold transition-all ${form.status === s ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'}`}>{s}</button>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={save} disabled={!form.term.trim() || !form.translation.trim()} className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95">
                <Check size={16} /> {editId ? 'Save Changes' : 'Add to Dictionary'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
