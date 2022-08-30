export default { 

  formatCreatedBy(value: object): string {
    return value ? `Test author: ${Object.values(value)[0] as string}` : "Don't has author"
  }
};
