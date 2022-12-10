# frozen_string_literal: true

file_path = ARGV[0]

command_to_cycles = {
  addx: 2,
  noop: 1
}

input = File.read(file_path).split("\n").map do |instruction|
  command, value = instruction.split

  { cycles: command_to_cycles[command.to_sym], register_value: value.to_i }
end

def cycle_for_signal_strength?(value)
  return true if value == 20

  if value >= 60
    ((value - 20) % 40).zero?
  else
    false
  end
end

reducer = input.reduce({ cycle: 0, register_value: 1, strength: 0 }) do |acc, instruction|
  current_cycle = acc[:cycle]
  current_register_value = acc[:register_value]
  current_strength = acc[:strength]

  instruction[:cycles].times do |_|
    current_cycle += 1
    current_strength += current_cycle * current_register_value if cycle_for_signal_strength?(current_cycle)
  end

  current_register_value += instruction[:register_value]

  { cycle: current_cycle, register_value: current_register_value, strength: current_strength }
end

p "Part One: #{reducer[:strength]}"

CRT = Array.new(6) { Array.new(40, '.') }

def current_row(current_cycle)
  current_cycle / 40
end

def sprite_overlap?(cycle, sprite_positions)
  sprite_positions.cover?(cycle)
end

pixels = {
  lit: '#',
  dark: '.'
}

lit_CRT = input.reduce({ register_value: 1, cycle: 0, CRT: CRT }) do |acc, instruction|
  current_register_value = acc[:register_value]
  current_cycle = acc[:cycle]
  current_CRT = acc[:CRT]
  sprite_positions = (current_register_value - 1)..(current_register_value + 1)

  instruction[:cycles].times do |_|
    row = current_row(current_cycle)
    column = current_cycle.remainder(40)

    unless row == 6
      current_CRT[row][column] = sprite_overlap?(column, sprite_positions) ? pixels[:lit] : pixels[:dark]
    end

    current_cycle += 1
  end

  current_register_value += instruction[:register_value]

  { register_value: current_register_value, cycle: current_cycle, CRT: current_CRT }
end

p 'Part two:'
lit_CRT[:CRT].each do |row|
  p row
  p ''
end
