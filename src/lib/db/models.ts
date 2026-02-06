import mongoose, { Schema, Document } from "mongoose";

// --- Post Model ---
export interface IPost extends Document {
    title?: string;
    content: string;
    creatorId: string;
    companyId: string;
    tags?: string[];
    createdAt: Date;
}

const PostSchema = new Schema<IPost>({
    title: { type: String },
    content: { type: String, required: true },
    creatorId: { type: String, required: true },
    companyId: { type: String, required: true, index: true },
    tags: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
});

export const Post = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

// --- VoiceProfile Model ---
export interface IVoiceProfile extends Document {
    creatorId: string;
    fishVoiceId: string;
    hasConsent: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const VoiceProfileSchema = new Schema<IVoiceProfile>({
    creatorId: { type: String, required: true, unique: true },
    fishVoiceId: { type: String, required: true },
    hasConsent: { type: Boolean, default: false },
}, { timestamps: true });

export const VoiceProfile = mongoose.models.VoiceProfile || mongoose.model<IVoiceProfile>("VoiceProfile", VoiceProfileSchema);

// --- AudioSummary Model ---
export interface IAudioSummary extends Document {
    postId: mongoose.Types.ObjectId;
    script: string;
    audioUrl: string;
    duration?: number;
    createdAt: Date;
}

const AudioSummarySchema = new Schema<IAudioSummary>({
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    script: { type: String, required: true },
    audioUrl: { type: String, required: true },
    duration: { type: Number },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const AudioSummary = mongoose.models.AudioSummary || mongoose.model<IAudioSummary>("AudioSummary", AudioSummarySchema);

// --- Broadcast Model ---
export interface IBroadcast extends Document {
    postId: mongoose.Types.ObjectId;
    audioSummaryId: mongoose.Types.ObjectId;
    companyId: string;
    targetAudience: "all" | "product_scoped";
    productIds?: string[];
    sentAt: Date;
}

const BroadcastSchema = new Schema<IBroadcast>({
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    audioSummaryId: { type: Schema.Types.ObjectId, ref: "AudioSummary", required: true },
    companyId: { type: String, required: true, index: true },
    targetAudience: { type: String, enum: ["all", "product_scoped"], default: "all" },
    productIds: { type: [String], default: [] },
}, { timestamps: { createdAt: "sentAt", updatedAt: false } });

export const Broadcast = mongoose.models.Broadcast || mongoose.model<IBroadcast>("Broadcast", BroadcastSchema);

// --- UserPreference Model ---
export interface IUserPreference extends Document {
    userId: string;
    companyId: string;
    isMuted: boolean;
    updatedAt: Date;
}

const UserPreferenceSchema = new Schema<IUserPreference>({
    userId: { type: String, required: true },
    companyId: { type: String, required: true },
    isMuted: { type: Boolean, default: false },
}, { timestamps: true });

UserPreferenceSchema.index({ userId: 1, companyId: 1 }, { unique: true });

export const UserPreference = mongoose.models.UserPreference || mongoose.model<IUserPreference>("UserPreference", UserPreferenceSchema);
