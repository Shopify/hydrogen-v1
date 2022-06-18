/* A mock 3P SDK */
export default randomUser = {
  get: async () => {
    const response = await fetch('https://randomuser.me/api/');
    const {results} = await response.json();
    return results[0];
  },
};
