import { XMLParser } from 'fast-xml-parser';

const proxyURL = "https://corsproxy.io/?"
const req = {"cache":"no-store"}


const convertXMLToJSON = (xml) => {
    const parser = new XMLParser({
        ignoreAttributes: false,
    });
    const json = parser.parse(xml);
    return json;
};


export const fetchXML = async (url) => {
    
    
    try {
        const res = await fetch(`${proxyURL}${encodeURIComponent(url)}?_=${new Date().getTime()}`,req)
        const XMLdata = await res.text()
        const JSONdata = convertXMLToJSON(XMLdata)
        return JSONdata

    } catch (error) {
        throw error
    }

}