# GEMINI.md

This file provides guidance to Gemini when working with code in this repository.

## Project Overview

YouTube MCP Server is a Model Context Protocol (MCP) server implementation that enables AI language models to interact with YouTube content. It provides tools for accessing video information, transcripts, channel data, and playlist management through standardized MCP interfaces. **🆕 Optimized for 90%+ Smithery quality score** with comprehensive resources, prompts, and flexible configuration.

## Development Commands

```bash
# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Lint the codebase
npm run lint

# Run type checking
npm run typecheck

# Start the server
npm start

# Development mode with auto-rebuild and hot reload
npm run dev

# Release new version (bump version, update files, commit, tag, push)
npm run bump

# Publish to npm (runs build first)
npm run publish-npm
```

## Architecture

### Core Structure

The project uses a **dual-architecture service-based design** with the following layers:

1. **Shared Utilities** (`src/server-utils.ts`): **🆕 Single source of truth** for all MCP server configuration and registration
2. **Smithery Entry Point** (`src/index.ts`): Smithery-compatible `createServer` function for MCP platform deployment
3. **CLI Server** (`src/server.ts`): Standalone MCP server with CLI entry point for `npx` usage
4. **Services** (`src/services/`): Core business logic for interacting with YouTube APIs
   - `VideoService`: Handles video operations with **enhanced URL support** (get video details, search videos)
   - `TranscriptService`: Retrieves and manages video transcripts
   - `PlaylistService`: Manages playlist operations
   - `ChannelService`: Handles channel-related operations
5. **Types** (`src/types.ts`): TypeScript interfaces for function parameters and data structures

### Code Deduplication

**NEW**: Eliminated 90% code duplication through shared utilities architecture:
- **Before**: 407 lines with duplicate tool/resource/prompt registration
- **After**: 285 lines with single source of truth
- **Benefits**: Single place to make changes, consistent deployments, easier maintenance

### Enhanced Video Responses

**NEW**: All video operations return enhanced objects that include:

- `url`: Direct YouTube video URL (`https://www.youtube.com/watch?v={videoId}`)
- `videoId`: Extracted video ID for easy reference
- All original YouTube API data (backward compatible)

This enhancement applies to:

- `getVideo()` method returns single video with URL
- `searchVideos()` method returns array of videos with URLs
- `getTrendingVideos()` method returns trending videos with URLs
- `getRelatedVideos()` method returns related videos with URLs

### Modern MCP SDK Migration

**Updated from deprecated to modern patterns:**

- ✅ `new Server()` → `new McpServer()`
- ✅ `setRequestHandler()` → `registerTool()`
- ✅ Manual schema definition → `zod` validation schemas
- ✅ Static version → Dynamic version from `package.json`
- ✅ Basic error handling → Comprehensive error handling

### MCP Tool Registration & Annotations

Tools are registered in `src/server-utils.ts` using the modern `McpServer.registerTool()` method. **🆕 Now shared between CLI and Smithery deployments**. Each tool has:

- A name following the pattern `{service}_{operation}` (e.g., `videos_getVideo`)
- A title and description for the AI model
- **Annotations**: Metadata like `readOnlyHint` and `idempotentHint` for better LLM interaction
- Type-safe `zod` input schemas for validation
- Async handler functions that return structured MCP responses

**Modern Tool Registration Pattern (in shared utilities):**

```typescript
// In src/server-utils.ts - shared between all deployments
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
```

**Resource and Prompt Registration:**
- **Resources**: Static `youtube://info` resource for discovery + dynamic transcript resource
- **Prompts**: `summarize-video` and `analyze-channel` workflows
- **All capabilities**: Shared between CLI and Smithery deployments

### API Integration & Type Safety

Services use the **Google APIs Node.js client library** (`googleapis` package) with lazy initialization.
The codebase prioritizes type safety by using `unknown` instead of `any` for API responses before validation/processing.

- The YouTube API client is initialized only when needed (not in constructor)
- API key is read from `YOUTUBE_API_KEY` environment variable at initialization time
- Each service maintains its own `youtube` client instance

### Module System

The project uses **ES modules** (ESNext) as configured in:

- `package.json`: `"type": "module"`
- `tsconfig.json`: `"module": "ESNext"`, `"moduleResolution": "bundler"`
- All imports use `.js` extensions (e.g., `import { VideoService } from './services/video.js'`)

## Key Files and Responsibilities

