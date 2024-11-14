import POST from "./main.js";

POST({
    req: {
        bodyJson: {
            url: "https://www.amazon.co.uk/dp/B097HRFMT1?ref=cm_sw_r_apan_dp_VFYF52AAE9Y26ZSMPA3V&ref_=cm_sw_r_apan_dp_VFYF52AAE9Y26ZSMPA3V&social_share=cm_sw_r_apan_dp_VFYF52AAE9Y26ZSMPA3V&starsLeft=1&skipTwisterOG=1"
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
