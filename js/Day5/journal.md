Part 1 - Simple enough to check each ingredient if it is in the list or not.

Part 2 - OK, now we need to flatten the ranges of valid values, which have lots of overlaps. It took a few passes to come down to an algorigthm that works. There were a few fun twists in the data set, like duplicate ranges, and ranges fully inside other ranges. My loop is quite small and I'm proud of that. Sort, process in order, and for each one look backwards to make sure this entry starts after all of the previous ones ends. This creates some invalid ranges which I then prune out.
