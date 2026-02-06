import { CreatePostForm } from "./CreatePostForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NewPostPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Create New Post</h2>
                    <p className="text-gray-500">Draft your update and prepare for voice broadcast.</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl border shadow-sm">
                <CreatePostForm />
            </div>
        </div>
    );
}
