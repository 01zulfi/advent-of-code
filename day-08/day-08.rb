# frozen_string_literal: true

file_path = ARGV[0]

class TreeGrid
  attr_reader :grid

  def initialize(grid)
    @grid = grid
    @width = grid.first.size
    @height = grid.size
  end

  def adjacent_trees(x, y)
    { left: grid[x].slice(0, y), right: grid[x].slice(y + 1, @width),
      up: grid.transpose[y].slice(0, x), down: grid.transpose[y].slice(x + 1, @height) }
  end

  def total_edges
    (@width * 2) + (@height * 2) - 4
  end

  def edge?(x, y)
    (x - 1).negative? || x == (@width - 1) || (y - 1).negative? || y == (@height - 1)
  end
end

grid = File.read(file_path).split("\n").map { |row| row.chars.map(&:to_i) }

trees = TreeGrid.new(grid)

visible_in_interiors = 0

trees.grid.each.with_index do |row, x|
  row.each.with_index do |tree_height, y|
    unless trees.edge?(x, y)
      adjacents = trees.adjacent_trees(x, y)

      visibilities = adjacents.values.map do |direction|
        direction.all? { |height| height < tree_height }
      end

      visible_in_interiors += + 1 if visibilities.any?(true)
    end
  end
end

p "Part one: #{trees.total_edges + visible_in_interiors}"

scenic_scores = []

trees.grid.each.with_index do |row, x|
  row.each.with_index do |tree_height, y|
    unless trees.edge?(x, y)
      adjacents = trees.adjacent_trees(x, y)

      adjacents_adjusted = {
        left: adjacents[:left].reverse,
        right: adjacents[:right],
        up: adjacents[:up].reverse,
        down: adjacents[:down]
      }

      viewable_trees = adjacents_adjusted.transform_values do |direction|
        shorter_trees = direction.take_while do |height|
          height < tree_height
        end

        shorter_trees.size == direction.size ? shorter_trees.size : shorter_trees.size + 1
      end

      scenic_scores << viewable_trees.values.inject(&:*)
    end
  end
end

p "Part two: #{scenic_scores.max}"
