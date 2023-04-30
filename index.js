const http = require('http');
const url = require('url');
const fs = require('fs');


const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%IMAGE%}/g, product.image);

    if (!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    };

    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProducts = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');


const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    console.log(req.url);

    const pathName = req.url;
    //Overview page
    if (pathName === '/' || pathName === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardsHtml = dataObj.map(x => replaceTemplate(tempCard, x)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(output)

        //product page
    } else if (pathName === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' })

        res.end(tempProducts);

        //api page
    } else if (pathName === '/api') {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(data);

        //not found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>')
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to request on port 8000');
})