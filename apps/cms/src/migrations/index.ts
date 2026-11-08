import * as migration_20261108_031000_initial from './20261108_031000_initial';

export const migrations = [
  {
    up: migration_20261108_031000_initial.up,
    down: migration_20261108_031000_initial.down,
    name: '20261108_031000_initial'
  },
];
