export const convertPriority = (priority) => {
    const priorityMap = {
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

    return priorityMap[priority];
};
