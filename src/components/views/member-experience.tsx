import dbConnect from "@/lib/db/mongodb";
import { Post } from "@/lib/db/models";
// Note: preference-toggle was in src/app/experience, might need to move it too
import { PreferenceToggle } from "@/components/experience/preference-toggle";

export async function MemberExperience({
    experienceId,
    userId
}: {
    experienceId: string;
    userId: string;
}) {
    await dbConnect();
    // In a real app, we'd filter posts by products associated with the experienceId
    const allPosts = await Post.find().sort({ createdAt: -1 }).lean();

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <header className="flex justify-between items-center border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold">Latest Updates</h1>
                    <p className="text-sm text-muted-foreground">Stay informed with the latest broadcasts.</p>
                </div>
                <PreferenceToggle />
            </header>

            <div className="grid gap-6">
                {allPosts.map((post: any) => (
                    <article key={post._id.toString()} className="bg-card border rounded-2xl p-6 shadow-sm">
                        <header className="mb-4">
                            <h2 className="text-xl font-bold">{post.title || "Announcement"}</h2>
                            <time className="text-xs text-muted-foreground">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </time>
                        </header>
                        <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                            {post.content}
                        </div>
                        {/* Audio Summary Placeholder */}
                        <div className="mt-6 pt-4 border-t">
                            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                AI Voice Summary Available
                            </p>
                            <div className="bg-muted/30 rounded-full h-12 flex items-center px-4 gap-4">
                                <button className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </button>
                                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                                    <div className="w-1/3 h-full bg-primary/50"></div>
                                </div>
                                <span className="text-xs tabular-nums">0:45</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
