Part 1 - calculate the distances between the points, and sort that list of distances so we know which ones are closest. To join connections into circuits do a simple loop and keep adding to a list of circuits with sets of connections. My algorithm to join/collapse circuits then repeats until it stops joining things. That last part could be more efficient, but works.

Part 2 - Improved the connection algorithm to also join/collapse if the new endpoints are in multiple circuits. Now we keep running until we have one circuit that includes all of the points.
