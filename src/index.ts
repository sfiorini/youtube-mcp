import { z } from 'zod';
import { createYouTubeMcpServer } from './server-utils.js';

// Configuration schema for Smithery
export const configSchema = z.object({
    youtubeApiKey: z.string().optional().describe("Your YouTube Data API v3 key. Required for all operations. Can also be provided via YOUTUBE_API_KEY environment variable."),
    youtubeTranscriptLang: z.string().default("en").describe("Default language code for YouTube transcripts (e.g., 'en', 'es', 'fr', 'de')"),
});

// Required: Export default createServer function for Smithery
export default function createServer({ config }: { config?: z.infer<typeof configSchema> }) {
    // Set environment variables from config before creating the server
    if (config?.youtubeApiKey) {
        process.env.YOUTUBE_API_KEY = config.youtubeApiKey;
    }
    if (config?.youtubeTranscriptLang) {
        process.env.YOUTUBE_TRANSCRIPT_LANG = config.youtubeTranscriptLang;
    }

    // Create the server using shared utilities
    const server = createYouTubeMcpServer();

    // Must return the MCP server object for Smithery
    return server.server;
}
