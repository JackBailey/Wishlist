import { getLinkPreview } from "link-preview-js";


const getSite = (url) => {
    const sites = {
        amazon:
      /https?:\/\/(www\.|smile\.)?amazon\.[a-z]{2,3}(\.[a-z]{2,3})?(\/|$)/
    };

    const site = Object.keys(sites).find((site) => sites[site].test(url));
};

const getPreview = async (url) => {
    return new Promise((resolve, reject) => {
        getLinkPreview(url)
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
        return images.reduce((best, current) => {
        // Extract size information from the current image URL
            const currentMatch = current.match(/_(SX|SY|UF|SR)(\d+),?(\d+)?_/);
            const bestMatch = best.match(/_(SX|SY|UF|SR)(\d+),?(\d+)?_/);

            const currentSize = currentMatch
                ? Math.max(parseInt(currentMatch[2]), parseInt(currentMatch[3] || 0))
                : 0;
            const bestSize = bestMatch
                ? Math.max(parseInt(bestMatch[2]), parseInt(bestMatch[3] || 0))
                : 0;

            // Compare sizes and return the image with the largest size
            return currentSize > bestSize ? current : best;
        }, images[0]);
    default:
        return images[0];
    }
};

export default async ({ req, res, log, error }) => {
    log(req.bodyJson);

    const { url } = req.bodyJson;

    try {
        const data = await getPreview(url);

        const site = getSite(url);

        log(data);

        if (site === "amazon" && data.image.contains("/captcha/")) {
            return res.json({
                error: "Amazon is blocking access to the image. Please try again later."
            });
        }

        const autofillData = {
            title: (data.description || data.title).slice(0, 64).trim(),
            url: data.url,
            image: getBestImage(data.url, data.images)
        };

        log(autofillData);

        return res.json(
            autofillData
        );
    } catch (err) {
        error("Could not get link preview: " + err.message);

        return res.json({
            error: err.message
        });
    }
};
