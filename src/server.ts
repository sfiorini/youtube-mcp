import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { createRequire } from 'node:module';
import { VideoService } from './services/video.js';
import { TranscriptService } from './services/transcript.js';
import { PlaylistService } from './services/playlist.js';
import { ChannelService } from './services/channel.js';

const require = createRequire(import.meta.url);
const packageVersion = require('../../package.json').version;

export async function startMcpServer() {
    const server = new McpServer({
        name: 'youtube-mcp',
        version: packageVersion,
    });

    const videoService = new VideoService();
    const transcriptService = new TranscriptService();
    const playlistService = new PlaylistService();
    const channelService = new ChannelService();

    // Register video tools
    server.registerTool(
        'videos_getVideo',
        {
            title: 'Get Video Details',
            description: 'Get detailed information about a YouTube video including URL',
            inputSchema: {
                videoId: z.string().describe('The YouTube video ID'),
                parts: z.array(z.string()).optional().describe('Parts of the video to retrieve'),
            },
            outputSchema: z.any() // Using any since the result structure varies
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
            inputSchema: {
                query: z.string().describe('Search query'),
                maxResults: z.number().optional().describe('Maximum number of results to return'),
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

    // Register transcript tool
    server.registerTool(
        'transcripts_getTranscript',
        {
            title: 'Get Video Transcript',
            description: 'Get the transcript of a YouTube video',
            inputSchema: {
                videoId: z.string().describe('The YouTube video ID'),
                language: z.string().optional().describe('Language code for the transcript'),
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

    // Register channel tools
    server.registerTool(
        'channels_getChannel',
        {
            title: 'Get Channel Information',
            description: 'Get information about a YouTube channel',
            inputSchema: {
                channelId: z.string().describe('The YouTube channel ID'),
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

    server.registerTool(
        'channels_listVideos',
        {
            title: 'List Channel Videos',
            description: 'Get videos from a specific channel',
            inputSchema: {
                channelId: z.string().describe('The YouTube channel ID'),
                maxResults: z.number().optional().describe('Maximum number of results to return'),
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

    // Register playlist tools
    server.registerTool(
        'playlists_getPlaylist',
        {
            title: 'Get Playlist Information',
            description: 'Get information about a YouTube playlist',
            inputSchema: {
                playlistId: z.string().describe('The YouTube playlist ID'),
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

    server.registerTool(
        'playlists_getPlaylistItems',
        {
            title: 'Get Playlist Items',
            description: 'Get videos in a YouTube playlist',
            inputSchema: {
                playlistId: z.string().describe('The YouTube playlist ID'),
                maxResults: z.number().optional().describe('Maximum number of results to return'),
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

    // Create transport and connect
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    // Log the server info
    console.log(`YouTube MCP Server v${packageVersion} started successfully`);
    console.log(`Server will validate YouTube API key when tools are called`);
    
    return server;
}
