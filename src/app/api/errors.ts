export enum ErrorCode {
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
    QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
    INVALID_API_KEY = 'INVALID_API_KEY',
}

export function getErrorMessage(code: ErrorCode): string {
    switch (code) {
        case ErrorCode.QUOTA_EXCEEDED:
            return 'You have exceeded your usage quota. Please upgrade your plan.';
        case ErrorCode.INVALID_API_KEY:
            return 'The provided API key is invalid or has expired.';
        case ErrorCode.UNKNOWN_ERROR:
        default:
            return 'An unexpected error occurred. Please try again later.';
    }
}