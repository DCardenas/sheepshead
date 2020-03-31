import Hitbox from './Hitbox.js';
import setupSeats from './setup/seats.js';
import createUI from './setup/ui.js';

const seatPos = [
  {x: 0.5, y: 0.77},
  {x: 0.17, y: 0.46},
  {x: 0.30, y: 0.13},
  {x: 0.69, y: 0.13},
  {x: 0.83, y: 0.46},
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
    return this.ui.activeState;
  }

  getActivePlayer() {
    if (this.activePlayer) {
      return this.seats[this.activePlayer].player
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
    this.redraw = true;
  }

  serverUpdate(data, clients) {
    let update = false;

    for (let key in data) {
      if (key === 'ai') {
        continue
      }
      if (data[key] !== this[key]) {
        if (key === 'activePlayer') {
          const curPlayer = this.getActivePlayer();
          if (curPlayer) {
            curPlayer.active = false;
            curPlayer.redraw = true;
            this.seats[curPlayer.seat].redraw = true;
          }

          if (data[key] !== null) {
            const player = this.getPlayerBySeat(data[key]);

            if (player) {
              player.active = true;
              player.redraw = true;
              this.seats[player.seat].redraw = true;
            }
          }
        }

        this[key] = data[key];
        update = true;
      }
    }

    if (update) {
      this.update();
    }
  }
}
