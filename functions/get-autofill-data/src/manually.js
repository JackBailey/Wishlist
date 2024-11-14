import POST from "./main.js";

POST({
    req: {
        bodyJson: {
            url: "https://amzn.eu/d/cqSpUuo"
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
