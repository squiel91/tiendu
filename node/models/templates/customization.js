/* 
  Notes:
  - The customization object might be empty. In that case we return an empty state customization json.
  - HomeCategories are omited since there is a specific endpoint for retrieving those. 
*/

module.exports = (customization) => {
  return {
    globalTopMessage: customization?.globalTopMessage,
    menu: customization?.menu?.map((item) => {
      return {
        text: item.text,
        link: item.link
      }
    }) || [],
    homeCategories: customization?.homeCategories || []
  }
}