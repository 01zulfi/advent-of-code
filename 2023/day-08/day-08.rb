file_path = ARGV[0]
raw_input = File.read(file_path).split("\n")

Node = Data.define(:val, :left, :right)

def parse_node(raw_node)
  val, _ , left, right = raw_node.split(/[=,(,\,)]/)
  [val, left, right].map(&:strip)
end

raw_directions, raw_nodes = [raw_input[0], raw_input[2..]]

nodes = raw_nodes.map { |raw_node| Node.new(*parse_node(raw_node)) }
directions = raw_directions.split("")

steps = 0
cur_node = nodes.find { |node| node.val == 'AAA' }
q = [].concat(directions)
while true
  direction = q.shift

  if cur_node.val == 'ZZZ'
    break
  end
  if direction == 'L'
    steps += 1
    cur_node = nodes.find { |node| node.val == cur_node.left }
  end
  if direction == 'R'
    steps += 1
    cur_node = nodes.find { |node| node.val == cur_node.right }
  end
  if q.empty?
    q.concat(directions)
  end
end

p "Part 1: #{steps}"

starting_nodes = nodes.select { |node| node.val.end_with?('A') }
steps_till_ending_nodes = starting_nodes.map do |starting_node|
  steps = 0
  cur_node = starting_node
  q = [].concat(directions)
  while true
    direction = q.shift

    if cur_node.val.end_with?('Z')
      break
    end
    if direction == 'L'
      steps += 1
      cur_node = nodes.find { |node| node.val == cur_node.left }
    end
    if direction == 'R'
      steps += 1
      cur_node = nodes.find { |node| node.val == cur_node.right }
    end
    if q.empty?
      q.concat(directions)
    end
  end
  steps
end

p "Part 2: #{steps_till_ending_nodes.reduce(1, :lcm)}"
