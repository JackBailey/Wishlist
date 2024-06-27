export const priorityMap = {
    none: {
        text: "None",
        icon: false
    },
    low: {
        text: "Unsure",
        icon: "sentiment_content"
    },
    medium: {
        text: "Would be nice",
        icon: "sentiment_very_satisfied"
    },
    high: {
        text: "Would love it",
        icon: "favourite"
    }
};

export const convertPriority = (priority) => {
    return priorityMap[priority];
};
