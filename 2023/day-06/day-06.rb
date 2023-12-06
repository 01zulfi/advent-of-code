file_path = ARGV[0]
raw_input = File.read(file_path)

def get_numbers(string)
  string.scan(/\d+/).map(&:to_i)
end

times, distances = raw_input.split("\n").map { |line| get_numbers(line) }

ways_to_win = []
count = 0
times.each_with_index do |time, index|
  count = 0
  time.times do |button_time|
    race_time = time - button_time
    distance = race_time * button_time
    count += 1 if distance > distances[index]
  end
  ways_to_win << count
end

margin_of_error = ways_to_win.reduce(:*)
p "Part 1: #{margin_of_error}"

time2, distance2 = raw_input.split("\n").map { |line| get_numbers(line) }.map(&:join).map(&:to_i)

count = 0
time2.times do |button_time|
    race_time = time2 - button_time
    distance = race_time * button_time
    count += 1 if distance > distance2
end

p "Part 2: #{count}"