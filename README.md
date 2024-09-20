# HappyHandler

HappyHandler is a flexible, type-safe handler for promises that simplifies the process of handling success, error, and unknown responses. It allows you to forget about manually catching errors or validating response types, making your code cleaner and easier to manage.

## Features

- 🧠 **Type-safe handling**: Define your success and error response types easily.
- ⚡ **Timeout support**: Automatically cancels long-running operations with a configurable timeout.
- 💼 **Plug-and-play**: Works with any promise-returning function, including libraries like Axios or native async functions.
- 🔧 **Customizable**: Handle unknown responses, success and error in a structured way.

## Installation

You can install the library via NPM:

```bash
npm install happy-handler
```

## Basic Usage
### Example with axios

```typescript
import HappyHandler from 'happy-handler';
import axios from 'axios';

// Create an instance of Axios
const axiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000, // Timeout for Axios (5 seconds)
});

// Define response and error interfaces
interface ValidRes {
  id: number;
  title: string;
}

interface ValidError {
  errorCode: string;
}

// Instantiate the handler
const handler = new HappyHandler({
  timeout: 30000,  // Custom timeout for the handler (30 seconds)
});

// Handle an Axios request
handler.handle({
  func: () => axiosInstance.get('/posts/1'),
  validResponses: [ValidRes],
  validErrors: [ValidError],
  onSuccess: (data) => {
    console.log('Successful response:', data);
  },
  onError: (error) => {
    console.log('Handled error:', error);
  },
  onUnknown: (unknown) => {
    console.warn('Unknown case detected:', unknown);
  },
});
```

### Example with a Custom Async Function

```typescript
import HappyHandler from 'happy-handler';

// Custom function returning a promise
async function fetchData(): Promise<{ data: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: 'Some fetched data' });
    }, 1000);
  });
}

// Define response and error interfaces
interface FetchSuccess {
  data: string;
}

interface FetchError {
  error: string;
}

// Instantiate the handler
const handler = new HappyHandler({
  timeout: 5000,  // 5 seconds timeout
});

// Handle a custom async function
handler.handle({
  func: fetchData,
  validResponses: [FetchSuccess],
  validErrors: [FetchError],
  onSuccess: (data) => {
    console.log('Custom function successful:', data);
  },
  onError: (error) => {
    console.error('Custom function error:', error);
  },
  onUnknown: (unknown) => {
    console.warn('Unknown case in custom function:', unknown);
  },
});
```

## API Reference
| Method | Description |
| -------- | ------- |
| handle | Executes the passed function and processes success, error, or unknown responses based on the configuration. |

```
handle(config: HandleConfig)
```

Executes any function that returns a promise and handles the result based on predefined response and error types.

### Parameters:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| Func | () => Promise<any> | The function that returns a promise. Can be an HTTP request, database query, or any async function. |
| validResponses | Array<any> | Array of valid response types. Success responses matching any of these types will trigger *onSuccess*. |
| validErrors | Array<any>	 | 	Array of valid error types. Errors matching any of these types will trigger *onError*.
| onSuccess | (response: any) => void | Callback function executed when the response matches one of the valid response types. |
| onError | (error: any) => void | allback function executed when the error matches one of the valid error types. |
| onUnknown? | (unknown: any) => void | Optional callback for handling unknown responses that don’t match either success or error types. |
| timeout? | number | Optional timeout in milliseconds for the operation (default is 5000 ms). |

### Success and Error Type Matching

To simplify the validation, the library uses type inference based on the structure of the data. When you pass the validResponses or validErrors, the handler will check if the result matches any of the specified types. For example:

```typescript
interface ValidResponse1 {
  id: number;
  title: string;
}

interface ValidResponse2 {
  name: string;
  age: number;
}

handler.handle({
  func: () => axiosInstance.get('/posts/1'),
  validResponses: [ValidResponse1, ValidResponse2], // Multiple success types
  validErrors: [ErrorInterface],  // Multiple error types
  onSuccess: (data) => {
    switch (data.constructor) {
      case ValidResponse1:
        console.log('Matched ValidResponse1:', data);****
        break;
      case ValidResponse2:
        console.log('Matched ValidResponse2:', data);
        break;
    }
  },
  onError: (error) => {
    console.error('Handled error:', error);
  },
  onUnknown: (unknown) => {
    console.warn('Unknown case detected:', unknown);
  },
});
```

## License
MIT License.