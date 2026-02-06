import { Mic2, ShieldCheck, Upload, AlertCircle } from "lucide-react";
import prisma from "@/lib/prisma";
import { getWhopContext } from "@/lib/context";

export default async function VoiceSettingsPage() {
    const { bizId } = await getWhopContext();

    const profile = await prisma.voiceProfile.findUnique({
        where: { creatorId: bizId! }
    });

    return (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Voice Profile</h2>
                <p className="text-gray-500">Manage your cloned voice used for broadcasts.</p>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-8 space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold">Voice Consent & Safety</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                By enabling voice summaries, you consent to cloning your voice for the purpose of sending automated broadcasts to your members. Your voice data is encrypted and used only for your broadcasts.
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 border-t flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="font-bold">Status</p>
                            <p className="text-sm text-gray-500">
                                {profile?.consentAccepted ? "Active - Your voice is ready" : "Inactive - Consent required"}
                            </p>
                        </div>
                        <button
                            className={`px-6 py-2 rounded-lg font-bold transition-colors ${profile?.consentAccepted
                                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                                }`}
                        >
                            {profile?.consentAccepted ? "Revoke Consent" : "Enable Voice Cloning"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold flex items-center gap-2">
                            <Mic2 className="w-5 h-5 text-indigo-600" />
                            Voice Samples
                        </h3>
                        <button className="text-sm text-indigo-600 font-bold hover:underline flex items-center gap-1">
                            <Upload className="w-4 h-4" />
                            Upload New Sample
                        </button>
                    </div>

                    {!profile?.fishVoiceId ? (
                        <div className="bg-gray-50 border-2 border-dashed rounded-xl p-12 text-center text-gray-400 space-y-3">
                            <AlertCircle className="w-10 h-10 mx-auto opacity-20" />
                            <p>No voice samples uploaded yet. Upload at least 30 seconds of clear speech.</p>
                        </div>
                    ) : (
                        <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                            <span className="text-sm font-medium">Sample-2023-11-06.mp3</span>
                            <span className="text-xs text-gray-400">Verified</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
