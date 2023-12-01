# frozen_string_literal: true

letter_to_option = {
  'A' => 'rock',
  'B' => 'paper',
  'C' => 'scissors',
  'X' => 'rock',
  'Y' => 'paper',
  'Z' => 'scissors'
}

letter_to_result = {
  'X' => 0,
  'Y' => 3,
  'Z' => 6
}

option_score = {
  'rock' => 1,
  'paper' => 2,
  'scissors' => 3
}

round_score = {
  'rock' => { 'rock' => 3, 'paper' => 0, 'scissors' => 6 },
  'paper' => { 'rock' => 6, 'paper' => 3, 'scissors' => 0 },
  'scissors' => { 'rock' => 0, 'paper' => 6, 'scissors' => 3 }
}

input = File.read('./input.txt').each_line.reduce([]) do |acc, line|
  opponent, me = line.split
  acc.push({ 'opponent' => opponent, 'me' => me })
end

transformed = input.map do |round|
  round.transform_values do |value|
    letter_to_option[value]
  end
end

total_score = transformed.reduce(0) do |acc, round|
  acc + option_score[round['me']] + round_score[round['me']][round['opponent']]
end

transformed_part_two = input.map do |round|
  round.transform_values do |value|
    if %w[X Y Z].include?(value)
      letter_to_result[value]
    else
      letter_to_option[value]
    end
  end
end

total_score_part_two = transformed_part_two.reduce(0) do |acc, round|
  my_option = round_score.select { |_, hash| hash[round['opponent']] == round['me'] }.keys.first
  acc + round['me'] + option_score[my_option]
end

puts "total score is #{total_score}"
puts "total score is #{total_score_part_two}"
