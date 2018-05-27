enum E_WHEEL_STATE {
    IDLE,
    ROTATE,
    STOP,
    CALLBACK_DONE
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
    SEVEN_NUMBER,
    MAX
};

enum E_WHEEL_CALLBACK_STATE {
    NOT_DONE = 0,
    DONE
}