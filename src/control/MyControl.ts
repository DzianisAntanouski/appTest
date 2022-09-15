import Button from "sap/m/Button";
import GenericTile from "sap/m/GenericTile";
import RenderManager from "sap/ui/core/RenderManager";
import Control from 'sap/ui/core/Control';
import CustomData from "sap/ui/core/CustomData";
import Text from "sap/m/Text";


/**
 * @namespace webapp.typescript.control
 */
export default class MyControl extends Control {



	// The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
	// constructor(idOrSettings?: string | $MyControlSettings);
	// constructor(id?: string, settings?: $MyControlSettings);
	// constructor(id?: string, settings?: $MyControlSettings) { super(id, settings); }

	static readonly metadata = {
		properties: {
			"header": "string",
			"subheader": "string",
			"highLight": { type: "boolean" },
		},
		// aggregations: {
		// 	// "customData": { type: "sap.ui.core.CustomData" },
		// 	"customData": "sap.ui.core.CustomData",
		// 	// "buttonManage": { type: "sap.m.Button", multiple: false, visibility: "hidden" }
		// },
		events: {
			"onRunButtonPress": {
			},
			"onManageButtonPress": {},
			"onClickCard": {}
		},


	};

	setHeader(header: string) {
		this.setProperty('header', header, true)
	}
	setSubheader(subheader: string) {
		this.setProperty('subheader', subheader, true)
	}
	setHighLight(highLight: boolean) {

		this.setProperty('highLight', highLight, true)
	}
	onPressRun(): void {
		console.log('aaaa')
		this.fireEvent('onRunButtonPress')
	}
	onPressManage(): void {
		this.fireEvent('onManageButtonPress')

	}
	static renderer = {
		apiVersion: 2,
		render: (rm: RenderManager, control: MyControl) => {
			rm.openStart("div", control).class('scene').openEnd();
			rm.openStart("div", control).class('card')
			if (control.getHighLight() as boolean) {
				rm.class('highLight')
			}
			rm.openEnd();
			rm.openStart("div", control).class('card__face').class('card__face--front').openEnd()
			rm.renderControl(new Text({
				text: control.getHeader(),
				renderWhitespace: true
			}).addStyleClass('header'));
			rm.renderControl(new Text({
				text: control.getSubheader(),
				renderWhitespace: true
			}).addStyleClass('subheader'))
			rm.close("div");
			rm.openStart("div", control).class('card__face').class('card__face--back').openEnd()
			rm.renderControl(new Text({
				text: control.getHeader(),
				renderWhitespace: true
			}).addStyleClass('header'));
			rm.renderControl(new Text({
				text: control.getSubheader(),
				renderWhitespace: true
			}).addStyleClass('subheader'))
			rm.renderControl(new Button({
				text: "Run",
				press: () => control.onPressRun()
			}));
			rm.renderControl(new Button({
				text: "Manage",
				press: () => control.onPressManage()
			}));
			rm.close("div");
			rm.close("div");
			rm.close("div");
		}
	};

	onclick = (event: Event): void => {

		const element = event.target as HTMLDivElement
		const parent = element.closest('.card') as HTMLDivElement
		const cards = document.querySelectorAll('.card')

		cards.forEach((card) => { card.classList.remove('is-flipped'); card.classList.remove('highLight') })
		parent.classList.toggle('is-flipped')
		parent.classList.toggle('highLight')
		if (element.classList.contains('card__face--front') || element.closest('card__face--front')) {
			this.fireEvent('onClickCard')
		}
		// debugger;

	}

}