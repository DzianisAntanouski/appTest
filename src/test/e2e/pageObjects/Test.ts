import Page from "./Page"

class Test extends Page {
    async open() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        await super.open("#/testing-Data-FrontEnd-subCategory-JavaScript")
    }

    _viewName = "webapp.typescript.view.Test"
}

export default new Test()