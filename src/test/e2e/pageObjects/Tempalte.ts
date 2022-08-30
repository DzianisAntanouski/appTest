import { ITemplate } from "webapp/typescript/interface/Interface";

export default function Template(oViewName: string) {
    
    const view = oViewName
    function createTemplate (sId: string): ITemplate {
        return {
            selector: {
                id: sId,
                viewName: view,
            },
        };
    }
    return createTemplate
        
}