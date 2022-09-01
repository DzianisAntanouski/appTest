import Page from "./Page"

class Main extends Page {
    async open() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        await super.open("#/main-Data-FrontEnd-subCategory-CSS")
    }

    _viewName = "webapp.typescript.view.Main"
}

export default new Main()