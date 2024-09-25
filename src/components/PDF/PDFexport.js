import React, { useEffect, useState } from "react";
import { Page, Text, Image, Document, StyleSheet } from "@react-pdf/renderer";
import fdmLogo from "../../resources/fdm-logo.png";
import { database }  from "../../firebase.js";
import { getDoc, doc } from 'firebase/firestore';

const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
    },
    title: {
        fontSize: 24,
        textAlign: "center",
    },
    text: {
        margin: 12,
        fontSize: 14,
        textAlign: "justify",
    },
    image: {
        width: 50,
        height: 25,
        position: "absolute",
        left: 15,
        top: 20,
    },
    header: {
        fontSize: 32,
        fontWeight: "ultrabold",
        textAlign: "center",
    },
    pageNumber: {
        position: "absolute",
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: "center",
        color: "grey",
    },
    consultantInfo: {
        marginBottom: 30,
        marginTop: 20,
    }
});


const PDFFile = (props) => {

    const [data, setData] = useState({});
    const [totalWorkedHours, setTotalWorkedHours] = useState(0);

    useEffect(() => {
        if (props.user && props.date) {
            const userDocRef = doc(database, "users", props.user.email);
            const timesheetDocRef = doc(userDocRef, "timesheets", props.date);

            getDoc(timesheetDocRef).then((doc) => {
                if (doc && doc.data() != undefined) {
                    const filteredData = Object.entries(doc.data()).filter(([key]) => key !== "approved")
                    setData(filteredData);
                }
            });
        }
    }, [props])

    useEffect(() => {
        getTotal();
    }, [data]);

    function getTotal() {
        if (data) {
            var totalWorkedHours = 0
            for (let j=0; j<data.length; j++) {
                const rowData = data[j][1];

                if (rowData != undefined) {
                    let daysData = [
                        rowData.Sun,
                        rowData.Mon,
                        rowData.Tue,
                        rowData.Wed,
                        rowData.Thu,
                        rowData.Fri,
                        rowData.Sat
                    ]

                    for (let i = 1; i <= 7; i++) {
                        totalWorkedHours += Number(daysData[i-1]);
                    }
                }
            }

            setTotalWorkedHours(totalWorkedHours);
        }
    }

    return (
        <Document>
            <Page style={styles.body}>
                <Image style={styles.image} src={fdmLogo}/>
                <Text style={styles.header}>Invoice</Text>
                {props && data && totalWorkedHours && (
                    <div style={styles.consultantInfo}>
                        <Text style={styles.text}>
                            Name: {props.user.name}
                        </Text>
                        <Text style={styles.text}>
                            Email: {props.user.email}
                        </Text>
                        <Text style={styles.text}>
                            Date: {props.date}
                        </Text>
                        <Text style={styles.text}>
                            Total Worked Hours: {totalWorkedHours}
                        </Text>
                        <Text>hi</Text>
                    </div>
                    )}
                <Text style={styles.pageNumber} render={({pageNumber}) => `${pageNumber}`} fixed/>
            </Page>
        </Document>
    )
};

export default PDFFile;