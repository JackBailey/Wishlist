const mainUrlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

export default {
    urlRegex: new RegExp(
        mainUrlRegex
    ),
    urlRegexGlobal: new RegExp(
        mainUrlRegex,
        "g"
    )
};