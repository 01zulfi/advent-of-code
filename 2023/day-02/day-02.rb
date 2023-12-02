file_path = ARGV[0]
raw_input = File.read(file_path)

def parse_line_to_game(raw_line)
   _, game = raw_line.split(':')
   game.strip
end

def max_color_for_game(game)
    start = {
        red: 0,
        green: 0,
        blue: 0,
    }
    sets = game.split(';')
    sets.each do |set|
      colors = set.split(',')
      colors.each do |color|
        color_value, color_name = color.strip.split(' ')
        start[color_name.to_sym] = [start[color_name.to_sym], color_value.to_i].max
      end
    end
    start
end

def part_one(raw_input)
    max = {
        red: 12,
        green: 13,
        blue: 14,
    }

    sum_of_game_ids = 0

    raw_input.split("\n").each_with_index do |line, i|
        game = parse_line_to_game(line)
        max_colors = max_color_for_game(game)
        if max_colors[:red] <= max[:red] && max_colors[:green] <= max[:green] && max_colors[:blue] <= max[:blue]
            sum_of_game_ids += i + 1
        end
    end

    sum_of_game_ids
end

def part_two(raw_input)
    sum_of_powers = 0

    raw_input.split("\n").each_with_index do |line, i|
        game = parse_line_to_game(line)
        max_colors = max_color_for_game(game)
        power_of_cubes = max_colors.reduce(1) do |acc, (k, v)|
          acc *= v
        end
        sum_of_powers += power_of_cubes
    end

    sum_of_powers
end


puts "Part 1: #{part_one(raw_input)}"
puts "Part 2: #{part_two(raw_input)}"
