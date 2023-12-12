file_path = ARGV[0]
raw_input = File.read(file_path)

def get_numbers(string)
  string.scan(/\d+/).map(&:to_i)
end

Row = Data.define(:springs, :arrangements) do
  def contiguous
    springs.split(".").reject(&:empty?)
  end
end

rows = raw_input.split("\n").map do |row|
  springs, arrangemenets = row.split(" ")
  Row.new(springs, get_numbers(arrangemenets))
end

def unknown?(char)
  char == "?"
end

def unknowns_at(string)
  string.chars.each_with_index.select { |char, index| unknown?(char) }.map(&:last)
end

def comb(string)
  unknowns = unknowns_at(string)
  unknowns_size = unknowns.size
  combinations = [".","#"].repeated_permutation(unknowns_size).to_a.uniq
  combinations.map do |combination|
    copy = string.dup
    unknowns.each_with_index do |unknown, index|
      copy[unknown] = combination[index]
    end
    copy
  end
end

def broken_tally(string)
  string.split(".").map { |s| s.chars.tally["#"] }.join.chars.map(&:to_i)
end

contiguous_springs = rows.map(&:contiguous)
combs = contiguous_springs.map { |strings| strings.map { |string| comb(string) } }
new_springs = combs.each_with_index.map do |combinations,i|
  springs = rows[i].springs
  arrangements = rows[i].arrangements
  arrangemen_map = {}
  puts "\n"
  p springs
  p arrangements
  combinations.map do |combination|
    combination.map do |c|
      tally = broken_tally(c)
      p "this is enough"
    end
  end
end
