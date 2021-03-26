# Работа с PWM (ШИМ)

Просто мигать светодиодом быстро надоест, поэтому сейчас мы будем менять его яркость.
Изменять яркость можно с помощью PWM.

В проект добавьте модули `gpio` и `pwm` в импорт `crabik_board::hal`.
Напишите следующий код:

```rust
// Разделение GPIO на отдельные пины
let port0 = gpio::p0::Parts::new(periph.P0);
// Создание "задержки"
let mut delay = delay::Delay::new(core_periph.SYST);
// Макрос который переименовывает пины микроконтроллера в названия пинов на плате
let pins = crabik_board::rename_pins!(port0);
// Переводит пин 11 в режим выхода
let led = pins.d11.into_push_pull_output(gpio::Level::Low).degrade();
// Переводит пин A0 в режим входа
let button = pins.a0.into_pullup_input();

// Подготовка к работе PWM
let pwm = pwm::Pwm::new(periph.PWM0);
pwm.set_period(1_000u32.hz()) // устанавливает выходную частоту PWM
    .set_output_pin(pwm::Channel::C0, &led) // связывает пин с каналом PWM
    .enable(); // включает генератор PWM

// Устанавливает максимальное значение цикла
pwm.set_max_duty(255);
let mut led_brightness: u8 = 0;

loop {
    if button.is_low().unwrap() {
        led_brightness += 10;
        // Устанавливаем сколько вывод должен быть включен
        pwm.set_duty_off(pwm::Channel::C0, led_brightness as u16);
    }
    delay.delay_ms(100u32);
}
```

Описанный выше код устанавливает максимальное значение цикла PWM, в цикле опрашивает кнопку, если кнопка нажата, то увеличиваем значение яркости светодиода, и задаем значение PWM.
Когда переменная `led_brightness` доходит до значения 255, она переполняется и становится снова 0.

Следующий пример покажет как плавно увеличивать и уменьшать яркость светодиода.
После строк настройки PWM измените код на:

```rust
// Устанавливает максимальное значение цикла
pwm.set_max_duty(255);

let mut up = true;
let mut n = 0;
let mut delay_change = 10;

loop {
    delay.delay_ms(delay_change);
    if up {
        n += 1;
        if n >= pwm.max_duty() {
            up = false
        }
    } else {
        n -= 1;
        if n <= 0 {
            up = true
        }
    }

    pwm.set_duty_off(pwm::Channel::C0, n);

    // Неравномерная задержка
    delay_change = (200 / (n + 4)) + 1;
}
```
