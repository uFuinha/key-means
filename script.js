function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let values = []
let m = 8;
for (let i = 0; i < m; i++) {
    let random = getRandomInt(1, 20);
    while (values.indexOf(random) != -1) random = getRandomInt(1, 20);
    values.push(random);
}

let container = document.querySelector('#container');

for (let i = 0; i < values.length; i++) {
    let ball = document.createElement('div');
    ball.classList.add('ball');
    ball.dataset.x = values[i] * 25;
    ball.style.left = `${ball.dataset.x}px`;
    container.appendChild(ball);
}

const K = 3;
let means = [];
for (let i = 0; i < K; i++) {
    let random = 50 * i;
    random = getRandomInt(1, 20) * i;
    means.push(random);
}

let clusters = {}
let meanElements = []
for (let i = 0; i < means.length; i++) {
    let mean = document.createElement('div');
    mean.classList.add('mean');
    mean.dataset.x = values[i] * 30 - 30;
    mean.dataset.id = i;
    mean.style.left = `${mean.dataset.x}px`;

    mean.dataset.color = `rgb(${parseInt(255 - (255 / K * i))}, ${255}, ${parseInt(0 + (255 / K * i))})`
    mean.style.background = mean.dataset.color;
    meanElements.push(mean);
    clusters[mean.dataset.color] = {
        quant: 0,
        sum: 0
    };

    container.appendChild(mean);
}
console.log(clusters)

let oldMeans = []
let balls = document.querySelectorAll('.ball');

var MARGIN = 200;
var updateState = function(items, means, buffer, time, interval){
    setInterval(function(){
        items.forEach(item => {
            let dist = (parseInt(item.dataset.x) - parseInt(means[0].dataset.x)) ** 2;
            item.style.background = means[0].dataset.color;
            means.forEach(mean => {
                if ((item.dataset.x - mean.dataset.x) ** 2 < dist) {
                    item.style.background = mean.dataset.color;
                    dist = (item.dataset.x - mean.dataset.x) ** 2;
                }
            });
            clusters[item.style.background].quant += 1;
            clusters[item.style.background].sum += parseInt(item.dataset.x);
        })
        means.forEach(mean => buffer.push(parseInt(mean.dataset.x)));
        means.forEach(mean => {
            mean.dataset.x = clusters[mean.dataset.color].sum / clusters[mean.dataset.color].quant;
            mean.style.left = `${mean.dataset.x}px`;
        });
        
        let end = true;
        means.forEach((mean, index) => {
            if(mean.dataset.x - buffer[index] > MARGIN){
                end = false
            }
        })
        
        if(!end) updateState(balls, meanElements, oldMeans, time+0.2, 500);
    }, time * interval)
}

updateState(balls, meanElements, oldMeans, 1, 500)