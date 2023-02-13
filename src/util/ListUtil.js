import Fuse from 'fuse.js'

export default class SearchUtil {

    static fuzzySearchByMaxScore(keywordList, searchableList, identifierAttribute, fuzzyOptions) {

        let resultMap = {}
        const fuse = new Fuse(searchableList, fuzzyOptions)

        keywordList.forEach(keyword => {
            const result = fuse.search(keyword)
            if(result!=null && result.length>0)
                resultMap[result[0].item[identifierAttribute]] = result[0].item
        })

        return Object.values(resultMap)
    }
}