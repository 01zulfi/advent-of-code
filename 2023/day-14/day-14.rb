file_path = ARGV[0]
raw_input = File.read(file_path).split("\n")

Mirror = Data.define(:char, :x, :y) do
  def empty? = char == '.'
  def round? = char == 'O'
  def cube? = char == '#'
end

dish = raw_input.each_with_index.map do |line, y|
  line.chars.each_with_index.map do |char, x|
    Mirror.new(char, x, y)
  end
end

def roll_to_north(dish, mirror)
  return if mirror.y.zero?

  top = dish[mirror.y - 1][mirror.x]

  return unless top.empty?

  dish[mirror.y][mirror.x] = Mirror.new('.', mirror.x, mirror.y)
  dish[mirror.y - 1][mirror.x] = Mirror.new(mirror.char, mirror.x, mirror.y - 1)
  roll_to_north(dish, dish[mirror.y - 1][mirror.x])
end

def roll_to_south(dish, mirror)
  return if mirror.y == dish.length - 1

  bottom = dish[mirror.y + 1][mirror.x]

  return unless bottom.empty?

  dish[mirror.y][mirror.x] = Mirror.new('.', mirror.x, mirror.y)
  dish[mirror.y + 1][mirror.x] = Mirror.new(mirror.char, mirror.x, mirror.y + 1)
  roll_to_south(dish, dish[mirror.y + 1][mirror.x])
end

def roll_to_west(dish, mirror)
  return if mirror.x.zero?

  left = dish[mirror.y][mirror.x - 1]

  return unless left.empty?

  dish[mirror.y][mirror.x] = Mirror.new('.', mirror.x, mirror.y)
  dish[mirror.y][mirror.x - 1] = Mirror.new(mirror.char, mirror.x - 1, mirror.y)
  roll_to_west(dish, dish[mirror.y][mirror.x - 1])
end

def roll_to_east(dish, mirror)
  return if mirror.x == dish.first.length - 1

  right = dish[mirror.y][mirror.x + 1]

  return unless right.empty?

  dish[mirror.y][mirror.x] = Mirror.new('.', mirror.x, mirror.y)
  dish[mirror.y][mirror.x + 1] = Mirror.new(mirror.char, mirror.x + 1, mirror.y)
  roll_to_east(dish, dish[mirror.y][mirror.x + 1])
end

def tilt_north(dish)
  dish.each_with_index.map do |line|
    line.each_with_index.map do |mirror|
      roll_to_north(dish, mirror) if mirror.round?
    end
  end
  dish
end

def tilt_south(dish)
  dish.reverse.each_with_index.map do |line|
    line.each_with_index.map do |mirror|
      roll_to_south(dish, mirror) if mirror.round?
    end
  end
  dish
end

def tilt_west(dish)
  dish.each_with_index.map do |line|
    line.each_with_index.map do |mirror|
      roll_to_west(dish, mirror) if mirror.round?
    end
  end
  dish
end

def tilt_east(dish)
  dish.each_with_index.map do |line|
    line.reverse.each_with_index.map do |mirror|
      roll_to_east(dish, mirror) if mirror.round?
    end
  end
  dish
end

def indices(array, value)
  array.each_index.select { |i| array[i] == value }
end

tilted_north = tilt_north(dish.map(&:dup))

total_load = tilted_north.each_with_index.reduce(0) do |acc, (line, y)|
  round_count = line.count(&:round?)
  acc + (round_count * (line.length - y))
end

p "Part 1: #{total_load}"

dish_maps = {}
spun = dish.map(&:dup)

# spin arbitrary times, I started at 50 and worked my way up to 150
150.times do |i|
  dish_maps[i] = spun.map(&:dup)
  tilt_east(tilt_south(tilt_west(tilt_north(spun))))
end

cycles = {}

dish_maps.values.each_with_index do |dish, i|
  cycles[i] = indices(dish_maps.values, dish)
end

cycle_of_interest = cycles.values.find { |cycle| cycle.length > 1 }
cycle_start = cycle_of_interest.first
cycle_interval = cycle_of_interest[1] - cycle_of_interest.first
dish_of_interest = dish_maps[cycle_start + ((1_000_000_000 - cycle_start) % cycle_interval)]

total_load = dish_of_interest.each_with_index.reduce(0) do |acc, (line, y)|
  round_count = line.count(&:round?)
  acc + (round_count * (line.length - y))
end

p "Part 2: #{total_load}"
