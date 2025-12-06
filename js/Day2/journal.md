Part 1 - this was fun, we have to find where the value is the same squence twice. So we split the string (hint: only need to do if even length) and compare the two parts.

Part 2 - This took some thinking through. We can no longer focus just on even length values, because it could be a single digit repeated multiple times. I generate a set of options from the first half of the value, and use string replacement with an empty string to see if we can turn the value into an empty string.
