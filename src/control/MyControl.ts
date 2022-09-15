import GenericTile from "sap/m/GenericTile";
import RenderManager from "sap/ui/core/RenderManager";

/**
 * @namespace ui5.typescript.helloworld.control
 */
export default class MyControl extends GenericTile {

	// The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
	// constructor(idOrSettings?: string | $MyControlSettings);
	// constructor(id?: string, settings?: $MyControlSettings);
	// constructor(id?: string, settings?: $MyControlSettings) { super(id, settings); }

	static readonly metadata = {
		properties: {
			"header": "string",
			"subHeader": "string"
		}
		
	};

	static renderer = {
		apiVersion: 2,
		render: function (rm: RenderManager, control: MyControl): void {
			rm.openStart("div", control).class('wrapper').openEnd();
			rm.openStart("div", control).class('card').openEnd();
			rm.openStart("div", control).class('front').openEnd().text(control.getHeader()).close("div");
			rm.openStart("div", control).class('back').openEnd().text(control.getSubheader()).close("div");
			rm.close("div");
			rm.close("div");
		}
	};

	onclick = function (): void {
		alert("Hello World!");
	}
}