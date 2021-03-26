# Работа с SPI

Для работы с дисплеями или быстрыми сенсорами не очень удобно использовать UART, для этого использую SPI.
Самое время его изучить. 

У nRF52 SPI разделен на две части - это SPIM и SPIS:
- SPIM - это SPI работающий в роли мастера, подходит для управления разными устройствами по SPI.
- SPIS - это SPI подходящий для работы в роли например сенсора, оно общается с мастером, но не управляет обменом информацией.

В проект добавьте модули `gpio` , `spim` или `spis` в импорт `crabik_board::hal`.
Часто используемый режим - SPI мастер, поэтому примеры далее будут про `spim` модуль.
Напишите следующий код:

```rust
// Разделение GPIO на отдельные пины
let port0 = gpio::p0::Parts::new(periph.P0);
// Макрос который переименовывает пины микроконтроллера в названия пинов на плате
let pins = crabik_board::rename_pins!(port0);

// Подготовка пинов
let clk = pins.d9.into_push_pull_output(gpio::Level::Low).degrade();
let mosi = pins.d10.into_push_pull_output(gpio::Level::Low).degrade();
let miso = pins.d11.into_floating_input().degrade();
let cs = pins.d12.into_push_pull_output(gpio::Level::Low).degrade();

// Подготовка к работе SPI мастера
let mut spi = spim::Spim::new(
    periph.SPIM0,
    spim::Pins {
        sck: clk,
        miso: Some(miso),
        mosi: Some(mosi),
    },
    spim::Frequency::M1,
    spim::MODE_0,
    0,
);

// Создание буферов для передачи и приема данных
let mut tx_buffer = [0u8; 255];
let mut rx_buffer = [0u8; 255];

let data = b"Hello!\n";
// Копируем все данные в буфер, что бы EasyDMA работал с оперативной памятью, а не с флешем
tx_buffer[0..data.len()].copy_from_slice(data);

// Передача и прием данных
spi.transfer_split_uneven(&mut cs, &tx_buffer, &mut rx_buffer)
    .expect("Не удалось передать или получить данные");
```

В показанном выше примере мы настраиваем пины и сам SPI.
После настройки SPI отправляем и принимаем "сырые" байты.
