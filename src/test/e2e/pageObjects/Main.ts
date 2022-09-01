import Page from "./Page";

class Main extends Page {
  async open() {
    await super.open("#/main-Data-FrontEnd-subCategory-CSS");
  }
  _viewName = "webapp.typescript.view.Main";
}

export default new Main();
