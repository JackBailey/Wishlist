import POST from "./main.js";

let url = "https://amzn.eu/d/cqSpUuo";

process.argv.forEach(function (val, index) {
    if (index === 2) {
        url = val;
    }
});

POST({
    req: {
        bodyJson: {
            url
        }
    },
    log: console.log,
    error: console.error,
    res: {
        json: (data) => {
            console.log(data);
        }
    }
});
