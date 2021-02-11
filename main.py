class Go(Enum):
    STRAIGHT = 0
    SPIN_LEFT = 1
    SPIN_RIGHT = 2
    MOVE_LEFT = 3
    MOVE_RIGHT = 4

def strip_sensor():
    global pixelState2
    pixelState2 += 1
    if pixelState2 > 1:
        pixelState2 = 0
    strip2.clear()
    strip2.show()
    if pixelState2 == 0:
        strip2.set_pixel_color(0, neopixel.colors(NeoPixelColors.YELLOW))
        strip2.show()
    elif pixelState2 == 1:
        strip2.set_pixel_color(1, neopixel.colors(NeoPixelColors.GREEN))
        strip2.show()
    else:
        basic.show_icon(IconNames.NO)

def strip_extern():
    global pixelState4
    pixelState4 += 1
    if pixelState4 > 3:
        pixelState4 = 0
    strip4.clear()
    strip4.show()
    if pixelState4 == 0:
        strip4.set_pixel_color(0, neopixel.colors(NeoPixelColors.RED))
        strip4.show()
    elif pixelState4 == 1:
        strip4.set_pixel_color(1, neopixel.colors(NeoPixelColors.ORANGE))
        strip4.show()
    elif pixelState4 == 2:
        strip4.set_pixel_color(2, neopixel.colors(NeoPixelColors.BLUE))
        strip4.show()
    elif pixelState4 == 3:
        strip4.set_pixel_color(3, neopixel.colors(NeoPixelColors.PURPLE))
        strip4.show()
    else:
        basic.show_icon(IconNames.NO)

def sensor_speech_config():
    Speech.Set_IICAddress(Speech.I2C_ADDR_Select.NEW_ADDR)
    Speech.set_intonation(5)
    Speech.set_speed(5)
    Speech.set_volume(10)
    Speech.set_style(Speech.Style_Type.STYLE_CONTINUE)
    Speech.set_language(Speech.Language_Type.LANGUAGE_AUTO)
    Speech.set_rhythm(Speech.Rhythm_Type.RHYTHM_ENABLE)
    Speech.set_reader(Speech.Reader_Type.READER_XIAOYAN)
    Speech.set_number_handle(Speech.NumberHandle_Type.NUMBERHANDLE_AUTO)
    Speech.set_name_pronunciation(Speech.NamePronunciation_Type.NAMEPRONUNCIATION_AUTO)
    Speech.set_spell(Speech.Spell_Type.SPELL_ENABLE)
    Speech.set_one_pronunciation(Speech.OnePronunciation_Type.ONEPRONUNCIATION_YAO)

autoRun = 0
detectOrder = 0
direction = Go.STRAIGHT
dircetionOld = Go.STRAIGHT
distance = 0
enableSensor1 = 1
enableSensor2 = 1
gesture = 0
gestureTime = 0
pixelState2 = 0
pixelState4 = 0
strip2: neopixel.Strip = None
strip4: neopixel.Strip = None
turning = 0
turnTime = 0

basic.show_icon(IconNames.SAD)
while GestureRecognition.gesture_init() == 255:
    basic.pause(100)
strip2 = neopixel.create(DigitalPin.P2, 2, NeoPixelMode.RGB_RGB)
strip4 = SuperBit.RGB_Program()
sensor_speech_config()
Speech.Speech_Text("hui4yong3**wo3men2zou3")
Speech.Wait_XFS_Status(Speech.ChipStatus_Type.CHIPSTATUS_IDLE)
basic.show_icon(IconNames.HAPPY)

