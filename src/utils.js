import { mdiEmoticon, mdiEmoticonConfused, mdiHeart } from "@mdi/js";

export const priorityMap = {
    none: {
        text: "None",
        icon: false
    },
    low: {
        text: "Unsure",
        icon: mdiEmoticonConfused
    },
    medium: {
        text: "Would be nice",
        icon: mdiEmoticon
    },
    high: {
        text: "Would love it",
        icon: mdiHeart
    }
};

export const convertPriority = (priority) => {
    return priorityMap[priority];
};

export const currencyFormatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: import.meta.env.VITE_CURRENCY
});

export const currencySymbol = currencyFormatter.formatToParts(0)[0].value;
