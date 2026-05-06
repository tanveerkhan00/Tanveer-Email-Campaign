export type CampaignTone = 'professional' | 'playful' | 'urgent' | 'minimalist' | 'luxury';

export interface SocialPost {
  platform: 'twitter' | 'facebook' | 'linkedin' | 'instagram';
  content: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subjectLines: string[];
  bodyCopy: string;
  visualPrompt: string;
  socialPosts: SocialPost[];
  imageUrl?: string;
  tone: CampaignTone;
  targetAudience: string;
  createdAt: number;
}

export interface GenerationState {
  isGenerating: boolean;
  error?: string;
}
