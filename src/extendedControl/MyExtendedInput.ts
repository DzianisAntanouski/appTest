import Input from "sap/m/Input";
import RenderManager from "sap/ui/core/RenderManager";
import Renderer from "sap/m/InputRenderer"
/**
 * @namespace webapp.typescript.extendedControl
 */

export default class MyExtendedInput extends Input {
  static readonly metadata = {
    events: {
      "onFocus": {},
    },
  };
  onPressInput(): void {
    this.fireEvent("onFocus");
  }

  static renderer = Renderer

  // static renderer = {
  //   apiVersion: 2,
  //   render: (rm: RenderManager, control: MyExtendedInput) => { 
  //     rm.openStart("div", control).class("extendedInput")
  //     rm.openEnd();
  //     rm.renderControl(new Input({
  //       "fieldWidth": "100%"
  //     }));
  //     rm.close("div")
  //   },
  // };
  onclick  = (): void => {  
    this.fireEvent("onFocus");
  };
}
