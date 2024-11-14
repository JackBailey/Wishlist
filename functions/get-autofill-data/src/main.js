import { getLinkPreview } from "./link-preview-js.js";
import getSite from "./get-site.js";
import { TidyURL } from "tidy-url";

const formatTitle = (data, site) => {
    let { title, description } = data;

    if (!title) title = description;

    if (title) {
        if (site === "amazon") {
            title = title
                .replace(/^Amazon\.[^:]+:\s*/, "")
                .replace("Free delivery and returns on all eligible orders. Shop ", "")
                .replace(/\s*:\s*.*$/, "");
        }
    }

    return title ? title.slice(0, 64).trim() : "";
};

const getPreview = async (url) => {
    return new Promise((resolve, reject) => {
        getLinkPreview(url, {
            followRedirects: "follow",
            headers: {
                "user-agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
            }
        })
            .then((urlData) => {
                resolve(urlData);
            })
            .catch((error) => {
                console.error("Error:", error);
                reject(error);
            });
    });
};

const getBestImage = (url, images) => {
    const site = getSite(url);

    switch (site) {
    case "amazon":
        return images.sort((a, b) => {
            // Extract size information from the current image URL
            const aMatch = /_(SX|SY|UF|SR)(\d+),?(\d+)?_/.test(a);
            const bMatch = /_(SX|SY|UF|SR)(\d+),?(\d+)?_/.test(b);
            
            if (aMatch === bMatch) {
                return 0;
            }
        
            // If a has a match and b doesn't, a should come before b
            if (aMatch) {
                return -1;
            }
        
            // If b has a match and a doesn't, b should come before a
            return 1;
        })[0];
    default:
        return images[0];
    }
};

export default async ({ req, res, log, error }) => {
    const { url } = req.bodyJson;

    try {
        const data = await getPreview(url);
        const site = getSite(url);

        if (
            site === "amazon" &&
            data.images.find((img) => img.includes("/captcha/"))
        ) {
            return res.json({
                error: "Amazon is blocking access to the image. Please try again later."
            });
        }

        const autofillData = {
            title: formatTitle(data, site),
            url: TidyURL.clean(data.url).url,
            image: getBestImage(data.url, data.images),
            price: data.price
        };

        return res.json(autofillData);
    } catch (err) {
        error("Could not get link preview: " + err.message);

        return res.json({
            error: err.message
        });
    }
};
