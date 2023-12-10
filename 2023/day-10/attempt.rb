# frozen_string_literal: true

DIR = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1]
]

#   # '|', '-', 'L', 'J', '7', 'F'
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

file_path = ARGV[0]
raw_input = File.read(file_path).split("\n").map(&:chars)

starting_position = raw_input.each_with_index.reduce({ x: 0, y: 0 }) do |acc, (line, y)|
  x = line.index('S')
  x ? { x:, y: } : acc
end

def allowed?(next_dir, pipe)
  PIPES.find { |p| p[:pipe] == pipe }[:opens].map { |x, y| [-x, -y] }.include?(next_dir)
end

def next_directions(pipe)
  dirs = PIPES.find { |p| p[:pipe] == pipe }[:opens]
end

def solve(maze, _start_pos, _end_pos)
  seen = Array.new(maze.length) { Array.new(maze.first.length) { false } }
  paths = []
  start_positions = DIR.map do |x, y|
    new_coords = { x: _start_pos[:x] + x, y: _start_pos[:y] + y }
    value = maze[new_coords[:y]][new_coords[:x]]
    if value != '.'
      allowed?([x, y], value) ? new_coords : nil
    end
  end.compact

  forbiddens = start_positions.map { |pos| { from: pos, to: _start_pos } }

  start_positions.each_with_index do |pos, i|
    next unless i == 0

    path = []
    walk(maze, pos, _end_pos, seen, path, forbiddens[i])
    paths.push(path)
  end
  paths
end

def walk(maze, curr, end_pos, seen, path, forbidden)
  p curr
  p maze[curr[:y]][curr[:x]]
  p ' '
  # out of bounds condition
  return false if curr[:x] < 0 || curr[:x] >= maze.first.length || curr[:y] < 0 || curr[:y] >= maze.length
  # wall condition
  return false if maze[curr[:y]][curr[:x]] == '.'

  return false if seen[curr[:y]][curr[:x]]

  seen[curr[:y]][curr[:x]] = true
  path.push(curr)

  # for i in 0..(DIR.length - 1)
  #   x, y = DIR[i]
  #   next unless allowed?([x, y], maze[curr[:y]][curr[:x]])

  #   new_pos = { x: curr[:x] + x, y: curr[:y] + y }
  #   next if curr == forbidden[:from] && new_pos == forbidden[:to]

  #   if maze[new_pos[:y]][new_pos[:x]] == 'S'
  #     path.push(new_pos)
  #     return true
  #   end

  #   return true if walk(maze, new_pos, end_pos, seen, path, forbidden)
  # end

  for dir in next_directions(maze[curr[:y]][curr[:x]])
    p dir
    x, y = dir
    new_pos = { x: curr[:x] + x, y: curr[:y] + y }

    next if curr == forbidden[:from] && new_pos == forbidden[:to]

    if maze[new_pos[:y]][new_pos[:x]] == 'S'
      path.push(new_pos)
      return true
    end

    p "next_pos: #{maze[new_pos[:y]][new_pos[:x]]}"
    p allowed?([curr[:x], curr[:y]], maze[new_pos[:y]][new_pos[:x]])
    next unless allowed?([-x, -y], maze[new_pos[:y]][new_pos[:x]])

    return true if walk(maze, new_pos, end_pos, seen, path, forbidden)
    end

  path.pop
  false
end

paths = solve(raw_input, starting_position, starting_position)
longest_path = paths.max_by(&:length)
p "Part 1: #{longest_path.length / 2}"
