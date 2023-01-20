"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class AsyncLimitQueue {
    constructor(limit = 10) {
        this._limit = limit;
        this._queue = [];
        this._currentActionNum = 0;
    }
    set _currentAction(val) {
        this._currentActionNum = val;
        if (val < this._limit && this._queue.length > 0) {
            let task = this._queue.shift();
            task && task();
        }
    }
    get _currentAction() {
        return this._currentActionNum;
    }
    _addTask(type, func) {
        return (...params) => {
            return new Promise((resolve, reject) => {
                const task = () => __awaiter(this, void 0, void 0, function* () {
                    this._currentAction++;
                    let [err, res] = yield func(...params).then(res => [null, res]).catch(err => [err, null]);
                    this._currentAction--;
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(res);
                    }
                });
                if (type === "push") {
                    this._queue.push(task);
                }
                else {
                    this._queue.unshift(task);
                }
                if (this._currentAction < this._limit) {
                    this._currentAction = this._currentActionNum;
                }
            });
        };
    }
    push(func) {
        return this._addTask("push", func);
    }
    unshift(func) {
        return this._addTask("unshift", func);
    }
    clear() {
        this._queue = [];
    }
    getActionNum() {
        return this._currentAction;
    }
    getPendingNum() {
        return this._queue.length;
    }
}
module.exports = AsyncLimitQueue;
