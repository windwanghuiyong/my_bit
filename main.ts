class Go {
    static STRAIGHT = 0
    static SPIN_LEFT = 1
    static SPIN_RIGHT = 2
    static MOVE_LEFT = 3
    static MOVE_RIGHT = 4
}

function strip_sensor() {
    
    pixelState2 += 1
    if (pixelState2 > 1) {
        pixelState2 = 0
    }
    
    strip2.clear()
    strip2.show()
    if (pixelState2 == 0) {
        strip2.setPixelColor(0, neopixel.colors(NeoPixelColors.Yellow))
        strip2.show()
    } else if (pixelState2 == 1) {
        strip2.setPixelColor(1, neopixel.colors(NeoPixelColors.Green))
        strip2.show()
    } else {
        basic.showIcon(IconNames.No)
    }
    
}

function strip_extern() {
    
    pixelState4 += 1
    if (pixelState4 > 3) {
        pixelState4 = 0
    }
    
    strip4.clear()
    strip4.show()
    if (pixelState4 == 0) {
        strip4.setPixelColor(0, neopixel.colors(NeoPixelColors.Red))
        strip4.show()
    } else if (pixelState4 == 1) {
        strip4.setPixelColor(1, neopixel.colors(NeoPixelColors.Orange))
        strip4.show()
    } else if (pixelState4 == 2) {
        strip4.setPixelColor(2, neopixel.colors(NeoPixelColors.Blue))
        strip4.show()
    } else if (pixelState4 == 3) {
        strip4.setPixelColor(3, neopixel.colors(NeoPixelColors.Purple))
        strip4.show()
    } else {
        basic.showIcon(IconNames.No)
    }
    
}

function sensor_speech_config() {
    Speech.Set_IICAddress(Speech.I2C_ADDR_Select.NEW_ADDR)
    Speech.SetIntonation(5)
    Speech.SetSpeed(5)
    Speech.SetVolume(10)
    Speech.SetStyle(Speech.Style_Type.Style_Continue)
    Speech.SetLanguage(Speech.Language_Type.Language_Auto)
    Speech.SetRhythm(Speech.Rhythm_Type.Rhythm_Enable)
    Speech.SetReader(Speech.Reader_Type.Reader_XiaoYan)
    Speech.SetNumberHandle(Speech.NumberHandle_Type.NumberHandle_Auto)
    Speech.SetNamePronunciation(Speech.NamePronunciation_Type.NamePronunciation_Auto)
    Speech.SetSpell(Speech.Spell_Type.Spell_Enable)
    Speech.SetOnePronunciation(Speech.OnePronunciation_Type.OnePronunciation_Yao)
}

