# frozen_string_literal: true

file_path = ARGV[0]

input = File.read(file_path).split("\n").map { |e| e.split(',') }

def get_elves_range(pair)
  first_elf, second_elf = pair.map { |elf| elf.split('-').map(&:to_i) }

  [(first_elf.first..first_elf.last).to_a, (second_elf.first..second_elf.last).to_a]
end

contained = input.reduce(0) do |acc, pair|
  first_elf_range, second_elf_range = get_elves_range(pair)

  is_pair_contained = [first_elf_range, second_elf_range].include?(first_elf_range.intersection(second_elf_range))

  is_pair_contained ? acc + 1 : acc
end

overlap = input.reduce(0) do |acc, pair|
  first_elf_range, second_elf_range = get_elves_range(pair)

  does_pair_overlap = !first_elf_range.intersection(second_elf_range).empty?

  does_pair_overlap ? acc + 1 : acc
end

p "Part one: #{contained}"
p "Part two: #{overlap}"
