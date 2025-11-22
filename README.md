# YouTube MCP Server

[![smithery badge](https://smithery.ai/badge/@sfiorini/youtube-mcp)](https://smithery.ai/server/@sfiorini/youtube-mcp)

A Model Context Protocol (MCP) server implementation for YouTube, enabling AI language models to interact with YouTube content through a standardized interface. Optimized for **90% Smithery quality score** with comprehensive resources, prompts, and flexible configuration.

## Features

### Video Information

* Get video details (title, description, duration, etc.) **with direct URLs**
* List channel videos **with direct URLs**
* Get video statistics (views, likes, comments)
* Search videos across YouTube **with direct URLs**
* **NEW**: Enhanced video responses include `url` and `videoId` fields for easy integration

### Transcript Management

* Retrieve video transcripts
* Support for multiple languages
* Get timestamped captions
* Search within transcripts

### Direct Resources & Prompts

* **Resources**:
  * `youtube://transcript/{videoId}`: Access transcripts directly via resource URIs
  * `youtube://info`: Server information and usage documentation (Smithery discoverable)
* **Prompts**:
  * `summarize-video`: Automated workflow to get and summarize video content
  * `analyze-channel`: Comprehensive analysis of a channel's content strategy
* **Annotations**: All tools include capability hints (read-only, idempotent) for better LLM performance

### Channel Management

* Get channel details
* List channel playlists
* Get channel statistics
* Search within channel content

### Playlist Management

* List playlist items
* Get playlist details
* Search within playlists
* Get playlist video transcripts

## Installation

### Quick Setup for Claude Desktop

1. Install the package:

```bash
npm install -g @sfiorini/youtube-mcp
```

1. Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS or `%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "youtube-mcp": {
      "command": "youtube-mcp",
      "env": {
        "YOUTUBE_API_KEY": "your_youtube_api_key_here"
      }
    }
  }
}
```

### Alternative: Using NPX (No Installation Required)

Add this to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "youtube": {
      "command": "npx",
      "args": ["-y", "@sfiorini/youtube-mcp"],
      "env": {
        "YOUTUBE_API_KEY": "your_youtube_api_key_here"
      }
    }
  }
}
```

### Installing via Smithery

To install YouTube MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@sfiorini/youtube-mcp):

```bash
npx -y @smithery/cli@latest install @sfiorini/youtube-mcp --client claude
```

## Configuration

Set the following environment variables:

* `YOUTUBE_API_KEY`: Your YouTube Data API key (required)
* `YOUTUBE_TRANSCRIPT_LANG`: Default language for transcripts (optional, defaults to 'en')

### Using with VS Code

For one-click installation, click one of the install buttons below:

[![Install with NPX in VS Code](https://img.shields.io/badge/VS_Code-NPM-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=youtube&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40sfiorini%2Fyoutube-mcp%22%5D%2C%22env%22%3A%7B%22YOUTUBE_API_KEY%22%3A%22%24%7Binput%3AapiKey%7D%22%7D%7D&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22apiKey%22%2C%22description%22%3A%22YouTube+API+Key%22%2C%22password%22%3Atrue%7D%5D) [![Install with NPX in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-NPM-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=youtube&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40sfiorini%2Fyoutube-mcp%22%5D%2C%22env%22%3A%7B%22YOUTUBE_API_KEY%22%3A%22%24%7Binput%3AapiKey%7D%22%7D%7D&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22apiKey%22%2C%22description%22%3A%22YouTube+API+Key%22%2C%22password%22%3Atrue%7D%5D&quality=insiders)

### Manual Installation

If you prefer manual installation, first check the install buttons at the top of this section. Otherwise, follow these steps:

Add the following JSON block to your User Settings (JSON) file in VS Code. You can do this by pressing `Ctrl + Shift + P` and typing `Preferences: Open User Settings (JSON)`.

```json
{
  "mcp": {
    "inputs": [
      {
        "type": "promptString",
        "id": "apiKey",
        "description": "YouTube API Key",
        "password": true
      }
    ],
    "servers": {
      "youtube": {
        "command": "npx",
        "args": ["-y", "@sfiorini/youtube-mcp"],
        "env": {
          "YOUTUBE_API_KEY": "${input:apiKey}"
        }
      }
    }
  }
}
```

Optionally, you can add it to a file called `.vscode/mcp.json` in your workspace:

```json
{
  "inputs": [
    {
      "type": "promptString",
      "id": "apiKey",
      "description": "YouTube API Key",
      "password": true
    }
  ],
  "servers": {
    "youtube": {
      "command": "npx",
      "args": ["-y", "@sfiorini/youtube-mcp"],
      "env": {
        "YOUTUBE_API_KEY": "${input:apiKey}"
      }
    }
  }
}
```

## YouTube API Setup

1. Go to Google Cloud Console
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create API credentials (API key)
5. Copy the API key for configuration

## Examples

### Managing Videos

```javascript
// Get video details (now includes URL)
const video = await youtube.videos.getVideo({
  videoId: "dQw4w9WgXcQ"
});