let autoRun = 0
let detectOrder = 0
let direction = Go.STRAIGHT
let dircetionOld = Go.STRAIGHT
let distance = 0
let enableSensor1 = 1
let enableSensor2 = 1
let gesture = 0
let gestureTime = 0
let pixelState2 = 0
let pixelState4 = 0
let strip2 : neopixel.Strip = null
let strip4 : neopixel.Strip = null
let turning = 0
let turnTime = 0
basic.showIcon(IconNames.Sad)
while (GestureRecognition.GestureInit() == 255) {
    basic.pause(100)
}
strip2 = neopixel.create(DigitalPin.P2, 2, NeoPixelMode.RGB_RGB)
strip4 = SuperBit.RGB_Program()
sensor_speech_config()
Speech.Speech_Text("hui4yong3**wo3men2zou3")
Speech.Wait_XFS_Status(Speech.ChipStatus_Type.ChipStatus_Idle)
basic.showIcon(IconNames.Happy)
basic.forever(function on_forever() {
    
    
    
    
    
    basic.pause(1)
    serial.writeLine("1")
    serial.writeNumber(input.runningTime())
    if (enableSensor1 == 1) {
        if (turning == 0) {
            distance = CrocoKit_Sensor.V2RGBUL(DigitalPin.P1)
            if (distance > 300) {
                distance = 300
            } else if (distance < 5) {
                distance = 5
            }
            
            if (distance < 15) {
                direction = Go.SPIN_LEFT
                turning = 1
                turnTime = 3
            } else if (distance < 30) {
                direction = Go.SPIN_RIGHT
                turning = 1
                turnTime = 3
            } else {
                
            }
            
        } else {
            
        }
        
    } else {
        
    }
    
    serial.writeLine("2")
    if (enableSensor2 == 1) {
        gesture = GestureRecognition.GetGesture()
        if (gesture == GestureRecognition.SelectGesture(GestureRecognition.Gesture_state.right)) {
            gestureTime = 2
            turning = 1
            direction = Go.MOVE_LEFT
        } else if (gesture == GestureRecognition.SelectGesture(GestureRecognition.Gesture_state.left)) {
            gestureTime = 2
            turning = 1
            direction = Go.MOVE_RIGHT
        } else {
            
        }
        
    } else {
        
    }
    
    serial.writeLine("3")
    if (autoRun == 1) {
        if (dircetionOld != direction) {
            dircetionOld = direction
            if (direction == Go.STRAIGHT) {
                OmniBit.CarRun(OmniBit.enCarRun.Forward, 100)
            } else if (direction == Go.SPIN_LEFT) {
                OmniBit.CarRun(OmniBit.enCarRun.Spin_Left, 50)
            } else if (direction == Go.SPIN_RIGHT) {
                OmniBit.CarRun(OmniBit.enCarRun.Spin_Right, 50)
            } else if (direction == Go.MOVE_LEFT) {
                OmniBit.CarRun(OmniBit.enCarRun.MoveRight, 100)
            } else if (direction == Go.MOVE_RIGHT) {
                OmniBit.CarRun(OmniBit.enCarRun.MoveLeft, 100)
            } else {
                OmniBit.MotorStopAll()
            }
            
        } else {
            
        }
        
    } else {
        
    }
    
    serial.writeLine("4")
    if (turnTime > 0) {
        turnTime += 0 - 1
        if (turnTime == 0) {
            turning = 0
            direction = Go.STRAIGHT
        } else {
            
        }
        
    } else if (turnTime == 0) {
        
    } else {
        basic.showIcon(IconNames.No)
    }
    
    serial.writeLine("5")
    if (gestureTime > 0) {
        gestureTime += 0 - 1
        if (gestureTime == 0) {
            direction = Go.STRAIGHT
            turning = 0
        } else {
            
        }
        
    } else if (gestureTime == 0) {
        
    } else {
        basic.showIcon(IconNames.No)
    }
    
    serial.writeLine("6")
    detectOrder += 1
    if (detectOrder > 1) {
        detectOrder = 0
    }
    
    serial.writeLine("7")
    basic.showIcon(IconNames.Heart)
})
control.inBackground(function on_in_background() {
    
    basic.showIcon(IconNames.No)
    while (true) {
        basic.pause(1)
        serial.writeLine("11")
        serial.writeNumber(input.runningTime())
        if (direction == Go.STRAIGHT) {
            basic.showArrow(ArrowNames.North)
        } else if (direction == Go.SPIN_LEFT) {
            basic.showArrow(ArrowNames.NorthWest)
        } else if (direction == Go.SPIN_RIGHT) {
            basic.showArrow(ArrowNames.NorthEast)
        } else if (direction == Go.MOVE_LEFT) {
            basic.showArrow(ArrowNames.West)
        } else if (direction == Go.MOVE_RIGHT) {
            basic.showArrow(ArrowNames.East)
        } else {
            basic.showIcon(IconNames.Sad)
        }
        
        serial.writeLine("12")
        strip_sensor()
        strip_extern()
        serial.writeLine("13")
    }
    basic.showIcon(IconNames.No)
})
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    basic.showString("A")
    if (autoRun == 0) {
        autoRun = 1
    } else {
        autoRun = 0
        OmniBit.MotorStopAll()
    }
    
    serial.writeLine("button a pressed")
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
    basic.showString("B")
    if (enableSensor1 == 0) {
        enableSensor1 = 1
    } else {
        enableSensor1 = 0
    }
    
    serial.writeLine("button b pressed")
})
