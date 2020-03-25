import Hitbox from './Hitbox.js';
import setupSeats from './setup/seats.js';
import createUI from './ui/ui.js';

const seatPos = [
  {x: 0.5, y: 0.85},
  {x: 0.17, y: 0.50},
  {x: 0.30, y: 0.15},
  {x: 0.69, y: 0.15},
  {x: 0.83, y: 0.50},
]
export default class Game {
  constructor(width, height, socket) {
    this.x = 0;
    this.y = 0;
    this.w = width;
    this.h = height;
    this.numPlayers = 5;

    this.seats = setupSeats(width, height, seatPos, this.numPlayers);
    this.ui = createUI(socket, this);
    this.state = 'pregame';


    this.dealer = null;
    this.activePlayer = null;

    this.hitbox = new Hitbox(0, 0, 1, 1, this);
    this.redraw = true;
  }

  get bounds() {
    return {
      left: 0,
      right: this.w,
      top: 0,
      bot: this.h,
    }
  }

  setState(state) {
    this.state = state;
    this.redraw = true;
  }

  getUI() {
    return this.ui.states[this.state];
  }

  getActivePlayer() {
    if (this.activePlayer) {
      return this.seats[this.activePlayer]
    }

    return null
  }

  getPlayerBySeat(seat) {
    return this.seats[seat].player;
  }

  addPlayer(seat, player) {
    this.seats[seat].addPlayer(player);

    if (player.isHost) {
      this.updateSeatPos(seat);
    }
  }

  updateSeatPos(startNum) {
    for (let i = 0; i < this.numPlayers; i++) {
      const pos = seatPos[i];
      const seat = this.seats[startNum];
      seat.x = pos.x * this.w;
      seat.y = pos.y * this.h;

      startNum += 1;
      startNum %= this.numPlayers;
    }
  }

  removePlayer(seat) {
    this.seats[seat].removePlayer();
  }

  update() {
    this.ui.update(this);
  }

  serverUpdate(data, clients) {
    let update = false;

    for (let key in data) {
      if (key === 'ai') {
        continue
      }
      if (data[key] !== null && data[key] !== this[key]) {
        this[key] = data[key];

        if (key === 'activePlayer') {
          if (this.getActivePlayer()) {
            this.getActivePlayer().active = false;
          }

          const player = this.getPlayerBySeat(data[key]);

          if (player) {
            player.active = true;
          }
        }

        update = true;
      }
    }

    if (update) {
      this.update();
    }
  }
}
