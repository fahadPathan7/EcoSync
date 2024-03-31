/* eslint-disable react/prop-types */
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";
import { useState, useEffect } from "react";
import axios from "axios";
import BengaliFont from "./SolaimanLipi_29-05-06.ttf";
import backendURL from "../../lib/backendURL";

Font.register({
  family: "SolaimanLipi",
  src: BengaliFont,
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 10,
  },
  section: {
    margin: 5,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    margin: 10,
    fontWeight: "bold",
  },
  text: {
    margin: 10,
    fontSize: 14,
    textAlign: "justify",
  },
});

function BillPDF({ billID }) {
  const [billData, setBillData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendURL}/bill/${billID}`, {
          withCredentials: true,
        });
        setBillData(response.data.bill);
        console.log("here "+response.data.bill);
      } catch (error) {
        console.error("Error fetching bill data:", error);
      }
    };
    fetchData();
  }, [billID]);

  if (!billData) {
    return <Text>Loading...</Text>;
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>বিল বিস্তারিত</Text>
          
          <Text style={styles.subtitle}>সাধারণ ইনফরমেশন:</Text>
          <Text style={styles.text}>বিল আইডি: {billData.billID}</Text>
          <Text style={styles.text}>ট্রাক নাম্বার: {billData.vehicleNumber}</Text>
          <Text style={styles.text}>STS আইডি: {billData.stsID}</Text>
          <Text style={styles.text}>Landfill আইডি: {billData.landfillID}</Text>
          <Text style={styles.text}>দায়িত্বপ্রাপ্ত ল্যান্ডফিল ম্যানেজার: {billData.responsibleLandfillManager}</Text>

          <Text style={styles.subtitle}>Operational Details:</Text>
          <Text style={styles.text}>উপযোগিতা(Capacity): {billData.capacity}</Text>
          <Text style={styles.text}>ময়লার পরিমাণ: {billData.volumeOfWaste}</Text>
          <Text style={styles.text}>Time of Departure (STS): {billData.timeOfDepartureSts}</Text>
          <Text style={styles.text}>Time of Arrival (Landfill): {billData.timeOfArrivalLandfill}</Text>

          <Text style={styles.subtitle}>খরচ বিবরণ:</Text>
          <Text style={styles.text}> Cost Per Kilometer to (Landfill): ৳{billData.costPerKilometerToLandfill}</Text>
          <Text style={styles.text}>Cost Per Kilometer Back to STS: ৳{billData.costPerKilometerToBackToSts}</Text>
          <Text style={styles.text}>Two Way Distance: {billData.twoWayDistance} km</Text>
          <Text style={styles.text}>Total Cost: ৳{billData.totalCost}</Text>

          <Text style={styles.subtitle}>Timestamps:</Text>
          <Text style={styles.text}>Created At: {new Date(billData.createdAt).toLocaleString()}</Text>
          <Text style={styles.text}>Updated At: {new Date(billData.updatedAt).toLocaleString()}</Text>
        </View>
      </Page>
    </Document>
  );
}

export default BillPDF;
