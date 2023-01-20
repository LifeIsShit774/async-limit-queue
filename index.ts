class AsyncLimitQueue {

    private _limit: number;
    private _queue: Array<() => void>;
    private _currentActionNum: number;

    constructor(limit: number = 10) {
        this._limit = limit;
        this._queue = [];
        this._currentActionNum = 0;
    }

    private set _currentAction(val: number) {
        this._currentActionNum = val;
        if (val < this._limit && this._queue.length > 0) {
            let task = this._queue.shift();
            task && task();
        }
    }

    private get _currentAction(): number {
        return this._currentActionNum;
    }

    private _addTask<T>(
        type: "push" | "unshift",
        func: (...params: any[]) => Promise<T>
    ) {
        return (...params: any[]): Promise<T> => {
            return new Promise((resolve, reject) => {
                const task = async () => {
                    this._currentAction++;
                    let [err, res] = await func(...params).then(res => [null, res]).catch(err => [err, null]);
                    this._currentAction--;
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(res);
                    }
                };
                if (type === "push") {
                    this._queue.push(task);
                } else {
                    this._queue.unshift(task)
                }
                if (this._currentAction < this._limit) {
                    this._currentAction = this._currentActionNum
                }
            });
        }
    }

    public push<T>(
        func: (...params: any[]) => Promise<T>
    ) {
        return this._addTask("push", func)
    }

    public unshift<T>(
        func: (...params: any[]) => Promise<T>
    ) {
        return this._addTask("unshift", func)
    }

    public clear() {
        this._queue = [];
    }

    public getActionNum(): number {
        return this._currentAction;
    }

    public getPendingNum(): number {
        return this._queue.length;
    }

}

module.exports = AsyncLimitQueue;