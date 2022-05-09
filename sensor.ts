
/**
 * 声音序号
 */
enum SoundIndex {
    //% block="1"
    one = 1,
    //% block="2"
    two,
    //% block="3"
    three,
    //% block="4"
    fore,
    //% block="5"
    five,
    //% block="6"
    six
}

enum HetaoPingUnit {
    //% block="μs"
    MicroSeconds,
    //% block="cm"
    Centimeters,
    //% block="inches"
    Inches
}

//% weight=5 color=#FF7A4B icon="\uf015" block="传感器"
//% groups=['音频模块', '超声波模块', 'others']
namespace HetaoSensor {

    //% blockId="hetao_sensor_volume" block="读取声音强度"
    //% weight=85 blockGap=8
    //% group="音频模块"
    export function volume(): number {
        pins.i2cWriteNumber(10, 0, NumberFormat.UInt8LE, true)
        let vol = pins.i2cReadNumber(10, NumberFormat.UInt8LE, false)
        return vol
    }

    //% blockId="hetao_sensor_play_sound" block="播放第%id|号录音"
    //% weight=85 blockGap=8
    //% group="音频模块"
    export function playSound(id: SoundIndex) {
        let num = 0x0200
        num += id
        pins.i2cWriteNumber(10, num, NumberFormat.UInt16BE, false)
    }

    //% blockId="hetao_sensor_record_sound" block="录制第%id|号录音"
    //% weight=85 blockGap=8
    //% group="音频模块"
    export function recordSound(id: SoundIndex) {
        let num = 0x0100
        num += id
        pins.i2cWriteNumber(10, num, NumberFormat.UInt16BE, false)
    }

    /**
     * Send a ping and get the echo time (in microseconds) as a result
     * @param trig tigger pin
     * @param echo echo pin
     * @param unit desired conversion unit
     * @param maxCmDistance maximum distance in centimeters (default is 500)
     */
    //% blockId=hetao_sonar_ping block="ping trig %trig|echo %echo|unit %unit"
    //% group="超声波模块"
    export function ping(trig: DigitalPin, echo: DigitalPin, unit: HetaoPingUnit, maxCmDistance = 500): number {
        // send pulse
        pins.setPull(trig, PinPullMode.PullNone);
        pins.digitalWritePin(trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 0);

        // read pulse
        const d = pins.pulseIn(echo, PulseValue.High, maxCmDistance * 58);

        switch (unit) {
            case HetaoPingUnit.Centimeters: return Math.idiv(d, 58);
            case HetaoPingUnit.Inches: return Math.idiv(d, 148);
            default: return d;
        }
    }
}