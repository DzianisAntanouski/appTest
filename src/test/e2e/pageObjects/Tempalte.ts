import { wdi5Selector } from "wdio-ui5-service/dist/types/wdi5.types";

export default function Template(oViewName: string) {
  const view = oViewName;
  function createTemplate(sId: string): wdi5Selector {
    return {
      selector: {
        id: sId,
        viewName: view,
      },
    };
  }
  return createTemplate;
}
