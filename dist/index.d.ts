declare class AsyncLimitQueue {
    private _limit;
    private _queue;
    private _currentActionNum;
    constructor(limit?: number);
    private set _currentAction(value);
    private get _currentAction();
    private _addTask;
    push<T>(func: (...params: any[]) => Promise<T>): (...params: any[]) => Promise<T>;
    unshift<T>(func: (...params: any[]) => Promise<T>): (...params: any[]) => Promise<T>;
    clear(): void;
    getActionNum(): number;
    getPendingNum(): number;
}
