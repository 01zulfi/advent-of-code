# frozen_string_literal: true

DIR = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1]
]

PIPES = [
  {
    pipe: '|',
    opens: [
      [0, 1],
      [0, -1]
    ]
  },
  {
    pipe: '-',
    opens: [
      [1, 0],
      [-1, 0]
    ]
  },
  {
    pipe: 'L',
    opens: [
      [1, 0],
      [0, -1]
    ]
  },
  {
    pipe: 'J',
    opens: [
      [-1, 0],
      [0, -1]
    ]
  }, {
    pipe: '7',
    opens: [
      [-1, 0],
      [0, 1]
    ]
  }, {
    pipe: 'F',
    opens: [
      [1, 0],
      [0, 1]
    ]
  }
]

def from_pipe(into_dir, pipe)
  dirs = PIPES.find { |p| p[:pipe] == pipe }[:opens]
  dirs.find { |dir| dir != into_dir }
end

file_path = ARGV[0]
maze = File.read(file_path).split("\n").map(&:chars)

# left tile from 'S' i.e. 'F'
curr_pos = { x: 83, y: 16 }
curr_from = [0, -1]
steps = 0
coords = []
while true
  coords << curr_pos
  steps += 1
  value = maze[curr_pos[:y]][curr_pos[:x]]
  next if value == '.'
  break if value == 'S'

  next_direction = from_pipe(curr_from, value)
  curr_pos = { x: curr_pos[:x] + next_direction[0], y: curr_pos[:y] + next_direction[1] }
  curr_from = [-next_direction[0], -next_direction[1]]
end

p "Part 1: #{steps / 2}"
