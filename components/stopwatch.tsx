import React, {useState, useEffect, useRef} from 'react';
import { Button, StyleSheet, View, Text, Pressable, ImageBackground } from 'react-native';
import whiteBox from '@/assets/images/white-box.png';

const Stopwatch = ({getTimeValue}: {getTimeValue: (time: number) => void}) => {
  const [startStopText, setStartStopText] = useState("Start");
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalIdRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
    }
    return () => {
      clearInterval(intervalIdRef.current);
    }
  }, [isRunning]);

  function startStop() {
    if (isRunning)
      stop()
    else
      start()
  }

  function start() {
    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsedTime;
    setStartStopText("Stop")
  }

  function stop() {
    setIsRunning(false);
    getTimeValue(elapsedTime)
    setStartStopText("Start")
  }

  function reset() {
    setElapsedTime(0);
    setStartStopText("Start");
    setIsRunning(false);
  }

  function formatTime(){
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
    const seconds = Math.floor(elapsedTime / (1000) % 60);
    const milliseconds = Math.floor((elapsedTime % 1000) / 10);

    const paddedHours = String(hours).padStart(2, "0");
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(seconds).padStart(2, "0");
    const paddedMilliseconds = String(milliseconds).padStart(2, "0");
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}:${paddedMilliseconds}`;
  }

  return (
    <View style={{flex: 1, alignItems: "center", padding: 10}}>
      <View style={stopwatchStyles.stopwatchContainer}>
        <Text style={stopwatchStyles.stopwatchText}>{formatTime()}</Text>
      </View>
      <View style={stopwatchStyles.buttonContainer}>
        <Pressable onPress={startStop}>
          <ImageBackground
            style={stopwatchStyles.modalButtons}
            source={whiteBox}
            tintColor={"#EDEDED"}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>{startStopText}</Text>
          </ImageBackground>
        </Pressable>
        <Pressable onPress={reset}>
          <ImageBackground
            style={stopwatchStyles.modalButtons}
            source={whiteBox}
            tintColor={"#EDEDED"}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Reset</Text>
          </ImageBackground>
        </Pressable>
      </View>
    </View>
  );
}

const stopwatchStyles = StyleSheet.create({
  stopwatchText: {
    fontSize: 45,
    fontWeight: "black"
  },
  stopwatchContainer: {
    flex: 0.65,
    alignItems: "center"
  },
  buttonContainer: {
    flex: 0.3,
    flexDirection: "row",
    alignItems: "center"
  },
  modalButtons: {
    height: 50,
    width: 100,
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
})
export default Stopwatch