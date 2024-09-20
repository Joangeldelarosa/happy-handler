# HappyHandler

**Forget about handling responses and detecting types manually.**

`HappyHandler` is a TypeScript utility that simplifies handling of asynchronous functions, such as HTTP requests or any other promise-returning functions. It provides a clean way to define success and error types, removing the need to manually handle responses and errors every time.

## Features
- **Easy to use:** Pass your async function and response types directly into `HappyHandler`.
- **Supports any async function:** Whether it's an HTTP request with `axios`, a database query, or a custom function, `HappyHandler` handles it.
- **Automatic type detection:** You define your expected success and error types once, and `HappyHandler` handles the rest.
- **Timeout control:** Set a global or per-request timeout to avoid long-running operations.

## Installation

```bash
npm install happy-handler