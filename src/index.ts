import { z } from 'zod';
import { createYouTubeMcpServer } from './server-utils.js';

// Configuration schema for Smithery
export const configSchema = z.object({
    youtubeApiKey: z.string().optional().describe("Your YouTube Data API v3 key. Required for all operations. Can also be provided via YOUTUBE_API_KEY environment variable."),
    youtubeTranscriptLang: z.string().default("en").describe("Default language code for YouTube transcripts (e.g., 'en', 'es', 'fr', 'de')"),
});

// Export JSON schema for Smithery
export const configJsonSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://smithery-1f4f267c-d6d8-4f88-8fed-228b834c308f.fly.dev/.well-known/mcp-config",
    "title": "YouTube MCP Server Configuration",
    "description": "Configuration schema for the YouTube Model Context Protocol (MCP) Server. This server provides tools for accessing YouTube video information, transcripts, channel data, and playlists.",
    "type": "object",
    "properties": {
        "youtubeApiKey": {
            "type": "string",
            "title": "YouTube Data API Key",
            "description": "Your YouTube Data API v3 key. Required for all operations. Can also be provided via YOUTUBE_API_KEY environment variable.",
            "secret": true
        },
        "youtubeTranscriptLang": {
            "type": "string",
            "title": "Default Transcript Language",
            "description": "Default language code for YouTube transcripts (e.g., 'en', 'es', 'fr', 'de')",
            "default": "en"
        }
    },
    "required": [],
    "additionalProperties": false,
    "x-query-style": "dot+bracket"
};

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
