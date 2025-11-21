import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createStatelessServer } from '@smithery/sdk/server/stateless.js';
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

// Hardcoded version to avoid import.meta.url issues in Smithery builds
const packageVersion = "0.1.2";

// Initialize services eagerly to avoid initialization delays during requests
let videoService: VideoService;
let transcriptService: TranscriptService;
let playlistService: PlaylistService;
let channelService: ChannelService;

function initializeServices() {
    console.log(`[${new Date().toISOString()}] Initializing YouTube services`);
    videoService = new VideoService();
    transcriptService = new TranscriptService();
    playlistService = new PlaylistService();
    channelService = new ChannelService();
    console.log(`[${new Date().toISOString()}] YouTube services initialization completed`);
}

// Eagerly initialize services
initializeServices();

export default function createServer({ config }: { config?: z.infer<typeof configSchema> }) {
    console.log(`[${new Date().toISOString()}] Starting YouTube MCP server initialization`);

    // Initialize environment variables from config
    if (config?.youtubeApiKey) {
        process.env.YOUTUBE_API_KEY = config.youtubeApiKey;
    }
    if (config?.youtubeTranscriptLang) {
        process.env.YOUTUBE_TRANSCRIPT_LANG = config.youtubeTranscriptLang;
    }

    // Create MCP server instance
    const mcpServer = new McpServer({
        name: 'youtube-mcp',
        version: packageVersion,
    });

    // Register tools
    mcpServer.registerTool(
        "videos_getVideo",
        {
            title: "Get Video Details",
            description: "Get detailed information about a YouTube video including URL",
            inputSchema: {
                videoId: z.string().describe("The YouTube video ID"),
                parts: z.array(z.string()).optional().describe("Parts of the video to retrieve"),
            },
            outputSchema: z.any()
        },
        async ({ videoId, parts }) => {
            const result = await videoService.getVideo({ videoId, parts });
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }]
            };
        }
    );

    mcpServer.registerTool(
        "videos_searchVideos",
        {
            title: "Search Videos",
            description: "Search for videos on YouTube and return results with URLs",
            inputSchema: {
                query: z.string().describe("Search query"),
                maxResults: z.number().optional().describe("Maximum number of results to return"),
            },
            outputSchema: z.any()
        },
        async ({ query, maxResults }) => {
            const result = await videoService.searchVideos({ query, maxResults });
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }]
            };
        }
    );

    mcpServer.registerTool(
        "transcripts_getTranscript",
        {
            title: "Get Video Transcript",
            description: "Get the transcript of a YouTube video",
            inputSchema: {
                videoId: z.string().describe("The YouTube video ID"),
                language: z.string().optional().describe("Language code for the transcript"),
            },
            outputSchema: z.any()
        },
        async ({ videoId, language }) => {
            const result = await transcriptService.getTranscript({ videoId, language });
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }]
            };
        }
    );

    mcpServer.registerTool(
        "channels_getChannel",
        {
            title: "Get Channel Information",
            description: "Get information about a YouTube channel",
            inputSchema: {
                channelId: z.string().describe("The YouTube channel ID"),
            },
            outputSchema: z.any()
        },
        async ({ channelId }) => {
            const result = await channelService.getChannel({ channelId });
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }]
            };
        }
    );

    mcpServer.registerTool(
        "channels_listVideos",
        {
            title: "List Channel Videos",
            description: "Get videos from a specific channel",
            inputSchema: {
                channelId: z.string().describe("The YouTube channel ID"),
                maxResults: z.number().optional().describe("Maximum number of results to return"),
            },
            outputSchema: z.any()
        },
        async ({ channelId, maxResults }) => {
            const result = await channelService.listVideos({ channelId, maxResults });
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }]
            };
        }
    );

    mcpServer.registerTool(
        "playlists_getPlaylist",
        {
            title: "Get Playlist Information",
            description: "Get information about a YouTube playlist",
            inputSchema: {
                playlistId: z.string().describe("The YouTube playlist ID"),
            },
            outputSchema: z.any()
        },
        async ({ playlistId }) => {
            const result = await playlistService.getPlaylist({ playlistId });
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }]
            };
        }
    );

    mcpServer.registerTool(
        "playlists_getPlaylistItems",
        {
            title: "Get Playlist Items",
            description: "Get videos in a YouTube playlist",
            inputSchema: {
                playlistId: z.string().describe("The YouTube playlist ID"),
                maxResults: z.number().optional().describe("Maximum number of results to return"),
            },
            outputSchema: z.any()
        },
        async ({ playlistId, maxResults }) => {
            const result = await playlistService.getPlaylistItems({ playlistId, maxResults });
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }]
            };
        }
    );

    console.log(`[${new Date().toISOString()}] MCP server initialization completed`);

    // Return the MCP server instance (not the express app)
    return mcpServer.server;
}

// Create the stateless server for Smithery deployment
createStatelessServer(createServer).app.listen(process.env.PORT || 3000);