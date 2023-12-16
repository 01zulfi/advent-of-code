file_path = ARGV[0]
grid = File.read(file_path).split("\n").map(&:chars)

def get_next_directions(from, space)
  case space
  when '.'
    [{ x: from[:x] * -1, y: from[:y] * -1 }]
  when '|'
    return [{ x: 0, y: from[:y] * -1 }] if from[:x].zero?

    [{ x: 0, y: 1 }, { x: 0, y: -1 }]

  when '-'
    return [{ x: from[:x] * -1, y: 0 }] if from[:y].zero?

    [{ x: 1, y: 0 }, { x: -1, y: 0 }]

  when '\\'
    if from[:x].zero?
      return [{ x: -1, y: 0 }] if from[:y].positive?

      return [{ x: 1, y: 0 }]

    end
    if from[:y].zero?
      return [{ x: 0, y: -1 }] if from[:x].positive?

      [{ x: 0, y: 1 }]

    end
  when '/'
    if from[:x].zero?
      return [{ x: 1, y: 0 }] if from[:y].positive?

      return [{ x: -1, y: 0 }]

    end
    if from[:y].zero?
      return [{ x: 0, y: 1 }] if from[:x].positive?

      [{ x: 0, y: -1 }]

    end
  end
end

# MAP = {}

def get_path(grid, start)
  # p start
  q = [start]
  seen = []
  path = []
  until q.empty?
    curr = q.shift
    curr_pos = curr[:loc]
    curr_from = curr[:from]

    # identifier = "#{curr_pos[:x]}#{curr_pos[:y]}#{curr_from[:x]}#{curr_from[:y]}"
    # if !MAP[identifier].nil?
    #   return (path.map { |p| p[:loc] }).concat(MAP[identifier])
    # end

    path << curr
    value = grid[curr_pos[:y]][curr_pos[:x]]

    next if seen.include? curr
    next if value.nil?

    seen.push curr
    next_directions = get_next_directions(curr_from, value)

    new_positions = next_directions.map do |dir|
      loc = { x: curr_pos[:x] + dir[:x], y: curr_pos[:y] + dir[:y] }
      if loc[:x] < 0 || loc[:x] >= grid.first.length || loc[:y] < 0 || loc[:y] >= grid.length
        nil
      else
        { loc: { x: curr_pos[:x] + dir[:x], y: curr_pos[:y] + dir[:y] }, from: { x: dir[:x] * -1, y: dir[:y] * -1 } }
      end
    end.compact

    q.concat new_positions
  end
  # path.each do |p|
  #   loc = p[:loc]
  #   from = p[:from]
  #   identifier = "#{loc[:x]}#{loc[:y]}#{from[:x]}#{from[:y]}"
  #   MAP[identifier] = path.map { |p| p[:loc] }
  #   puts MAP.keys
  # end

  path.map { |p| p[:loc] }
end

enter_from_top_left = { loc: { x: 0, y: 0 }, from: { x: -1, y: 0 } }

p "Part 1:"
p get_path(grid, enter_from_top_left).uniq.length

edges = []

(0..(grid.length-1)).each do |y|
  edges << { loc: { x: 0, y: y }, from: { x: -1, y: 0 } }
  edges << { loc: { x: grid.first.length - 1, y: y }, from: { x: 1, y: 0 } }
end
(0..grid.first.length-1).each do |x|
  edges << { loc: { x: x, y: 0 }, from: { x: 0, y: -1 } }
  edges << { loc: { x: x, y: grid.length - 1 }, from: { x: 0, y: 1 } }
end

lengths_of_paths = []

edges.each do |edge|
  lengths_of_paths << get_path(grid, edge).uniq.length
end

p "Part 2:"
p lengths_of_paths.max