// Enhanced response now includes:
// - video.url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
// - video.videoId: "dQw4w9WgXcQ"
// - All original YouTube API data

// Get video transcript
const transcript = await youtube.transcripts.getTranscript({
  videoId: "video-id",
  language: "en"
});

// Search videos (results now include URLs)
const searchResults = await youtube.videos.searchVideos({
  query: "search term",
  maxResults: 10
});

// Each search result includes:
// - result.url: "https://www.youtube.com/watch?v={videoId}"
// - result.videoId: "{videoId}"
// - All original YouTube search data
```

### Managing Channels

```javascript
// Get channel details
const channel = await youtube.channels.getChannel({
  channelId: "channel-id"
});

// List channel videos
const videos = await youtube.channels.listVideos({
  channelId: "channel-id",
  maxResults: 50
});
```

### Managing Playlists

```javascript
// Get playlist items
const playlistItems = await youtube.playlists.getPlaylistItems({
  playlistId: "playlist-id",
  maxResults: 50
});

// Get playlist details
const playlist = await youtube.playlists.getPlaylist({
  playlistId: "playlist-id"
});
```

## Enhanced Response Structure

### Video Objects with URLs

All video-related responses now include enhanced fields for easier integration:

```typescript
interface EnhancedVideoResponse {
  // Original YouTube API fields
  kind?: string;
  etag?: string;
  id?: string | YouTubeSearchResultId;
  snippet?: YouTubeSnippet;
  contentDetails?: any;
  statistics?: any;

  // NEW: Enhanced fields
  url: string;           // Direct YouTube video URL
  videoId: string;       // Extracted video ID
}
```

### Example Enhanced Response

```json
{
  "kind": "youtube#video",
  "id": "dQw4w9WgXcQ",
  "snippet": {
    "title": "Never Gonna Give You Up",
    "channelTitle": "Rick Astley",
    "description": "Official video for \"Never Gonna Give You Up\""
  },
  "statistics": {
    "viewCount": "1.5B",
    "likeCount": "15M"
  },
  // Enhanced fields:
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "videoId": "dQw4w9WgXcQ"
}
```

### Benefits

* **Easy URL Access**: No need to manually construct URLs
* **Consistent Structure**: Both search and individual video responses include URLs
* **Backward Compatible**: All existing YouTube API data is preserved
* **Type Safe**: Full TypeScript support available

## Development

```bash
# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Development mode with auto-rebuild and hot reload
npm run dev

# Start the server (requires YOUTUBE_API_KEY)
npm start

# Publish to npm (runs build first)
npm run prepublishOnly
```

### Architecture

This project uses a **dual-architecture service-based design** with the following features:

* **Shared Utilities**: Single source of truth for all MCP server configuration (`src/server-utils.ts`)
* **Modern McpServer**: Updated from deprecated `Server` class to the new `McpServer`
* **Dynamic Version Management**: Version automatically read from `package.json`
* **Type-Safe Tool Registration**: Uses `zod` schemas for input validation
* **ES Modules**: Full ES module support with proper `.js` extensions
* **Enhanced Video Responses**: All video operations include `url` and `videoId` fields
* **Lazy Initialization**: YouTube API client initialized only when needed
* **Code Deduplication**: Eliminated 90% code duplication through shared utilities (407 → 285 lines)

### Project Structure

```diagram
src/
├── server-utils.ts        # 🆕 Shared MCP server utilities (single source of truth)
├── index.ts              # Smithery deployment entry point
├── server.ts             # CLI deployment entry point
├── services/             # Core business logic
│   ├── video.ts         # Video operations (search, getVideo)
│   ├── transcript.ts    # Transcript retrieval
│   ├── playlist.ts      # Playlist operations
│   └── channel.ts       # Channel operations
├── types.ts             # TypeScript interfaces
└── cli.ts               # CLI wrapper for standalone execution
```

### Key Features

* **Smithery Optimized**: Achieved 90%+ Smithery quality score with comprehensive resources, prompts, and configuration
* **Shared Utilities Architecture**: Eliminated 90% code duplication with single source of truth
* **Enhanced Video Responses**: All video objects include direct YouTube URLs
* **Flexible Configuration**: Optional config via Smithery UI or environment variables
* **Type-Safe Development**: Full TypeScript support with `zod` validation
* **Modern MCP Tools**: Uses `registerTool` instead of manual request handlers
* **Comprehensive Resources**: Discoverable resources and prompts for better LLM integration
* **Error Handling**: Comprehensive error handling with descriptive messages

## Contributing

See CONTRIBUTING.md for information about contributing to this repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
