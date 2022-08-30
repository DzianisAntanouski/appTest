import { wdi5 } from "wdio-ui5-service"

export default class Page {
    async open(path: string) {
        await wdi5.goTo(path)
    }
}