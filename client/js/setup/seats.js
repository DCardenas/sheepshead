import Seat from '../Seat.js';

export default function setupSeats(width, height, seatPos, numPlayers) {
  const seats = {
    0: null,
    1: null,
    2: null,
    3: null,
    4: null
  }

  for (let i = 0; i < numPlayers; i++) {
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
