Part 1 - this math is quite the invention. I used some regex to ignore the whitespaces between numbers for parsing, created a small method to pivot the grid, and a loop to add/multiply the numbers.

Part 2 - now I can't just ignore clusters of whitespace, the whitespace has meaning. So I consume the full input set into a grid of characters, pivot the whole grid, then reconstitute it into numbers to add/multiply.
