import Seat from '../Seat.js';

export default function setupSeats(width, height, socket) {
  const seats = {
    0: null,
    1: null,
    2: null,
    3: null,
    4: null
  }
  const seatPos = [
    {x: 0.5, y: 0.85},
    {x: 0.17, y: 0.50},
    {x: 0.30, y: 0.15},
    {x: 0.69, y: 0.15},
    {x: 0.83, y: 0.50},
  ]
  const NUM_PLAYERS = 5;
  for (let i = 0; i < NUM_PLAYERS; i++) {
    const seat = new Seat(i);
    const pos = seatPos[i];
    const x = pos.x * width;
    const y = pos.y * height;
    seat.x = x;
    seat.y = y;

    seats[i] = seat;
  }

  return seats
}
