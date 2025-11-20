import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { VideoService } from './services/video.js';
import { TranscriptService } from './services/transcript.js';
import { PlaylistService } from './services/playlist.js';
import { ChannelService } from './services/channel.js';

// Configuration schema for Smithery
export const configSchema = z.object({
    youtubeApiKey: z.string().describe("Your YouTube Data API key"),
    youtubeTranscriptLang: z.string().default("en").describe("Default language for YouTube transcripts"),
});

export default function createServer({ config }: { config?: z.infer<typeof configSchema> }) {
    const server = new McpServer({
        name: 'youtube-mcp',
        version: '0.1.0',
    });

    const videoService = new VideoService();
    const transcriptService = new TranscriptService();
    const playlistService = new PlaylistService();
    const channelService = new ChannelService();

    // Set environment variables from config
    if (config?.youtubeApiKey) {
        process.env.YOUTUBE_API_KEY = config.youtubeApiKey;
    }
    if (config?.youtubeTranscriptLang) {
        process.env.YOUTUBE_TRANSCRIPT_LANG = config.youtubeTranscriptLang;
    }

    // Register tools
    server.registerTool("videos_getVideo", {
        title: "Get Video Information",
        description: "Get detailed information about a YouTube video",
        inputSchema: {
            type: "object",
            properties: {
                videoId: {
                    type: "string",
                    description: "The YouTube video ID",
                },
                parts: {
                    type: "array",
                    description: "Parts of the video to retrieve",
                    items: {
                        type: "string",
                    },
                },
            },
            required: ["videoId"],
        },
    }, async ({ videoId, parts }) => {
        const result = await videoService.getVideo({ videoId, parts });
        return {
            content: [{
                type: 'text',
                text: JSON.stringify(result, null, 2)
            }]
        };
    });

    server.registerTool("videos_searchVideos", {
        title: "Search Videos",
        description: "Search for videos on YouTube",
        inputSchema: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Search query",
                },
                maxResults: {
                    type: "number",
                    description: "Maximum number of results to return",
                },
            },
            required: ["query"],
        },
    }, async ({ query, maxResults }) => {
        const result = await videoService.searchVideos({ query, maxResults });
        return {
            content: [{
                type: 'text',
                text: JSON.stringify(result, null, 2)
            }]
        };
    });

    server.registerTool("transcripts_getTranscript", {
        title: "Get Video Transcript",
        description: "Get the transcript of a YouTube video",
        inputSchema: {
            type: "object",
            properties: {
                videoId: {
                    type: "string",
                    description: "The YouTube video ID",
                },
                language: {
                    type: "string",
                    description: "Language code for the transcript",
                },
            },
            required: ["videoId"],
        },
    }, async ({ videoId, language }) => {
        const result = await transcriptService.getTranscript({ videoId, language });
        return {
            content: [{
                type: 'text',
                text: JSON.stringify(result, null, 2)
            }]
        };
    });

    server.registerTool("channels_getChannel", {
        title: "Get Channel Information",
        description: "Get information about a YouTube channel",
        inputSchema: {
            type: "object",
            properties: {
                channelId: {
                    type: "string",
                    description: "The YouTube channel ID",
                },
            },
            required: ["channelId"],
        },
    }, async ({ channelId }) => {
        const result = await channelService.getChannel({ channelId });
        return {
            content: [{
                type: 'text',
                text: JSON.stringify(result, null, 2)
            }]
        };
    });

    server.registerTool("channels_listVideos", {
        title: "List Channel Videos",
        description: "Get videos from a specific channel",
        inputSchema: {
            type: "object",
            properties: {
                channelId: {
                    type: "string",
                    description: "The YouTube channel ID",
                },
                maxResults: {
                    type: "number",
                    description: "Maximum number of results to return",
                },
            },
            required: ["channelId"],
        },
    }, async ({ channelId, maxResults }) => {
        const result = await channelService.listVideos({ channelId, maxResults });
        return {
            content: [{
                type: 'text',
                text: JSON.stringify(result, null, 2)
            }]
        };
    });

    server.registerTool("playlists_getPlaylist", {
        title: "Get Playlist Information",
        description: "Get information about a YouTube playlist",
        inputSchema: {
            type: "object",
            properties: {
                playlistId: {
                    type: "string",
                    description: "The YouTube playlist ID",
                },
            },
            required: ["playlistId"],
        },
    }, async ({ playlistId }) => {
        const result = await playlistService.getPlaylist({ playlistId });
        return {
            content: [{
                type: 'text',
                text: JSON.stringify(result, null, 2)
            }]
        };
    });

    server.registerTool("playlists_getPlaylistItems", {
        title: "Get Playlist Items",
        description: "Get videos in a YouTube playlist",
        inputSchema: {
            type: "object",
            properties: {
                playlistId: {
                    type: "string",
                    description: "The YouTube playlist ID",
                },
                maxResults: {
                    type: "number",
                    description: "Maximum number of results to return",
                },
            },
            required: ["playlistId"],
        },
    }, async ({ playlistId, maxResults }) => {
        const result = await playlistService.getPlaylistItems({ playlistId, maxResults });
        return {
            content: [{
                type: 'text',
                text: JSON.stringify(result, null, 2)
            }]
        };
    });

    return server.server;
}