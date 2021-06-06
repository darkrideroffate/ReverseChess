export default class Piece {
  constructor(x, y, name) {
    this.x = x;
    this.y = y;
    this.img = loadImage("pieces/" + name + ".svg");
    this.name = name;
  }
  drawPiece() {
    image(this.img, this.x * 80 + 15, this.y * 80 + 15);
  }
}
