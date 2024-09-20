export interface HandlerConfig<TSuccess, TError> {
  validResponses: Array<new () => TSuccess>;
  validErrors: Array<new () => TError>;
  onSuccess: (response: TSuccess) => void;
  onError: (error: TError) => void;
  onUnknown?: (unknown: any) => void;
  timeout?: number;
}

export class HappyHandler {
  private config?: Partial<HandlerConfig<any, any>>;

  constructor(config?: Partial<HandlerConfig<any, any>>) {
    this.config = config;
  }

  public async handle<TSuccess, TError>(
    func: () => Promise<any>,
    config: HandlerConfig<TSuccess, TError>
  ): Promise<void> {
    const timeout = config.timeout || this.config?.timeout || 5000;

    try {
      const response = await this.withTimeout(func(), timeout);
      this.processResponse(response, config);
    } catch (error) {
      this.processError(error, config);
    }
  }

  private withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("Operation timed out"));
      }, ms);

      promise
        .then((res) => {
          clearTimeout(timeoutId);
          resolve(res);
        })
        .catch((err) => {
          clearTimeout(timeoutId);
          reject(err);
        });
    });
  }

  private processResponse<TSuccess>(
    response: any,
    config: HandlerConfig<TSuccess, any>
  ) {
    const matchedType = config.validResponses.find((type) =>
      this.isMatchingType(response, type)
    );

    if (matchedType) {
      config.onSuccess(new matchedType() as TSuccess);
    } else {
      this.handleUnknown(response, config);
    }
  }

  private processError<TError>(error: any, config: HandlerConfig<any, TError>) {
    const matchedError = config.validErrors.find((type) =>
      this.isMatchingType(error, type)
    );

    if (matchedError) {
      config.onError(new matchedError() as TError);
    } else {
      this.handleUnknown(error, config);
    }
  }

  private isMatchingType(instance: any, type: new () => any): boolean {
    const typeInstance = new type();
    return Object.keys(typeInstance).every((key) => key in instance);
  }

  private handleUnknown(unknown: any, config: HandlerConfig<any, any>) {
    if (config.onUnknown) {
      config.onUnknown(unknown);
    } else {
      console.warn("Unknown response:", unknown);
    }
  }
}
