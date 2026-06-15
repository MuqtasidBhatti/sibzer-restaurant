import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Save, GripVertical } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const EMPTY_FORM = { name: '', image: '', sortOrder: 0, isActive: true }

function CategoryRow({ cat, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-4 p-4 border border-white/10 rounded-xl bg-white/2 hover:bg-white/4 transition-colors">
      <GripVertical size={16} className="text-white/20 shrink-0" />
      {cat.image ? (
        <img src={cat.image} alt={cat.name} className="w-10 h-10 rounded-lg object-cover" />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/20 text-xs">
          No img
        </div>
      )}
      <div className="flex-1">
        <p className="text-white text-sm font-medium">{cat.name}</p>
        <p className="text-white/30 text-xs">/{cat.slug}</p>
      </div>
      <span className="text-white/30 text-xs">Sort: {cat.sortOrder}</span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${cat.isActive ? 'bg-green-400/10 text-green-400' : 'bg-white/5 text-white/30'}`}>
        {cat.isActive ? 'Active' : 'Hidden'}
      </span>
      <div className="flex gap-2">
        <button onClick={() => onEdit(cat)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
          <Pencil size={14} />
        </button>
        <button onClick={() => onDelete(cat._id)} className="p-1.5 rounded-lg hover:bg-red-400/10 text-white/30 hover:text-red-400 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

function SlidePanel({ open, onClose, form, setForm, onSave, saving, editing }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-[#0d0d0d] border-l border-white/10 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-white font-medium" style={{ fontFamily: 'Playfair Display, serif' }}>
            {editing ? 'Edit Category' : 'New Category'}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest">Name</label>
            <input
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Starters"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/60 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest">Image URL</label>
            <input
              value={form.image}
              onChange={e => setForm(p => ({ ...p, image: e.target.value }))}
              placeholder="https://..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/60 transition-colors"
            />
            {form.image && (
              <img src={form.image} alt="preview" className="mt-3 h-24 w-full object-cover rounded-lg" />
            )}
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest">Sort Order</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={e => setForm(p => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E85D04]/60 transition-colors"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <p className="text-white text-sm">Active</p>
              <p className="text-white/30 text-xs">Visible to customers</p>
            </div>
            <button
              onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
              className={`w-10 h-6 rounded-full transition-colors ${form.isActive ? 'bg-[#E85D04]' : 'bg-white/10'}`}
            >
              <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-1 ${form.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-white/10">
          <button
            onClick={onSave}
            disabled={saving || !form.name.trim()}
            className="w-full flex items-center justify-center gap-2 bg-[#E85D04] hover:bg-[#d44f00] text-white text-sm font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ManageCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [panelOpen, setPanelOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const res = await api.get('/categories')
      setCategories(res.data.categories ?? res.data)
    } catch {
      toast.error('Failed to load categories.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setPanelOpen(true)
  }

  const openEdit = (cat) => {
    setEditing(cat)
    setForm({ name: cat.name, image: cat.image || '', sortOrder: cat.sortOrder, isActive: cat.isActive })
    setPanelOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Name is required.')
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/categories/${editing._id}`, form)
        toast.success('Category updated.')
      } else {
        await api.post('/categories', form)
        toast.success('Category created.')
      }
      setPanelOpen(false)
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return
    try {
      await api.delete(`/categories/${id}`)
      toast.success('Deleted.')
      load()
    } catch {
      toast.error('Delete failed.')
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            Categories
          </h1>
          <p className="text-white/40 text-sm mt-1">{categories.length} total</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#E85D04] hover:bg-[#d44f00] text-white text-sm px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={15} /> New Category
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />)}
        </div>
      ) : categories.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-20">No categories yet.</p>
      ) : (
        <div className="space-y-3">
          {categories.map(cat => (
            <CategoryRow key={cat._id} cat={cat} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <SlidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        form={form}
        setForm={setForm}
        onSave={handleSave}
        saving={saving}
        editing={editing}
      />
    </div>
  )
}