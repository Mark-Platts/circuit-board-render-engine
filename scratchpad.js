
function tester(first, second, third = 'def', fourth = 'def') {
    return [first, second, third, fourth];
}

console.log(tester(1, 2, fourth = 4));