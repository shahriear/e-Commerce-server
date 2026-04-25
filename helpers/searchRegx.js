function SearchRegx(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
// function SearchQuery(search) {
//   if (!search || !search.trim()) return {};

//   const words = search.trim().split(/\s+/);
//   const regexConditions = words.map(word => ({
//     title: { $regex: new RegExp(SearchRegx(word), 'i') },
//   }));
//   return { $and: regexConditions };
// }

module.exports = SearchRegx;