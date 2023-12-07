package main

import (
	"os"
	"regexp"
	"strconv"
	"strings"
)

func main() {
	filepath := os.Args[1]
	input := strings.Split(readTextFile(filepath), "\n")

	// part 1
	valuesP1 := mapper(mapper(input, getDigits), getCalibrationValue)
	sumP1 := sum(valuesP1)
	println("Part 1:", sumP1)

	// part 2
	valuesP2 := mapper(mapper(input, getDigitsPartTwo), getCalibrationValue)
	sum2 := sum(valuesP2)
	println("Part 2:", sum2)
}

func readTextFile(filename string) string {
	content, err := os.ReadFile(filename)
	if err != nil {
		return ""
	} else {
		return string(content)
	}
}

func getDigits(string string) string {
	re := regexp.MustCompile("[0-9]+")
	return strings.Join(re.FindAllString(string, -1), "")
}

type firstAndLast struct {
	first string
	last  string
}

func getFirstAndLastChar(string string) firstAndLast {
	return firstAndLast{string[0:1], string[len(string)-1:]}
}

func getCalibrationValue(string string) int64 {
	firstAndLast := getFirstAndLastChar(string)
	value, _ := strconv.ParseInt(firstAndLast.first+firstAndLast.last, 0, 64)
	return value
}

func getDigitsPartTwo(str string) string {
	digitMap := map[string]string{
		"zero":  "0",
		"one":   "1",
		"two":   "2",
		"three": "3",
		"four":  "4",
		"five":  "5",
		"six":   "6",
		"seven": "7",
		"eight": "8",
		"nine":  "9",
	}
	for key, value := range digitMap {
		str = strings.ReplaceAll(str, key, key+value+key)
	}
	return getDigits(str)
}

func mapper[T, U any](slice []T, f func(T) U) []U {
	mapped := make([]U, len(slice))
	for i := range slice {
		mapped[i] = f(slice[i])
	}
	return mapped
}

func sum(slice []int64) int64 {
	var sum int64 = 0
	for _, value := range slice {
		sum += value
	}
	return sum
}
