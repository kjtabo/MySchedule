import React, {useState} from 'react';
import { View, ImageBackground, Pressable, Text, StyleSheet } from 'react-native';
import {Agenda} from 'react-native-calendars';
import whiteBox from '@/assets/images/white-box.png';
import { Href, router } from 'expo-router';

const getDateToday = () => {
  const date = new Date();
  return date.toISOString().split("T")[0];
}

const Calendar = (data: any) => {
  const [items, setItems] = useState({});

  // "YYYY-MM-DD": [{"height": number, "name": string},]
  const taskData = {
    "2025-04-21": [{"name": "grocery"}, {"name": "bath"}, {"name": "shit"}],
    "2025-04-22": [{"name": "grocery"}, {"name": "bath"}, {"name": "shit"}],
    "2025-04-23": [{"name": "grocery"}, {"name": "bath"}, {"name": "shit"}],
  };

  const renderEmptyDate = () => {
    return (
      <View style={{ height: 15, flex: 1, paddingTop: 30 }}>
        <Text>This is empty date!</Text>
      </View>
    );
  };

  const renderItem = (item: any) => {
    return (
      <Pressable onPress={() => {router.push(`/common/datedetail/${data.uid}` as Href)}}>
        <ImageBackground 
          source={whiteBox}
          style={calendarStyles.taskContainer}
        >
          <View>
            <Text>{item.name}</Text>
          </View>
        </ImageBackground>
      </Pressable>
    );
  };

  return (
    <View style={calendarStyles.calendarContainer}>
      <Agenda
        items={taskData}
        selected={getDateToday()}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        showClosingKnob={true}
      />
    </View>
  );
};

const calendarStyles = StyleSheet.create({
  calendarContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 30,
    overflow: "hidden"
  },
  taskContainer: {
    height: 80,
    borderRadius: 10,
    marginTop: 5,
    marginRight: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden"
  }
});

export default Calendar;