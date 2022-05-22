import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
  Svg,
  Path,
} from "@react-pdf/renderer";
import { COLORS } from "../other/constants";
import styled from "styled-components";

const styles = StyleSheet.create({
  page: {
    display: "flex",
    backgroundColor: COLORS.LIGHT_DARK,
    alignItems: "center",
  },
  name: {
    color: COLORS.LIGHT,
    textAlign: "center",
    fontWeight: 900,
    textTransform: "uppercase",
    marginTop: "10px",
    fontSize: "20px",
  },
  wrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  view: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
  },
  image: {
    border: `2px solid ${COLORS.LIGHT}`,
    borderRadius: "3px",
    width: "140px",
    height: "140px",
    margin: "0 auto",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  svg: {
    width: 290,
    height: 290,
    transform: "translate(3px, 32px) scale(1.15)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

const Wrap = styled.div`
    display: flex;
  `,
  Download = styled.div`
    margin-left: 10px;
    padding: 5px;
    text-transform: uppercase;
    font-weight: bold;
    justify-content: center;
    margin: 47px 0;
  `,
  QRCodeWrap = styled.div`
    background-color: ${COLORS.DARK};
    border-radius: 5px;
  `,
  QRCodeStyles = styled(QRCode)`
    border-radius: 3px;
  `;

export const QRGenerator = ({ value, id, place }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    document.getElementById(id) &&
      setData(document.getElementById(id).toDataURL());
  }, [id]);

  return (
    <Wrap>
      <QRCodeWrap>
        <QRCodeStyles
          id={id}
          value={value}
          size={128}
          bgColor={"transparent"}
          fgColor={COLORS.LIGHT}
          level="H"
          includeMargin={true}
        />
      </QRCodeWrap>

      {data && (
        <PDFDownloadLink
          document={
            <Document>
              <Page size={{ width: "300", height: "300" }} style={styles.page}>
                <Svg x="0px" y="0px" viewBox="0 0 1000 1000" style={styles.svg}>
                  <Path
                    fill={"#3d6183"}
                    d="M395.8,264.5H116.77c-16.98,0-30.75-13.77-30.75-30.75v-49.43c0-17.22,13.96-31.19,31.19-31.19H395.8
	c0.24,0,0.43,0.19,0.43,0.43v110.5C396.23,264.3,396.04,264.5,395.8,264.5z"
                  />
                  <Path
                    fill={"#3d6183"}
                    d="M86.02,742.63V636.32c0-16.98,13.77-30.75,30.75-30.75h57.36c16.6,0,30.06,13.46,30.06,30.06v109.15H88.17
	C86.98,744.77,86.02,743.82,86.02,742.63z"
                  />
                  <Path
                    fill={"#3d6183"}
                    d="M396.23,821.34H116.77c-16.98,0-30.75-13.77-30.75-30.75v-49.43c0-17.22,13.96-31.19,31.19-31.19h279.03V821.34
	z"
                  />
                  <Path
                    fill={"#3d6183"}
                    d="M913.26,182.3V791.4c0,16.53-13.4,29.94-29.94,29.94h-54.31c-18.74,0-33.93-15.19-33.93-33.93V182.3
	c0-16.53,13.4-29.94,29.94-29.94h58.3C899.85,152.36,913.26,165.76,913.26,182.3z"
                  />
                  <Path fill={"#3d6183"} d="M581.95,424.19" />
                  <Path
                    fill={"#3d6183"}
                    d="M604.23,241.88c0.54,0.79,1.05,1.61,1.53,2.46l287.3,513.34c8.02,14.33,2.89,31.72-11.44,38.84l-43.03,21.39
	c-14.34,7.13-32.46,1.29-40.48-13.04L601.66,453.86"
                  />
                  <Path fill={"#3d6183"} d="M586.22,423.17" />
                  <Path
                    fill={"#3d6183"}
                    d="M531.24,111.37h-63.21c-15.18,0-27.49-12.31-27.49-27.49v-56.4C440.55,12.31,452.86,0,468.04,0h63.21
	c15.18,0,27.49,12.31,27.49,27.49v56.4C558.73,99.06,546.42,111.37,531.24,111.37z"
                  />
                  <Path
                    fill={"#3d6183"}
                    d="M440.55,817.75V156.72c0-1.98,1.61-3.59,3.59-3.59h110.99c1.98,0,3.59,1.61,3.59,3.59v633.87
	c0,16.98-13.77,30.75-30.75,30.75h-83.83C442.16,821.34,440.55,819.73,440.55,817.75z"
                  />
                </Svg>
                <View style={styles.wrap}>
                  <View style={styles.view}>
                    <Image src={data} style={styles.image} />
                    <Text style={styles.name}>{place.name}</Text>
                  </View>
                </View>
              </Page>
            </Document>
          }
          fileName={"qrcode.pdf"}
        >
          {({ loading }) =>
            loading ? (
              <Download>Loading</Download>
            ) : (
              <Download>Download</Download>
            )
          }
        </PDFDownloadLink>
      )}
    </Wrap>
  );
};
