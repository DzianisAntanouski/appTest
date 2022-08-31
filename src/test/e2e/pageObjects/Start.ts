import Page from "./Page"

class Start extends Page {
    async open() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        await super.open("#/")
    }

    _viewName = "webapp.typescript.view.Start"
}

export default new Start()