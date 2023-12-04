file_path = ARGV[0]
raw_input = File.read(file_path)

class Card
  def initialize(number, winning, available, copies)
    @number = number
    @winning = winning
    @available = available
  end

  def number
    @number
  end

  def matches
    (@winning & @available).count
  end

  def won
    (@number+1..@number+matches).to_a
  end
end

def get_numbers(string)
  string.scan(/\d+/).map(&:to_i)
end

def power(a,b)
  return 0 if b.negative?
  a ** b
end

cards = raw_input.split("\n").map do |line|
  card_number, winning, available = line.split(/[:,|]/)
  Card.new(get_numbers(card_number).first, get_numbers(winning), get_numbers(available), 1)
end
points = cards.reduce(0) do |acc, card|
  point = power(2, card.matches - 1)
  acc + point
end
puts "Part 1: #{points}"

# incredibly slow implementation
points_part_two = 0
q = [].concat(cards)
while !q.empty?
  card = q.shift
  points_part_two += 1
  won_cards = card.won.map do |number|
    cards.find { |c| c.number == number }
  end
  q.concat(won_cards)
end
puts "Part 2: #{points_part_two}"
