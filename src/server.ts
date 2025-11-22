import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { VideoService } from './services/video.js';
import { TranscriptService } from './services/transcript.js';
import { PlaylistService } from './services/playlist.js';
import { ChannelService } from './services/channel.js';

const packageVersion = '0.1.10';

export async function startMcpServer() {
    const server = new McpServer({
        name: 'youtube-mcp',
        version: packageVersion,
    }, {
        capabilities: {
            resources: {},
            prompts: {},
            tools: {},
        }
    });

    const videoService = new VideoService();
    const transcriptService = new TranscriptService();
    const playlistService = new PlaylistService();
    const channelService = new ChannelService();

    // Register resources
    server.registerResource(
        'transcript',
        new ResourceTemplate('youtube://transcript/{videoId}', { list: undefined }),
        {
            mimeType: 'application/json',
        },
        async (uri, variables) => {
            const { videoId } = variables as unknown as { videoId: string };
            const result = await transcriptService.getTranscript({ videoId });
            return {
                contents: [{
                    uri: uri.href,
                    text: JSON.stringify(result, null, 2),
                    mimeType: "application/json"
                }]
            };
        }
    );

    // Register prompts
    server.registerPrompt(
        'summarize-video',
        {
            description: "Summarize a YouTube video",
            argsSchema: {
                videoId: z.string().describe("The ID of the video to summarize")
            }
        },
        ({ videoId }) => ({
            messages: [{
                role: 'user',
                content: {
                    type: 'text',
                    text: `Please get the transcript for video ID ${videoId} and summarize the key points.`
                }
            }]
        })
    );

    server.registerPrompt(
        'analyze-channel',
        {
            description: "Analyze a YouTube channel",
            argsSchema: {
                channelId: z.string().describe("The ID of the channel to analyze")
            }
        },
        ({ channelId }) => ({
            messages: [{
                role: 'user',
                content: {
                    type: 'text',
                    text: `Please analyze the channel with ID ${channelId}. Look at its recent videos, playlists, and statistics to provide an overview of its content strategy and performance.`
                }
            }]
        })
    );

    // Register video tools
    server.registerTool(
        'videos_getVideo',
        {
            title: 'Get Video Details',
            description: 'Get detailed information about a YouTube video including URL',
            annotations: { readOnlyHint: true, idempotentHint: true },
            inputSchema: {
                videoId: z.string().describe('The YouTube video ID'),
                parts: z.array(z.string()).optional().describe('Parts of the video to retrieve'),
            },
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

    server.registerTool(
        'videos_searchVideos',
        {
            title: 'Search Videos',
            description: 'Search for videos on YouTube and return results with URLs',
            annotations: { readOnlyHint: true, idempotentHint: true },
            inputSchema: {
                query: z.string().describe('Search query'),
                maxResults: z.number().optional().describe('Maximum number of results to return'),
            },
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

    // Register transcript tool
    server.registerTool(
        'transcripts_getTranscript',
        {
            title: 'Get Video Transcript',
            description: 'Get the transcript of a YouTube video',
            annotations: { readOnlyHint: true, idempotentHint: true },
            inputSchema: {
                videoId: z.string().describe('The YouTube video ID'),
                language: z.string().optional().describe('Language code for the transcript'),
            },
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

    // Register channel tools
    server.registerTool(
        'channels_getChannel',
        {
            title: 'Get Channel Information',
            description: 'Get information about a YouTube channel',
            annotations: { readOnlyHint: true, idempotentHint: true },
            inputSchema: {
                channelId: z.string().describe('The YouTube channel ID'),
            },
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

    server.registerTool(
        'channels_listVideos',
        {
            title: 'List Channel Videos',
            description: 'Get videos from a specific channel',
            annotations: { readOnlyHint: true, idempotentHint: true },
            inputSchema: {
                channelId: z.string().describe('The YouTube channel ID'),
                maxResults: z.number().optional().describe('Maximum number of results to return'),
            },
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

    // Register playlist tools
    server.registerTool(
        'playlists_getPlaylist',
        {
            title: 'Get Playlist Information',
            description: 'Get information about a YouTube playlist',
            annotations: { readOnlyHint: true, idempotentHint: true },
            inputSchema: {
                playlistId: z.string().describe('The YouTube playlist ID'),
            },
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

    server.registerTool(
        'playlists_getPlaylistItems',
        {
            title: 'Get Playlist Items',
            description: 'Get videos in a YouTube playlist',
            annotations: { readOnlyHint: true, idempotentHint: true },
            inputSchema: {
                playlistId: z.string().describe('The YouTube playlist ID'),
                maxResults: z.number().optional().describe('Maximum number of results to return'),
            },
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

    // Create transport and connect
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    // Log the server info
    console.log(`YouTube MCP Server v${packageVersion} started successfully`);
    console.log(`Server will validate YouTube API key when tools are called`);
    
    return server;
}