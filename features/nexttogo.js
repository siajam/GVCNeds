import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";

export default function Nexttogo() {
  const defaultRace = [
    { meeting_name: "", race_number: "", advertised_start: { seconds: 0 } },
  ];

  const shwoTopCount = 5;
  const [races, setRaces] = useState([]);
  const [filteredRaces, setFilteredRaces] = useState([]);
  const [raceTimer, setRaceTimer] = useState({ timerList: [] });
  const [selectedRace, setSelectedRace] = useState("");
  const [intervalList, setIntervalList] = useState({ ilist: [] });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    fetch("https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=50")
      .then((res) => res.json())
      .then((res2) => {
        setRaces(Object.entries(res2.data.race_summaries));
      });
  }

  const onSelectChanged = (value) => {
    setSelectedRace(value);

    let temparray = [];
    races.forEach(function (item, i) {
      if (item[1].category_id == value) {
        var d = new Date(0);
        d.setUTCSeconds(item[1].advertised_start.seconds);
        var localDate = d.toLocaleString();
        item[1].AEST_advertised_startDateTime = localDate;

        var seconds =
          item[1].advertised_start.seconds - new Date().getTime() / 1000;

        item[1].index = item[1].race_id;
        startTimer(seconds, item[1].index); //item[1].race_id
        temparray.push(item);
      }
    });

    let tempArr = temparray.sort(
      (a, b) => a[1].advertised_start.seconds - b[1].advertised_start.seconds
    );
    setFilteredRaces(tempArr.slice(0, shwoTopCount));
  };

  const toDateTime = (secs) => {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t.toString();
  };

  const startTimer = (duration, index) => {
    var timer = duration,
      minutes,
      seconds;

    var refreshId = setInterval(() => {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      var tempCounter = minutes + ":" + seconds;

      let tempTimerArray = raceTimer.timerList;
      tempTimerArray[index] = tempCounter;

      setRaceTimer({ timerList: tempTimerArray });

      if (--timer < -60) {
        intervalList.ilist.forEach(function (item) {
          if (item.index == index) clearInterval(item.refreshId);
        });
      }
    }, 1000);

    var tempIntervalList = intervalList.ilist;
    tempIntervalList.push({ refreshId: refreshId, index: index });

    setIntervalList({ ilist: tempIntervalList });
  };

  return (
    <View style={styles.container}>
      <Text>Next to go!!!!!!!</Text>
      <RNPickerSelect
        onValueChange={(value) => onSelectChanged(value)}
        items={[
          {
            label: "Greyhound racing:",
            value: "9daef0d7-bf3c-4f50-921d-8e818c60fe61",
          },
          {
            label: "Harness racing",
            value: "161d9be2-e909-4326-8c2c-35ed71fb460b",
          },
          {
            label: "Horse racing",
            value: "4a2788f8-e825-4d36-9894-efd4baf1cfae",
          },
        ]}
      />
      <View>
        {filteredRaces.map((item, index) => (
          <TouchableOpacity>
            <Text style={styles.textStyle}>
              meeting name :{item[1].meeting_name}
            </Text>
            <Text style={styles.textStyle}>
              race number :{item[1].race_number}
            </Text>
            <Text style={styles.textStyle}>
              start time AEST:
              {item[1].AEST_advertised_startDateTime}
            </Text>
            <Text style={styles.textStyle}>
              Count Down:
              {raceTimer.timerList[item[1].race_id]}
            </Text>
            --------------------------
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "300px",
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textStyle: {
    flex: 1,
    width: 500,
    position: "relative",
    backgroundColor: "#e5cef5",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
  },
});