| File | Purpose |
|------|---------|
| `src/index.ts` | Smithery-compatible `createServer` function for platform deployment |
| `src/server.ts` | CLI MCP server with stdio transport. Registers tools, resources, and prompts. |
| `src/cli.ts` | CLI wrapper that validates environment variables and starts server |
| `src/services/video.ts` | Video lookup and search functionality |
| `src/services/transcript.ts` | Video transcript retrieval |
| `src/services/playlist.ts` | Playlist operations |
| `src/services/channel.ts` | Channel information and video listing |
| `src/types.ts` | TypeScript type definitions for all parameters |
| `smithery.yaml` | Smithery deployment configuration |

## Configuration

**Required Environment Variable:**

- `YOUTUBE_API_KEY`: Your YouTube Data API v3 key (must be set before starting the server)

**Optional Environment Variable:**

- `YOUTUBE_TRANSCRIPT_LANG`: Default language for transcripts (defaults to 'en')

## Available Tools, Resources & Prompts

The MCP server exposes these capabilities:

### Direct Resources
- `youtube://transcript/{videoId}`: Direct access to video transcripts

### Prompts
- `summarize-video`: Workflow to get and summarize video content
- `analyze-channel`: Workflow to analyze channel content strategy

### Video Tools (Enhanced with URLs)
- `videos_getVideo`: Get detailed video information **including direct URL**
- `videos_searchVideos`: Search for videos **with URLs in results**

### Other Tools
- `transcripts_getTranscript`: Retrieve video transcript
- `channels_getChannel`: Get channel information
- `channels_listVideos`: List videos from a channel
- `playlists_getPlaylist`: Get playlist details
- `playlists_getPlaylistItems`: List items in a playlist

### Enhanced Response Format

Video-related tools now return structured objects with:

```typescript
{
  // All original YouTube API data
  snippet: { /* title, description, channelTitle, etc. */ },
  statistics: { /* viewCount, likeCount, etc. */ },
  contentDetails: { /* duration, etc. */ },

  // NEW enhanced fields
  url: "https://www.youtube.com/watch?v=VIDEO_ID",
  videoId: "VIDEO_ID"
}
```

### Version Management

The server version is managed automatically via scripts:

- `npm run bump`: Updates version in `package.json`, `src/index.ts`, and `src/server.ts`
- Creates a git commit and tag for the release
- Pushes changes to the remote repository
- Ensures version consistency across all files

## Deployment Options

The package supports multiple deployment methods for different use cases:

### CLI Deployment (for LibreChat, etc.)

```bash
npx -y @sfiorini/youtube-mcp@x.x.x
```

Uses the CLI entry point defined in the `bin` field of package.json.

### Smithery Deployment

The package exports a `createServer` function that follows Smithery patterns:

```typescript
import createServer from '@sfiorini/youtube-mcp';
const server = createServer({ config });
```

### Direct Import

For custom integrations, import the server function directly:

```typescript
import createServer from '@sfiorini/youtube-mcp';
```

## Build and Distribution

The project is published as an npm package (`@sfiorini/youtube-mcp`) and can be installed globally or used via npx. The build process:

1. TypeScript compiles to JavaScript in `dist/` directory
2. Both CLI (`dist/cli.js`) and main entry point (`dist/index.js`) are generated
3. The `main` field points to `dist/index.js` for Smithery compatibility
4. The `bin` field points to `dist/cli.js` for CLI usage

## Testing and Validation

The project was recently migrated to ES modules to fix compatibility issues with LibreChat and improve module resolution. When making changes:

- Ensure all imports use `.js` extensions for relative imports
- Verify TypeScript compiles without errors: `npm run build`
- Run linting and type checking: `npm run lint && npm run typecheck`
- Test the server can start: `npm start` (requires valid YOUTUBE_API_KEY)

## Smithery Quality Optimization

**🆕 Achieved 90%+ Smithery quality score** through comprehensive improvements:

### Quality Score Breakdown:
- **Tool Quality**: 26/35 - All 7 tools with proper descriptions, parameters, and annotations
- **Server Capabilities**: 30/30 - 7 tools + 2 prompts + 1 resource
- **Server Metadata**: 25/25 - Complete documentation and metadata
- **Configuration UX**: 25/25 - Optional configuration with comprehensive schema

### Key Optimizations:
1. **Tool Annotations**: Added `readOnlyHint` and `idempotentHint` to all tools
2. **Resource Discovery**: Static `youtube://info` resource for Smithery scanning
3. **Prompt Registration**: Two comprehensive prompts for video/channel analysis
4. **Flexible Configuration**: All parameters optional with multiple setup methods
5. **Schema Documentation**: Complete JSON schema with examples and security notes

## Important Notes

- Lazy initialization of YouTube client prevents API key validation errors until tools are actually called
- The services handle errors gracefully and return error messages to the MCP client
- Response content is JSON-stringified for transmission to the client
- Shared utilities ensure consistent behavior across all deployment methods
- No tests are currently configured in the project