def on_forever():
    global autoRun, detectOrder
    global direction, dircetionOld, distance
    global enableSensor1, enableSensor2
    global gesture, gestureTime
    global turning, turnTime

    basic.pause(1)

    serial.write_line("1")
    serial.write_number(input.running_time())

    if enableSensor1 == 1:
        if turning == 0:
            distance = CrocoKit_Sensor.V2RGBUL(DigitalPin.P1)
            if distance > 300:
                distance = 300
            elif distance < 5:
                distance = 5

            if distance < 15:
                direction = Go.SPIN_LEFT
                turning = 1
                turnTime = 3
            elif distance < 30:
                direction = Go.SPIN_RIGHT
                turning = 1
                turnTime = 3
            else:
                pass
        else:
            pass
    else:
        pass

    serial.write_line("2")

    if enableSensor2 == 1:
        gesture = GestureRecognition.get_gesture()
        if gesture == GestureRecognition.select_gesture(GestureRecognition.Gesture_state.RIGHT):
            gestureTime = 2
            turning = 1
            direction = Go.MOVE_LEFT
        elif gesture == GestureRecognition.select_gesture(GestureRecognition.Gesture_state.LEFT):
            gestureTime = 2
            turning = 1
            direction = Go.MOVE_RIGHT
        else:
            pass
    else:
        pass

    serial.write_line("3")

    if autoRun == 1:
        if dircetionOld != direction:
            dircetionOld = direction

            if direction == Go.STRAIGHT:
                OmniBit.car_run(OmniBit.enCarRun.FORWARD, 100)
            elif direction == Go.SPIN_LEFT:
                OmniBit.car_run(OmniBit.enCarRun.SPIN_LEFT, 50)
            elif direction == Go.SPIN_RIGHT:
                OmniBit.car_run(OmniBit.enCarRun.SPIN_RIGHT, 50)
            elif direction == Go.MOVE_LEFT:
                OmniBit.car_run(OmniBit.enCarRun.MOVE_RIGHT, 100)
            elif direction == Go.MOVE_RIGHT:
                OmniBit.car_run(OmniBit.enCarRun.MOVE_LEFT, 100)
            else:
                OmniBit.motor_stop_all()
        else:
            pass
    else:
        pass

    serial.write_line("4")

    if turnTime > 0:
        turnTime += 0 - 1
        if turnTime == 0:
            turning = 0
            direction = Go.STRAIGHT
        else:
            pass
    elif turnTime == 0:
        pass
    else:
        basic.show_icon(IconNames.NO)

    serial.write_line("5")

    if gestureTime > 0:
        gestureTime += 0 - 1
        if gestureTime == 0:
            direction = Go.STRAIGHT
            turning = 0
        else:
            pass
    elif gestureTime == 0:
        pass
    else:
        basic.show_icon(IconNames.NO)

    serial.write_line("6")

    detectOrder += 1
    if detectOrder > 1:
        detectOrder = 0

    serial.write_line("7")
    basic.show_icon(IconNames.HEART)
basic.forever(on_forever)

def on_in_background():
    global direction
    basic.show_icon(IconNames.NO)
    while True:
        basic.pause(1)

        serial.write_line("11")
        serial.write_number(input.running_time())

        if direction == Go.STRAIGHT:
            basic.show_arrow(ArrowNames.NORTH)
        elif direction == Go.SPIN_LEFT:
            basic.show_arrow(ArrowNames.NORTH_WEST)
        elif direction == Go.SPIN_RIGHT:
            basic.show_arrow(ArrowNames.NORTH_EAST)
        elif direction == Go.MOVE_LEFT:
            basic.show_arrow(ArrowNames.WEST)
        elif direction == Go.MOVE_RIGHT:
            basic.show_arrow(ArrowNames.EAST)
        else:
            basic.show_icon(IconNames.SAD)

        serial.write_line("12")

        strip_sensor()
        strip_extern()

        serial.write_line("13")

    basic.show_icon(IconNames.NO)
control.in_background(on_in_background)

def on_button_pressed_a():
    global autoRun
    basic.show_string("A")
    if autoRun == 0:
        autoRun = 1
    else:
        autoRun = 0
        OmniBit.motor_stop_all()
    serial.write_line("button a pressed")
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    global enableSensor1
    basic.show_string("B")
    if enableSensor1 == 0:
        enableSensor1 = 1
    else:
        enableSensor1 = 0
    serial.write_line("button b pressed")
input.on_button_pressed(Button.B, on_button_pressed_b)
