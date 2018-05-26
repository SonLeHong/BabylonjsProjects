enum E_WHELL_STATE {
    IDLE,
    ROTATE,
    ROTATE_DONE
};

const WheelNumber: number = 3;

var rules: number[][] =
    [
        [0, 0, 0],
        [1, 1, 1],
        [2, 2, 2],
        [0, 1, 2],
        [2, 1, 0],
    ];

enum E_WHEEL_VALUE {
    ORANGE = 0,
    BLUEBERRY,
    BAR,
    BANANA,
    WATERMELON,
    GRAPE,
    MANGO,
    SEVEN_NUMBER
};