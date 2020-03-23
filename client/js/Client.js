export default class Client {
  constructor(data) {
    for (let key in data) {
      this[key] = data[key];
    }
  }

  serverUpdate(data) {
    for (let key in data) {
      this[key] = data[key];
    }
  }
}
