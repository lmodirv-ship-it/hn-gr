import { useEffect, useState } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "@tanstack/react-router";

interface Comment {
  id: string;
  user_id: string;
  author_name: string | null;
  content: string;
  created_at: string;
}

export function ArticleSocial({
  postId,
  initialLikes,
  initialViews,
}: {
  postId: string;
  initialLikes: number;
  initialViews: number;
}) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void supabase
      .from("blog_comments")
      .select("id,user_id,author_name,content,created_at")
      .eq("post_id", postId)
      .order("created_at", { ascending: false })
      .then(({ data }) => setComments((data as Comment[]) ?? []));

    if (user) {
      void supabase
        .from("blog_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => setLiked(!!data));
    }
  }, [postId, user]);

  const toggleLike = async () => {
    if (!user) {
      alert("Please sign in to like articles.");
      return;
    }
    if (liked) {
      await supabase.from("blog_likes").delete().eq("post_id", postId).eq("user_id", user.id);
      setLiked(false);
      setLikes((n) => Math.max(0, n - 1));
    } else {
      await supabase.from("blog_likes").insert({ post_id: postId, user_id: user.id });
      setLiked(true);
      setLikes((n) => n + 1);
    }
  };

  const submit = async () => {
    if (!user) {
      alert("Please sign in to comment.");
      return;
    }
    const content = text.trim();
    if (content.length < 1 || content.length > 2000) return;
    setBusy(true);
    const author_name = user.email?.split("@")[0] ?? null;
    const { data, error } = await supabase
      .from("blog_comments")
      .insert({ post_id: postId, user_id: user.id, content, author_name })
      .select("id,user_id,author_name,content,created_at")
      .single();
    setBusy(false);
    if (error) {
      alert(error.message);
      return;
    }
    setComments((prev) => [data as Comment, ...prev]);
    setText("");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this comment?")) return;
    await supabase.from("blog_comments").delete().eq("id", id);
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <section className="mt-12 border-t border-border pt-8">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <button
          onClick={() => void toggleLike()}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
            liked ? "border-primary/50 bg-primary/10 text-primary" : "border-border hover:border-primary/40"
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} /> {likes}
        </button>
        <span className="inline-flex items-center gap-1.5 text-xs">
          <MessageCircle className="h-4 w-4" /> {comments.length}
        </span>
        <span className="text-xs">{initialViews} views</span>
      </div>

      <div className="mt-6">
        <h3 className="font-display text-xl font-semibold">Comments</h3>
        {user ? (
          <div className="mt-4 flex gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts…"
              rows={2}
              maxLength={2000}
              className="flex-1 resize-none rounded-md border border-border bg-surface/30 px-3 py-2 text-sm outline-none focus:border-primary/40"
            />
            <button
              disabled={busy || !text.trim()}
              onClick={() => void submit()}
              className="inline-flex h-10 shrink-0 items-center gap-1 self-end rounded-md bg-[image:var(--gradient-gold)] px-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to leave a comment.
          </p>
        )}

        <ul className="mt-6 space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="rounded-lg border border-border bg-surface/30 p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{c.author_name ?? "anonymous"}</span>
                <span>{new Date(c.created_at).toLocaleString()}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm">{c.content}</p>
              {user?.id === c.user_id && (
                <button
                  onClick={() => void remove(c.id)}
                  className="mt-2 text-[10px] text-muted-foreground hover:text-destructive"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
          {comments.length === 0 && (
            <li className="text-sm text-muted-foreground">Be the first to comment.</li>
          )}
        </ul>
      </div>
    </section>
  );
}
