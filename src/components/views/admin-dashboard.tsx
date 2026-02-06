import dbConnect from "@/lib/db/mongodb";
import { Post } from "@/lib/db/models";
import { CreatePostForm } from "@/components/dashboard/create-post-form";
import { PostCard } from "@/components/dashboard/post-card";
import { VoiceProfileSetup } from "@/components/dashboard/voice-profile-setup";
import { AnalyticsDashboard } from "@/components/dashboard/analytics";

export async function AdminDashboard({
    companyId,
    userId
}: {
    companyId: string;
    userId: string;
}) {
    await dbConnect();
    const allPosts = await Post.find({ companyId })
        .sort({ createdAt: -1 })
        .lean();

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Broadcast Dashboard</h1>
                    <p className="text-muted-foreground">Manage your announcements and voice summaries.</p>
                </div>
            </header>

            <AnalyticsDashboard companyId={companyId} />

            <section className="bg-card border rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
                <CreatePostForm companyId={companyId} creatorId={userId} />
            </section>

            <section>
                <VoiceProfileSetup creatorId={userId} />
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Previous Posts</h2>
                {allPosts.length === 0 ? (
                    <div className="text-center py-12 border rounded-xl bg-muted/50">
                        <p className="text-muted-foreground">No posts yet. Create your first broadcast above.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {allPosts.map((post: any) => (
                            <PostCard key={post._id.toString()} post={{ ...post, id: post._id.toString() }} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
