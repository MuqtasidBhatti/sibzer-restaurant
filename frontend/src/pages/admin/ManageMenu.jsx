import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Save, ToggleLeft, ToggleRight, Star } from 'lucide-react'
import menuService from '../../services/menuService'
import formatPrice from '../../utils/formatPrice'
import toast from 'react-hot-toast'

const DIETARY_OPTIONS = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'spicy']

const EMPTY_FORM = {
    name: '',
    description: '',
    price: '',
    category: '',
    images: [''],
    dietaryTags: [],
    preparationTime: '',
    isAvailable: true,
    isFeatured: false,
}

function MenuRow({ item, onEdit, onDelete, onToggle }) {
    return (
        <div className="flex items-center gap-4 p-4 border border-white/10 rounded-xl bg-white/2 hover:bg-white/4 transition-colors">
            {item.images?.[0] ? (
                <img src={item.images[0]} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
            ) : (
                <div className="w-12 h-12 rounded-lg bg-white/5 shrink-0" />
            )}

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-medium truncate">{item.name}</p>
                    {item.isFeatured && <Star size={12} className="text-[#E85D04] shrink-0" fill="#E85D04" />}
                </div>
                <p className="text-white/30 text-xs truncate">{item.description}</p>
            </div>

            <p className="text-white/70 text-sm font-medium shrink-0">{formatPrice(item.price)}</p>

            <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${item.isAvailable ? 'bg-green-400/10 text-green-400' : 'bg-white/5 text-white/30'
                }`}>
                {item.isAvailable ? 'Available' : 'Hidden'}
            </span>

            <div className="flex gap-1 shrink-0">
                <button
                    onClick={() => onToggle(item._id)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                    title="Toggle availability"
                >
                    {item.isAvailable
                        ? <ToggleRight size={16} className="text-green-400" />
                        : <ToggleLeft size={16} />}
                </button>
                <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                    <Pencil size={14} />
                </button>
                <button onClick={() => onDelete(item._id)} className="p-1.5 rounded-lg hover:bg-red-400/10 text-white/30 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    )
}

function SlidePanel({ open, onClose, form, setForm, onSave, saving, editing, categories }) {
    if (!open) return null

    const toggleTag = (tag) => {
        setForm(p => ({
            ...p,
            dietaryTags: p.dietaryTags.includes(tag)
                ? p.dietaryTags.filter(t => t !== tag)
                : [...p.dietaryTags, tag],
        }))
    }

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="w-full max-w-md bg-[#0d0d0d] border-l border-white/10 flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-white font-medium" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {editing ? 'Edit Item' : 'New Item'}
                    </h2>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest">Name</label>
                        <input
                            value={form.name}
                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                            placeholder="Dish name"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/60 transition-colors"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest">Description</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                            rows={3}
                            placeholder="Brief description..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/60 transition-colors resize-none"
                        />
                    </div>

                    {/* Price + Prep */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest">Price (Rs.)</label>
                            <input
                                type="number"
                                value={form.price}
                                onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                                placeholder="1500"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/60 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest">Prep Time (min)</label>
                            <input
                                type="number"
                                value={form.preparationTime}
                                onChange={e => setForm(p => ({ ...p, preparationTime: e.target.value }))}
                                placeholder="20"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/60 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest">Category</label>
                        <select
                            value={form.category}
                            onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E85D04]/60 transition-colors"
                        >
                            <option value="" className="bg-[#111]">Select category</option>
                            {categories.map(c => (
                                <option key={c._id} value={c._id} className="bg-[#111]">{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest">Image URL</label>
                        <input
                            value={form.images[0]}
                            onChange={e => setForm(p => ({ ...p, images: [e.target.value] }))}
                            placeholder="https://..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/60 transition-colors"
                        />
                        {form.images[0] && (
                            <img src={form.images[0]} alt="preview" className="mt-3 h-32 w-full object-cover rounded-lg" />
                        )}
                    </div>

                    {/* Dietary Tags */}
                    <div>
                        <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest">Dietary Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {DIETARY_OPTIONS.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-3 py-1.5 rounded-lg text-xs capitalize border transition-colors ${form.dietaryTags.includes(tag)
                                            ? 'border-[#E85D04] bg-[#E85D04]/10 text-[#E85D04]'
                                            : 'border-white/10 text-white/40 hover:text-white'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Toggles */}
                    {[
                        { key: 'isAvailable', label: 'Available', sub: 'Visible on the menu' },
                        { key: 'isFeatured', label: 'Featured', sub: 'Shown on the homepage' },
                    ].map(({ key, label, sub }) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                                <p className="text-white text-sm">{label}</p>
                                <p className="text-white/30 text-xs">{sub}</p>
                            </div>
                            <button
                                onClick={() => setForm(p => ({ ...p, [key]: !p[key] }))}
                                className={`w-10 h-6 rounded-full transition-colors ${form[key] ? 'bg-[#E85D04]' : 'bg-white/10'}`}
                            >
                                <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-1 ${form[key] ? 'translate-x-4' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="p-6 border-t border-white/10">
                    <button
                        onClick={onSave}
                        disabled={saving || !form.name.trim() || !form.price}
                        className="w-full flex items-center justify-center gap-2 bg-[#E85D04] hover:bg-[#d44f00] text-white text-sm font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <Save size={15} />
                        {saving ? 'Saving...' : 'Save Item'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function ManageMenu() {
    const [items, setItems] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [panelOpen, setPanelOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(EMPTY_FORM)
    const [saving, setSaving] = useState(false)
    const [search, setSearch] = useState('')

    const load = async () => {
        try {
            const [menuRes, catRes] = await Promise.all([
                menuService.getAllItemsAdmin(),
                menuService.getCategories(),
            ])
            // Handle both array and { menuItems: [] } shapes
            setItems(Array.isArray(menuRes) ? menuRes : menuRes.menuItems ?? [])
            // Handle both array and { categories: [] } shapes
            setCategories(Array.isArray(catRes) ? catRes : catRes.categories ?? [])
        } catch {
            toast.error('Failed to load menu.')
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

    const openEdit = (item) => {
        setEditing(item)
        setForm({
            name: item.name,
            description: item.description || '',
            price: item.price,
            category: item.category?._id || item.category || '',
            images: item.images?.length ? item.images : [''],
            dietaryTags: item.dietaryTags || [],
            preparationTime: item.preparationTime || '',
            isAvailable: item.isAvailable,
            isFeatured: item.isFeatured,
        })
        setPanelOpen(true)
    }

    const handleSave = async () => {
        if (!form.name.trim() || !form.price) return toast.error('Name and price are required.')
        setSaving(true)
        try {
            const payload = {
                ...form,
                price: Number(form.price),
                preparationTime: Number(form.preparationTime) || undefined,
                images: form.images.filter(Boolean),
            }
            if (editing) {
                await menuService.updateItem(editing._id, payload)
                toast.success('Item updated.')
            } else {
                await menuService.createItem(payload)
                toast.success('Item created.')
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
        if (!window.confirm('Delete this item?')) return
        try {
            await menuService.deleteItem(id)
            toast.success('Deleted.')
            load()
        } catch {
            toast.error('Delete failed.')
        }
    }

    const handleToggle = async (id) => {
        try {
            await menuService.toggleAvailability(id)
            load()
        } catch {
            toast.error('Toggle failed.')
        }
    }

    const filtered = items.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-6 lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Menu Items
                    </h1>
                    <p className="text-white/40 text-sm mt-1">{items.length} total</p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search items..."
                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/60 transition-colors w-48"
                    />
                    <button
                        onClick={openNew}
                        className="flex items-center gap-2 bg-[#E85D04] hover:bg-[#d44f00] text-white text-sm px-4 py-2.5 rounded-lg transition-colors shrink-0"
                    >
                        <Plus size={15} /> New Item
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />)}
                </div>
            ) : filtered.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-20">
                    {search ? 'No items match your search.' : 'No menu items yet.'}
                </p>
            ) : (
                <div className="space-y-3">
                    {filtered.map(item => (
                        <MenuRow
                            key={item._id}
                            item={item}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                            onToggle={handleToggle}
                        />
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
                categories={categories}
            />
        </div>
    )
}