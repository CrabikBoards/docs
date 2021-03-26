# Работа с UART

Работать только с кнопками и светодиодами не очень интересно.
К плате можно подключать различные сенсоры и прочее.
Для общения с ними может понадобится UART, SPI, TWI (I2C).
Начнем с UART.

В проект добавте модули `gpio` и `uarte` в импорт `crabik_board::hal`.
Напишите следующий код:

```rust
// Разделение GPIO на отдельные пины
let port0 = gpio::p0::Parts::new(periph.P0);
// Макрос который переименовывает пины микроконтроллера в названия пинов на плате
let pins = crabik_board::rename_pins!(port0);

// Подготовка пинов
let rxd = pins.d9.into_floating_input().degrade();
let txd = pins.d10.into_push_pull_output(gpio::Level::Low).degrade();

// Подготовка к работе UART
let mut uart = uarte::Uarte::new(
    periph.UARTE0,
    uarte::Pins {
        rxd: rxd,
        txd: txd,
        cts: None,
        rts: None,
    },
    uarte::Parity::EXCLUDED,
    uarte::Baudrate::BAUD115200,
);

// Создание буферов для передачи и приема данных
let mut tx_buffer = [0u8; 255];
let mut rx_buffer = [0u8; 255];

// Отправка "сырых" данных
let data = b"Hello!\n";
// Копируем все данные в буфер, что бы EasyDMA работал с оперативной памятью, а не с флешем
tx_buffer[0..data.len()].copy_from_slice(data);
uart.write(&tx_buffer).expect("Не удалось передать данные");

// Прием "сырых" данных
uart.read(&mut rx_buffer).expect("Не удалось получить данные");
```

В показанном выше примере настраиваются пины TX и RX, и сам UART.
После настройки UART мы оправляем и принимаем "сырые" байты.

Отправлять текст в UART удобнее через модуль `fmt` библеотеки `core`.
Добавьте импорт `core::fmt::Write`, и можете использовать вместо `uart.write` следующий код:

```rust
// Запись в UART форматированной строки
let number = 321;
writeln!(uart, "Пример форматированного вывода, number = {}", number).expect("Не удалось передать данные");
```
