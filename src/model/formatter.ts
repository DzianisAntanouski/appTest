import DetailDetail from '../controller/DetailDetail.controller';
export default {
  formatCreatedBy(value: object): string {
    return value ? `Test author: ${Object.values(value)[0] as string}` : "Don't has author";
  },

  formatDate(value: string): string {
    const sDay = new Date(value).getDate();
    const sMonth = new Date(value).getMonth() + 1;
    const sYear = new Date(value).getFullYear();
    return `${sDay > 9 ? sDay : "0" + sDay.toString()}/${sMonth > 9 ? sMonth : "0" + sMonth.toString()}/${sYear}`;
  },

  formatTitlePosts(value: object): string {
    const aPath: string[] | null = this?.getView()?.getBindingContext()?.getPath()?.split('/') || null
    return aPath ? `Add comments to ${aPath[2]}, ${aPath[3]}` : `Some problems with path`
  }
};
