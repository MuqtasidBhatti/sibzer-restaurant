import { useState, useEffect } from "react";
import { RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import api from '../../services/api'

const ManageMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 30000)
        return () => clearInterval(interval)
    }, []);

    const fetchMessages = async () => {
        try {
            const { data } = await api.get('/messages')
            setMessages(data.data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const markAsRead = async (id) => {
        try {
            await api.patch(`/messages/${id}/read`)
            setMessages((prev) =>
                prev.map((m) => (m._id === id ? { ...m, read: true } : m))
            );
        } catch (err) {
            console.error(err)
        }
    }

    const unreadCount = messages.filter((m) => !m.read).length;

    if (loading) return (
        <div className="p-6 lg:p-8 space-y-3">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
            ))}
        </div>
    );

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Messages
                    </h1>
                    <p className="text-white/40 text-sm mt-1">
                        {messages.length} total —{" "}
                        <span className="text-[#E85D04]">{unreadCount} unread</span>
                    </p>
                </div>
                <button
                    onClick={fetchMessages}
                    className="flex items-center gap-2 border border-white/10 text-white/50 hover:text-white text-sm px-4 py-2.5 rounded-lg transition-colors"
                >
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            {/* Messages List */}
            {messages.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-20">No messages yet.</p>
            ) : (
                <div className="space-y-3">
                    {messages.map((msg) => (
                        <div
                            key={msg._id}
                            className="border border-white/10 rounded-xl overflow-hidden bg-white/2"
                        >
                            {/* Row */}
                            <div
                                className="flex flex-wrap items-center gap-4 p-4 cursor-pointer hover:bg-white/2 transition-colors"
                                onClick={() => setExpanded(expanded === msg._id ? null : msg._id)}
                            >
                                {/* Unread dot + name */}
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {!msg.read && (
                                        <span className="w-2 h-2 rounded-full bg-[#E85D04] shrink-0" />
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-white text-sm font-medium truncate">{msg.name}</p>
                                        <p className="text-white/30 text-xs truncate">{msg.email}</p>
                                    </div>
                                </div>

                                {/* Subject */}
                                {msg.subject && (
                                    <p className="text-white/40 text-sm hidden md:block truncate max-w-xs">
                                        {msg.subject}
                                    </p>
                                )}

                                {/* Date */}
                                <p className="text-white/30 text-xs">
                                    {new Date(msg.createdAt).toLocaleDateString()}
                                </p>

                                {/* Read status / Mark read */}
                                {!msg.read ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            markAsRead(msg._id);
                                        }}
                                        className="text-xs px-3 py-1.5 rounded-lg border border-[#E85D04]/40 text-[#E85D04] bg-[#E85D04]/10 hover:bg-[#E85D04]/20 transition-colors shrink-0"
                                    >
                                        Mark Read
                                    </button>
                                ) : (
                                    <span className="text-xs text-green-400 shrink-0">Read</span>
                                )}

                                {expanded === msg._id
                                    ? <ChevronUp size={14} className="text-white/30 shrink-0" />
                                    : <ChevronDown size={14} className="text-white/30 shrink-0" />
                                }
                            </div>

                            {/* Expanded Message */}
                            {expanded === msg._id && (
                                <div className="border-t border-white/10 p-4 space-y-3">
                                    <p className="text-white/60 text-sm leading-relaxed">
                                        {msg.message}
                                    </p>
                                    <a
                                        href={`mailto:${msg.email}`}
                                        className="inline-block text-sm text-[#E85D04] hover:underline"
                                    >
                                        Reply to {msg.email}
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageMessages;