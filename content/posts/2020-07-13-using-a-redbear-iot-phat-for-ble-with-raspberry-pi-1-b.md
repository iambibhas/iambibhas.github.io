---
categories: ["raspberry", "pi", ]
date: 2020-07-13T04:44:17Z
description:  ""
draft: false
image: "/images/2021/01/0000_0000_00000000-69-.jpg"
slug: "using-a-redbear-iot-phat-for-ble-with-raspberry-pi-1-b"
tags: ["raspberry", "pi", ]
title: "Using a RedBear IoT pHAT for BLE with Raspberry Pi 1 B+"

---


This involves 2 pieces of h/w.

1. [A Raspberry Pi 1 B+](https://www.raspberrypi.org/products/raspberry-pi-1-model-b-plus/)
2. [A RedBear IoT pHAT](https://github.com/redbear/IoT_pHAT). ([Kickstarter](https://www.kickstarter.com/projects/redbearinc/iot-hat-for-raspberry-pi-a-must-have-for-pi-zero))

The HAT is primarily for a Pi Zero, but it works with any Raspberry Pi with 40 GPIO pins, hence my Pi 1 B+ qualifies.

I've had this Pi for years now and it was gathering dust. So recently decided to pick it up and do something with it. First I set up a Pi-hole instance on it and then a Telegraf+Influxdb+Grafana instance to monitor my home Internet connection. Then found that I also had a [BBC Micro:bit](https://microbit.org/get-started/user-guide/features-in-depth/) lying around and it comes with a bunch of sensors built in. So thought if I could connect the Micro:bit with the RPi, then I could use the sensors to monitor my home temperature real time for example. The other option is to get a temperature sensor for the Pi. But let's call that plan B.

But the Micro:bit doesn't come with any GPIO interface. The connectors are weird. I need to buy a separate [breakout shield](https://www.tanotis.com/products/sparkfun-sparkfun-micro-bit-breakout-with-headers) and then get a breadboard to connect to it. I thought why not use the BLE on board of Micro:bit to connect to it. And I happened to have a RedBear IoT pHAT lying around as well which I could connect to the RPi1 and make it Bluetooth enabled.

So, I connected it. Wi-Fi worked fine. But Bluetooth showed no sign of working. RPi couldn't initialize the Bluetooth controller.

```
pi@raspberrypi:~ $ sudo systemctl status hciuart.service
● hciuart.service - Configure Bluetooth Modems connected by UART
   Loaded: loaded (/lib/systemd/system/hciuart.service; enabled; vendor preset: enabled)
   Active: inactive (dead)

Jul 13 11:56:50 raspberrypi systemd[1]: Dependency failed for Configure Bluetooth Modems connected by UART.
Jul 13 11:56:50 raspberrypi systemd[1]: hciuart.service: Job hciuart.service/start failed with result 'dependency'.
```

So this followed hours of digging. From updating the Linux kernel to updating all the Bluetooth related packages. Nothing worked. Because I assumed that the pHAT h/w was fine and it'll just work. When no software changes worked, I started looking at the h/w. Went through the older issues of the pHAT repo, just to find this 4 year old issue.

{{< bookmark url="https://github.com/redbear/IoT_pHAT/issues/2" title="Bluetooth not working · Issue #2 · redbear/IoT_pHAT" description="Sometimes, the Bluetooth fails to load when booting up. The current method to resolve: https://github.com/redbear/IoT_pHAT/tree/master/eeprom/experimental But still need to add init_uart_clock=4800..." icon="https://github.githubassets.com/favicons/favicon.svg" author="redbear" publisher="GitHub" thumbnail="https://avatars2.githubusercontent.com/u/12958915?s=400&v=4" caption="" >}}

Apparently I could update the EEPROM firmware of the pHAT. Worth a shot. Instructions are [here](https://github.com/redbear/IoT_pHAT/tree/master/eeprom). Essentially,

```
git clone https://github.com/redbear/IoT_pHAT.git
cd Iot_pHAT/eeprom/bin
sudo ./eepflash.sh -f=IoT_pHAT-with-dt.eep -t=24c32 -w
```

After that I reboot the Pi once and viola. The `bluetoothctl` can now find the controller and I can scan for devices. 😊

```
pi@raspberrypi:~ $ sudo bluetoothctl
[NEW] Controller B8:27:EB:5C:DA:1D raspberrypi [default]
[bluetooth]# show
Controller XX:27:EB:XX:DA:XX
	Name: raspberrypi
	Alias: raspberrypi
	Class: 0x000000
	Powered: yes
	Discoverable: no
	Pairable: yes
	UUID: Generic Attribute Profile (00001801-0000-1000-8000-00805f9b34fb)
	UUID: A/V Remote Control        (0000110e-0000-1000-8000-00805f9b34fb)
	UUID: PnP Information           (00001200-0000-1000-8000-00805f9b34fb)
	UUID: Generic Access Profile    (00001800-0000-1000-8000-00805f9b34fb)
	UUID: A/V Remote Control Target (0000110c-0000-1000-8000-00805f9b34fb)
	Modalias: usb:v1D6Bp0246d052B
	Discovering: no
```

I still cannot connect to the Micro:bit to read the sensors though. But that seems like some other issue with the `bluezero` library. I'll go figure that out. Putting this post out here because I couldn't find much help on the Internet regarding this issue. So maybe this will help you.

Have a good day.

