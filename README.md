# async-limit-queue

异步函数并发限制队列，支持添加到队列头部和队列尾部，支持清空队列，支持获取正在执行的函数数量和等待执行的函数数量。

可用于网络请求并发限制，在需要的时候可以清空队列，取消未执行的请求，或其他需要限制并发数量的场景。

## Description

当你需要执行多个异步函数，但是又不想让它们一次性全部执行完毕，而是想让它们按照一定的并发数执行，这时候你就可以使用这个库了。

这个模块导出了一个类，你可以通过实例化这个类创建一个队列，这个队列可以接受一个并发数，你可以使用 `push`或者`unshift`方法将异步函数添加到队列中，他们的区别在于`push`是将函数添加到队列的尾部，而`unshift`是将函数添加到队列的头部，当队列并发执行数量小于并发数时，队列会自动执行队列中的函数，当队列并发执行数量等于并发数时，队列会暂停执行，直到有函数执行完毕，队列才会继续执行。

## Get it

```sh
npm i @wallfacer/async-limit-queue
yarn add @wallfacer/async-limit-queue
```

## Usage

```javascript
import AsyncLimitQueue from "@wallfacer/async-limit-queue";

// 实例化一个并发数为3的队列
const queue = new AsyncLimitQueue(3);

function func(number) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      console.log("func" + number);
      res(number);
    }, 1000);
  });
}

// push 和 unshift 方法是一个高阶函数，返回一个函数
// 这个函数的参数就是你要执行的异步函数的参数，这个函数返回一个Promise
// 当你的异步函数执行完毕后，这个Promise会被resolve，resolve的值就是你的异步函数的返回值

// 向队列尾部添加函数
queue.push(func)(1);
queue.push(func)(2);
queue.push(func)(3);
queue.push(func)(4);

// 向队列头部添加函数
queue.unshift(func)(1);

// 清空队列，正在执行的函数会继续执行
queue.clear();

// 获取正在执行的函数数量
queue.getActionNum();

// 获取等待执行的函数数量
queue.getPendingNum();
```
