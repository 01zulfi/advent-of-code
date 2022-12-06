# frozen_string_literal: true

file_path = ARGV[0]

datastream = File.read(file_path)

def first_marker(datastream, distint_chars)
  datastream.chars.each_cons(distint_chars).with_index do |chars, i|
    return i + distint_chars if chars.uniq.length == chars.length
  end
end

p "Part one: #{first_marker(datastream, 4)}"
p "Part two: #{first_marker(datastream, 14)}"
