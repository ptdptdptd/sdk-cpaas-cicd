const functions = {
    isString: (str) => {
        return (typeof str === "string" || str instanceof String)
    },
    stringToArray: (str) => {
        if (!functions.isString(str)) {
            console.log("str must be String")
            return
        }
        return str.split(",").map(e => e.trim())
    },
    findIntent: ({ searchObj = null, searchStr = null }) => {
        if (searchObj === null || searchStr === null) {
            console.log("Missing parameter")
            return
        }

        if (!functions.isString(searchStr)) {
            console.log("searchStr must be String")
            return
        }

        if (functions.isString(searchObj)) {
            searchObj = JSON.parse(searchObj)
        }

        for (const [key, value] of Object.entries(searchObj)) {
            keywords = functions.stringToArray(value)
            if (keywords.some(e => searchStr.includes(e)))
                return key
        }
    },
}

module.exports = functions