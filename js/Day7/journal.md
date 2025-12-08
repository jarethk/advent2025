Part 1 - I decided the best way to tackle is with a line scan going down rows. This mostly worked, but I added a method to fill-down to make it more efficient so the line scanning only had to look for '^'.

Part 2 - I don't know why this seemed so hard. I kept coming up with complex solutions doing recursion or some other such. Of course the tree size is too large for recursion. Then I slept on it and realized this was the same as the line scanning from part 1, but I just needed to keep track of how many branches were coming down the same vertical column. And it just worked.
