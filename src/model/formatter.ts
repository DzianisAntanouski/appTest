export default {
  /**
   * Rounds the currency value to 2 digits
   *
   * @public
   * @param {string} value value to be formatted
   * @returns {string} formatted currency value with 2 digits
   */
  formatValue: (value: string) => {
    if (!value) {
      return "";
    }
    try {
      return parseFloat(value).toFixed(2);
    } catch (error) {
      return value;
    }
  },

  formatAnswers(value: string) {
    return value
  },

  formatCreatedBy(value: object): string {
    return value ? `Test author: ${Object.values(value)[0] as string}` : "Don't has author"
  }
};
