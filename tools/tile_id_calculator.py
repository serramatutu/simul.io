import sys

directions_dict = {
    'ul': 1,
    'u' : 2,
    'ur': 4,
    'l' : 8,
    'r' : 16,
    'dl': 32,
    'd' : 64,
    'dr': 128
}

def calculate(argv):
    direction_set = set(argv)
    sum = 0
    for d in direction_set:
        if directions_dict.has_key(d):
            sum += directions_dict[d]
    return sum


if __name__ == "__main__":
    print(calculate(sys.argv))