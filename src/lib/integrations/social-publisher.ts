import { ContentPlatform } from "@/types";
import { createLinkedInPost, verifyLinkedInToken } from "./linkedin";
import { createTweet, verifyXToken } from "./x-twitter";
import {
  createInstagramPost,
  createInstagramCarousel,
  verifyInstagramToken,
} from "./instagram";
import { createPin, verifyPinterestToken, getPinterestBoards } from "./pinterest";

export interface PublishRequest {
  platform: ContentPlatform;
  text: string;
  imageUrl?: string;
  alt?: string;
  /** Extra platform-specific data (e.g. Pinterest boardId) */
  meta?: Record<string, string>;
}

export interface PublishResult {
  platform: string;
  success: boolean;
  message: string;
  postId?: string;
}

interface PlatformTokens {
  linkedin?: string;
  linkedinUrn?: string;
  instagram?: string;
  instagramUserId?: string;
  x?: string;
  pinterest?: string;
  pinterestBoardId?: string;
}

/**
 * Publish a single content piece to its native platform.
 */
export async function publishToPlatform(
  piece: PublishRequest,
  tokens: PlatformTokens
): Promise<PublishResult> {
  const base = piece.platform;

  try {
    // LinkedIn
    if (base === "linkedin") {
      if (!tokens.linkedin || !tokens.linkedinUrn) {
        return { platform: base, success: false, message: "LinkedIn not connected" };
      }
      const result = await createLinkedInPost(tokens.linkedin, {
        authorUrn: tokens.linkedinUrn,
        text: piece.text,
        imageUrl: piece.imageUrl,
      });
      return {
        platform: base,
        success: result.success,
        message: result.success ? "Published to LinkedIn" : (result.error ?? "Failed"),
        postId: result.postId,
      };
    }

    // Instagram (post or carousel)
    if (base === "instagram-post" || base === "instagram-carousel") {
      if (!tokens.instagram || !tokens.instagramUserId) {
        return { platform: base, success: false, message: "Instagram not connected" };
      }

      if (base === "instagram-carousel" && piece.meta?.carouselUrls) {
        const urls = piece.meta.carouselUrls.split(",").filter(Boolean);
        const result = await createInstagramCarousel(tokens.instagram, {
          igUserId: tokens.instagramUserId,
          imageUrls: urls,
          caption: piece.text,
        });
        return {
          platform: base,
          success: result.success,
          message: result.success ? "Published carousel to Instagram" : (result.error ?? "Failed"),
          postId: result.mediaId,
        };
      }

      if (!piece.imageUrl) {
        return { platform: base, success: false, message: "Instagram requires an image" };
      }

      const result = await createInstagramPost(tokens.instagram, {
        igUserId: tokens.instagramUserId,
        imageUrl: piece.imageUrl,
        caption: piece.text,
      });
      return {
        platform: base,
        success: result.success,
        message: result.success ? "Published to Instagram" : (result.error ?? "Failed"),
        postId: result.mediaId,
      };
    }

    // X / Twitter
    if (base === "x") {
      if (!tokens.x) {
        return { platform: base, success: false, message: "X/Twitter not connected" };
      }
      // Truncate to 280 chars for tweet
      const tweetText = piece.text.length > 280 ? piece.text.slice(0, 277) + "..." : piece.text;
      const result = await createTweet(tokens.x, { text: tweetText });
      return {
        platform: base,
        success: result.success,
        message: result.success ? "Published to X/Twitter" : (result.error ?? "Failed"),
        postId: result.tweetId,
      };
    }

    // TikTok and YouTube — script-only, no direct API publishing
    if (base === "tiktok" || base === "youtube") {
      return {
        platform: base,
        success: false,
        message: `${base === "tiktok" ? "TikTok" : "YouTube"} scripts are for manual use — direct publishing not supported`,
      };
    }

    // Pinterest
    if (base === "pinterest") {
      if (!tokens.pinterest) {
        return { platform: base, success: false, message: "Pinterest not connected" };
      }
      if (!piece.imageUrl) {
        return { platform: base, success: false, message: "Pinterest requires an image" };
      }

      let boardId = tokens.pinterestBoardId ?? piece.meta?.boardId;
      if (!boardId) {
        // Auto-select the first board
        const boards = await getPinterestBoards(tokens.pinterest);
        if (boards.length === 0) {
          return { platform: base, success: false, message: "No Pinterest boards found" };
        }
        boardId = boards[0].id;
      }

      // Extract title and description from pin body
      const lines = piece.text.split("\n").filter(Boolean);
      const title = lines.find((l) => l.startsWith("Pin Title:"))?.replace("Pin Title:", "").trim()
        ?? piece.text.slice(0, 100);
      const description = lines.find((l) => l.startsWith("Pin Description:"))?.replace("Pin Description:", "").trim()
        ?? piece.text.slice(0, 500);

      const result = await createPin(tokens.pinterest, {
        boardId,
        title,
        description,
        imageUrl: piece.imageUrl,
        altText: piece.alt,
      });
      return {
        platform: base,
        success: result.success,
        message: result.success ? "Published to Pinterest" : (result.error ?? "Failed"),
        postId: result.pinId,
      };
    }

    // Blog — no direct publishing, just flag for manual use
    if (base === "blog") {
      return {
        platform: base,
        success: false,
        message: "Blog posts are for manual publishing — copy content to your CMS",
      };
    }

    return { platform: base, success: false, message: `Unsupported platform: ${base}` };
  } catch (err) {
    return {
      platform: base,
      success: false,
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Publish multiple content pieces in parallel.
 */
export async function publishBatch(
  pieces: PublishRequest[],
  tokens: PlatformTokens
): Promise<PublishResult[]> {
  return Promise.all(pieces.map((p) => publishToPlatform(p, tokens)));
}

/**
 * Verify all configured platform tokens.
 */
export async function verifyAllTokens(tokens: PlatformTokens): Promise<
  Record<string, { valid: boolean; username?: string }>
> {
  const results: Record<string, { valid: boolean; username?: string }> = {};

  if (tokens.linkedin) {
    const r = await verifyLinkedInToken(tokens.linkedin);
    results.linkedin = { valid: r.valid, username: r.name };
  }
  if (tokens.instagram) {
    const r = await verifyInstagramToken(tokens.instagram);
    results.instagram = { valid: r.valid, username: r.username };
  }
  if (tokens.x) {
    const r = await verifyXToken(tokens.x);
    results.x = { valid: r.valid, username: r.username };
  }
  if (tokens.pinterest) {
    const r = await verifyPinterestToken(tokens.pinterest);
    results.pinterest = { valid: r.valid, username: r.username };
  }

  return results;
}
