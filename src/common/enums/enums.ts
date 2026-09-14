export enum TaskStatus {
    New,
    InProgress,
    Completed,
    Draft,
}

export enum TaskPriority {
    Low,
    Middle,
    High,
    Urgent,
    Later,
}

export enum ResultCode {
    Success = 0,
    Error = 1,
    CaptchaError = 10,
}
