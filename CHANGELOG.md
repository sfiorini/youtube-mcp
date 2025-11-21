# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.8] - 2025-11-21

### Fixed

- Fixed MCP tool output validation errors causing "structured content was provided" errors
- Removed restrictive output schemas to allow standard MCP content format
- Tools now return data in correct MCP response format without schema conflicts
- Resolved "Output validation error" messages in LibreChat

## [0.1.7] - 2025-11-21

### Fixed

- Fixed MCP tool output schema validation errors in LibreChat
- Replaced `z.any()` output schemas with proper object schemas
- Resolved "Invalid literal value, expected \"object\"" errors for all tools
- All tools now return properly structured response schemas

## [0.1.6] - 2025-11-21

### Fixed

- Restored CLI entry point for `npx` compatibility with LibreChat
- Fixed "Cannot find module '../../package.json'" error by using hardcoded version
- Resolved dependency resolution issues that caused crashes in Node.js environments
- Package now works with both CLI (`npx @sfiorini/youtube-mcp`) and Smithery import patterns

## [0.1.5] - 2025-11-21

### Removed

- **BREAKING**: Removed CLI entry point and `bin` field from package.json
- **BREAKING**: Removed deprecated `src/server.ts` and `src/cli.ts` files
- Simplified package structure to focus on MCP server functionality
- Package now only exports the `createServer` function for Smithery/MCP clients

### Fixed

- Resolved "Cannot find module '../../package.json'" error in npm package
- Eliminated dependency resolution issues that caused crashes in Node.js environments
- Fixed build errors by removing references to deleted server files

## [0.1.4] - 2025-11-21

### Fixed

- Added missing `zod-to-json-schema` dependency to resolve MCP SDK import errors
- Resolved module resolution issues that caused crashes in Node.js environments

## [0.1.3] - 2025-11-21

### Fixed

- **BREAKING**: Corrected Smithery deployment architecture to use proper pattern
- **BREAKING**: Moved `createServer` function from `smithery-index.ts` to `src/index.ts`

### Changed

- **BREAKING**: Implemented proper Smithery pattern with `export default createServer`
- **BREAKING**: Replaced JSON Schema format with Zod schemas for MCP SDK compatibility
- Simplified server architecture by following official Smithery specification
- Enhanced error handling and type safety throughout the codebase

## [0.1.2] - 2025-11-20

### Added

- Enhanced video responses with direct YouTube URLs
- Structured video objects with `url` and `videoId` fields
- TypeScript example documentation for enhanced responses
- Comprehensive documentation updates

### Changed

- **BREAKING**: Migrated from deprecated `Server` to modern `McpServer` class
- **BREAKING**: Updated tool registration from `setRequestHandler` to `registerTool`
- Replaced manual schema validation with `zod` type-safe schemas
- Dynamic version management from `package.json`
- Updated all video service methods to return enhanced structured responses
- Fixed smithery-index.ts TypeScript errors with modern schema approach

### Improved

- Type-safe tool registration with proper input validation
- Better error handling and user feedback
- Enhanced logging with dynamic version information
- Modern ES module patterns throughout codebase

## [0.1.1] - 2025-11-19

### Added

- Enhanced video responses with `url` and `videoId` fields
- Support for direct YouTube video URLs in all video operations
- `VideoService.createStructuredVideo()` helper method
- `VideoService.createStructuredVideos()` helper method

### Changed

- Updated `getVideo()` method to return enhanced response with URL
- Updated `searchVideos()` method to return enhanced responses with URLs
- Updated `getTrendingVideos()` method to include URLs
- Updated `getRelatedVideos()` method to include URLs
- Enhanced tool descriptions to highlight URL support

### Fixed

- Consistent video ID extraction from different YouTube API response formats
- Maintained backward compatibility with existing YouTube API data

### Documentation

- Added comprehensive enhanced response structure documentation
- Updated examples to show new URL-inclusive responses
- Added TypeScript interface documentation
- Created example TypeScript file demonstrating enhanced usage

## [0.1.0] - 2025-11-19

### Added

- Initial MCP server implementation for YouTube
- Video operations: get video details, search videos
- Transcript management with multi-language support
- Channel operations: get channel info, list videos
- Playlist operations: get playlist details, list items
- Full TypeScript support with proper type definitions
- ES module compatibility
- Environment variable validation
- Comprehensive error handling
- npm package publishing with `@sfiorini/youtube-mcp`

### Features

- YouTube Data API v3 integration
- Lazy API client initialization
- Multiple installation methods (npm, npx, smithery)
- Claude Desktop and VS Code integration
- Development tooling with hot reload

### Documentation

- Complete README with installation and usage examples
- Developer documentation in CLAUDE.md
- Project architecture documentation
- API setup instructions
