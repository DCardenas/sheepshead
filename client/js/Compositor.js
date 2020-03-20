export default class Compositor {
  constructor() {
    this.layers = [];
  }

  addLayer(layer) {
    this.layers.push(layer);
  }

  removeLayer() {
    this.layers.pop();
  }

  draw(ctx) {
    this.layers.forEach(layer => {
      layer(ctx);
    });
  }
}
