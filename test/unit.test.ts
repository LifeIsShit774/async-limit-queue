const test = require('tape');
const AsyncLimitQueue = require('../dist');

const sleep = (time) => new Promise((res) => setTimeout(res, time));

test('导出测试', (t) => {
    t.plan(2);
    t.ok(AsyncLimitQueue, '默认导出存在');
    t.equal(typeof AsyncLimitQueue, 'function', '导出类型为class');
});

test('限制并发测试', (t) => {
    t.plan(4);
    const queue = new AsyncLimitQueue(3);
    const count = [0];
    for (let i = 0; i < 30; i++) {
        const asyncFunc = async()=>{
            count.push(count[count.length - 1] + 1);
            await sleep(10);
            count.push(count[count.length - 1] - 1);
        }
        queue.push(asyncFunc)();
    }
    t.equal(queue.getActionNum(), 3, '获取正在执行数量');
    t.equal(queue.getPendingNum(), 27, '获取等待数量');

    setTimeout(() => {
        t.true(count.every(c => c <= 3), '限制并发');
        t.equal(Math.max(...count), 3, '执行队列到最大数量');
    }, 500)
});

test("push unshift 顺序测试", (t) => {
    t.plan(1);
    const queue = new AsyncLimitQueue(3);
    const result = ["start"];
    for (let i = 0; i < 10; i++) {
        queue.push(async () => {
            await sleep(10);
            result.push("push");
        })();
    }
    queue.unshift(async () => {
        await sleep(10);
        result.push("unshift");
    })();

    setTimeout(() => {
        t.equal(result[4], "unshift", "unshift 优先执行");
    },500)
})